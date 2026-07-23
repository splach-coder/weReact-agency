'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminMember } from '@/lib/admin-auth';
import { buildNewsletterEmail } from '@/lib/newsletter-email';
import { parseFinanceEntry, parseInvoiceDraft, parseNewsletterCampaign } from '@/lib/operations';
import { siteConfig } from '@/config/site';

export type OperationsActionResult = { ok: boolean; error?: string; id?: string; updatedAt?: string; sent?: number; failed?: number };

export async function createFinanceTransactionAction(input: unknown): Promise<OperationsActionResult> {
  const parsed = parseFinanceEntry(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };
  const { supabase, member } = await requireAdminMember();
  const { error } = await supabase.from('finance_transactions').insert({ ...parsed.value, created_by: member.email.toLowerCase() });
  if (error) {
    console.error('Finance transaction insert failed.', error);
    return { ok: false, error: error.code === '42P01' ? 'Apply the agency operations database migration first.' : 'Could not save this transaction.' };
  }
  revalidatePath('/admin');
  revalidatePath('/admin/finance');
  return { ok: true };
}

export async function setSubscriberStatusAction(email: string, status: 'subscribed' | 'unsubscribed'): Promise<OperationsActionResult> {
  if (!/^\S+@\S+\.\S+$/.test(email) || !['subscribed', 'unsubscribed'].includes(status)) return { ok: false, error: 'Invalid subscriber update.' };
  const { supabase } = await requireAdminMember();
  const { error } = await supabase.from('newsletter_subscribers').update({ status }).eq('email', email.toLowerCase());
  if (error) return { ok: false, error: 'Could not update this subscriber.' };
  revalidatePath('/admin/newsletter');
  return { ok: true };
}

export async function sendNewsletterAction(input: unknown): Promise<OperationsActionResult> {
  const parsed = parseNewsletterCampaign(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'Resend is not configured on this deployment.' };

  const { supabase, member } = await requireAdminMember();
  const { data: subscribers, error: audienceError } = await supabase
    .from('newsletter_subscribers')
    .select('email,locale,unsubscribe_token')
    .eq('status', 'subscribed')
    .order('created_at', { ascending: true });
  if (audienceError) return { ok: false, error: 'Could not load the newsletter audience.' };
  if (!subscribers?.length) return { ok: false, error: 'There are no active subscribers yet.' };

  const { data: campaign, error: campaignError } = await supabase.from('newsletter_campaigns').insert({
    created_by: member.email.toLowerCase(),
    subject: parsed.value.subject,
    preview_text: parsed.value.preview,
    content: parsed.value.message,
    audience_count: subscribers.length,
    status: 'sending',
  }).select('id').single();
  if (campaignError || !campaign) return { ok: false, error: campaignError?.code === '42P01' ? 'Apply the agency operations database migration first.' : 'Could not create the campaign.' };

  const from = process.env.RESEND_FROM_EMAIL ?? 'WeReact <hello@wereact.agency>';
  let sent = 0;
  let failed = 0;
  for (let index = 0; index < subscribers.length; index += 25) {
    const batch = subscribers.slice(index, index + 25);
    const results = await Promise.all(batch.map(async (subscriber) => {
      try {
        const unsubscribeUrl = `${siteConfig.url}/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`;
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from,
            to: subscriber.email,
            reply_to: siteConfig.business.email,
            subject: parsed.value.subject,
            html: buildNewsletterEmail({ ...parsed.value, unsubscribeToken: subscriber.unsubscribe_token }),
            headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
          }),
        });
        if (!response.ok) console.error('Newsletter recipient failed.', subscriber.email, await response.text());
        return response.ok;
      } catch (error) {
        console.error('Newsletter recipient threw.', subscriber.email, error);
        return false;
      }
    }));
    sent += results.filter(Boolean).length;
    failed += results.filter((result) => !result).length;
  }

  const status = sent === 0 ? 'failed' : failed > 0 ? 'partial' : 'sent';
  await supabase.from('newsletter_campaigns').update({ sent_at: new Date().toISOString(), sent_count: sent, failed_count: failed, status }).eq('id', campaign.id);
  revalidatePath('/admin/newsletter');
  return { ok: sent > 0, error: sent === 0 ? 'The campaign could not be delivered.' : undefined, sent, failed };
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readInvoiceMutationResult(data: unknown) {
  if (typeof data === 'string') return { id: data, updatedAt: undefined };
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { id: undefined, updatedAt: undefined };

  const result = data as Record<string, unknown>;
  const id = ['id', 'invoice_id']
    .map((key) => result[key])
    .find((value): value is string => typeof value === 'string');
  const updatedAt = ['updated_at', 'updatedAt']
    .map((key) => result[key])
    .find((value): value is string => typeof value === 'string');

  return { id, updatedAt };
}

function refreshInvoiceRoutes(leadId: string) {
  revalidatePath('/admin');
  revalidatePath(`/admin/leads/${leadId}`);
}

function invoiceMutationError(error: { code?: string }, fallback: string): OperationsActionResult {
  console.error('Invoice mutation failed.', error);
  return {
    ok: false,
    error: error.code === '40001'
      ? 'This invoice changed in another session. Refresh and try again.'
      : fallback,
  };
}

export async function createInvoiceDraftAction(leadId: string, input: unknown): Promise<OperationsActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };
  const parsed = parseInvoiceDraft(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };

  const { supabase } = await requireAdminMember();
  const { data, error } = await supabase.rpc('crm_create_invoice_draft', {
    p_project_id: parsed.value.project_id,
    p_draft: parsed.value,
  });
  if (error) return invoiceMutationError(error, 'Could not create this invoice draft. Please try again.');

  const result = readInvoiceMutationResult(data);
  refreshInvoiceRoutes(leadId);
  return { ok: true, id: typeof data === 'string' ? data : result.id, updatedAt: result.updatedAt };
}

export async function updateInvoiceDraftAction(
  leadId: string,
  invoiceId: string,
  input: unknown,
): Promise<OperationsActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };
  if (!UUID_PATTERN.test(invoiceId)) return { ok: false, error: 'Invalid invoice reference.' };
  const parsed = parseInvoiceDraft(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };

  const { supabase } = await requireAdminMember();
  const { data, error } = await supabase.rpc('crm_update_invoice_draft', {
    p_invoice_id: invoiceId,
    p_draft: parsed.value,
  });
  if (error) return invoiceMutationError(error, 'Could not save this invoice draft. Please try again.');

  refreshInvoiceRoutes(leadId);
  return { ok: true, id: invoiceId, updatedAt: undefined };
}

export async function issueInvoiceAction(leadId: string, invoiceId: string): Promise<OperationsActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };
  if (!UUID_PATTERN.test(invoiceId)) return { ok: false, error: 'Invalid invoice reference.' };

  const { supabase } = await requireAdminMember();
  const { error } = await supabase.rpc('crm_issue_invoice', { p_invoice_id: invoiceId });
  if (error) return invoiceMutationError(error, 'Could not issue this invoice. Please try again.');

  refreshInvoiceRoutes(leadId);
  return { ok: true, id: invoiceId, updatedAt: undefined };
}

export async function voidInvoiceAction(leadId: string, invoiceId: string): Promise<OperationsActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };
  if (!UUID_PATTERN.test(invoiceId)) return { ok: false, error: 'Invalid invoice reference.' };

  const { supabase } = await requireAdminMember();
  const { error } = await supabase.rpc('crm_void_invoice', { p_invoice_id: invoiceId });
  if (error) return invoiceMutationError(error, 'Could not void this invoice. Please try again.');

  refreshInvoiceRoutes(leadId);
  return { ok: true, id: invoiceId, updatedAt: undefined };
}
