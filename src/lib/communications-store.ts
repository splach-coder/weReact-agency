import 'server-only';
import { createClient } from '@supabase/supabase-js';

export type OutboundCommunication = {
  providerMessageId: string;
  from: string;
  to: string;
  subject: string;
  body_summary: string;
  lead_id?: string | null;
  client_id?: string | null;
  project_id?: string | null;
  invoice_id?: string | null;
  approved_by?: string | null;
};

export async function recordOutboundCommunication(input: OutboundCommunication) {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error('Outbound communication storage is not configured.');
    return { stored: false as const, reason: 'not_configured' as const };
  }

  const now = new Date().toISOString();
  try {
    const supabase = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase.from('communications').upsert({
      channel: 'email',
      direction: 'outbound',
      provider: 'resend',
      provider_message_id: input.providerMessageId,
      state: 'sent',
      from_address: input.from,
      to_address: input.to,
      subject: input.subject,
      body_summary: input.body_summary.slice(0, 2000),
      lead_id: input.lead_id ?? null,
      client_id: input.client_id ?? null,
      project_id: input.project_id ?? null,
      invoice_id: input.invoice_id ?? null,
      approved_by: input.approved_by ?? null,
      approved_at: input.approved_by ? now : null,
      sent_at: now,
    }, { onConflict: 'provider,provider_message_id' });

    if (error) {
      console.error('Outbound communication storage failed.', error.message);
      return { stored: false as const, reason: 'storage_failed' as const };
    }
    return { stored: true as const };
  } catch (error) {
    console.error('Outbound communication storage threw.', error);
    return { stored: false as const, reason: 'storage_failed' as const };
  }
}
