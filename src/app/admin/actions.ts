'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseLeadNote, parseLeadUpdate } from '@/lib/crm-actions';
import type { LeadStatus } from '@/lib/crm';

export type CrmActionResult = {
  ok: boolean;
  error?: string;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getAuthorizedContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { error: 'Your CRM session has expired. Sign in again.' } as const;

  const { data: member, error } = await supabase
    .from('team_members')
    .select('email,name,role')
    .eq('email', user.email)
    .maybeSingle();

  if (error || !member) return { error: 'This account is not authorized for the CRM.' } as const;

  return { supabase, user, member } as const;
}

function refreshLeadRoutes(leadId: string) {
  revalidatePath('/admin');
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateLeadAction(leadId: string, input: unknown): Promise<CrmActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };

  const parsed = parseLeadUpdate(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { supabase, member } = context;
  const { data: current, error: readError } = await supabase
    .from('leads')
    .select('status')
    .eq('id', leadId)
    .maybeSingle();

  if (readError || !current) return { ok: false, error: 'Lead not found or no longer accessible.' };

  const previousStatus = current.status as LeadStatus;
  const update: Record<string, unknown> = { ...parsed.value };
  if (parsed.value.status === 'contacted' && previousStatus !== 'contacted') {
    update.last_contacted_at = new Date().toISOString();
  }

  const { error: updateError } = await supabase.from('leads').update(update).eq('id', leadId);
  if (updateError) {
    console.error('CRM lead update failed.', updateError);
    return { ok: false, error: 'Could not save this lead. Please try again.' };
  }

  if (previousStatus !== parsed.value.status) {
    const { error: eventError } = await supabase.from('lead_events').insert({
      lead_id: leadId,
      author: member.name ?? member.email,
      kind: 'status_change',
      body: `Status changed from ${previousStatus} to ${parsed.value.status}`,
      meta: { from: previousStatus, to: parsed.value.status },
    });
    if (eventError) console.error('CRM status event failed.', eventError);
  }

  refreshLeadRoutes(leadId);
  return { ok: true };
}

export async function addLeadNoteAction(leadId: string, note: unknown): Promise<CrmActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };

  const parsed = parseLeadNote(note);
  if (!parsed.valid) return { ok: false, error: parsed.error };

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { supabase, member } = context;
  const { error } = await supabase.from('lead_events').insert({
    lead_id: leadId,
    author: member.name ?? member.email,
    kind: 'note',
    body: parsed.value,
    meta: {},
  });

  if (error) {
    console.error('CRM note insert failed.', error);
    return { ok: false, error: 'Could not save the note. Please try again.' };
  }

  refreshLeadRoutes(leadId);
  return { ok: true };
}
