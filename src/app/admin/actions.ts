'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseLeadNote, parseLeadUpdate } from '@/lib/crm-actions';

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

  const providers = Array.isArray(user.app_metadata.providers) ? user.app_metadata.providers : [];
  if (user.app_metadata.provider !== 'google' && !providers.includes('google')) {
    return { error: 'Sign in with the approved Google account.' } as const;
  }

  const { data: member, error } = await supabase
    .from('team_members')
    .select('email,name,role')
    .eq('email', user.email)
    .maybeSingle();

  if (error || !member) return { error: 'This account is not authorized for the CRM.' } as const;

  return { supabase } as const;
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

  const { supabase } = context;
  if (parsed.value.assigned_to) {
    const { data: assignee, error: assigneeError } = await supabase
      .from('team_members')
      .select('email')
      .eq('email', parsed.value.assigned_to.toLowerCase())
      .maybeSingle();

    if (assigneeError || !assignee) {
      return { ok: false, error: 'Choose a valid WeReact team member.' };
    }
  }

  const { error } = await supabase.rpc('crm_update_lead', {
    p_lead_id: leadId,
    p_status: parsed.value.status,
    p_assigned_to: parsed.value.assigned_to,
    p_estimated_value: parsed.value.estimated_value,
    p_next_follow_up: parsed.value.next_follow_up,
    p_expected_updated_at: parsed.value.expected_updated_at,
  });

  if (error) {
    console.error('CRM lead update failed.', error);
    if (error.code === '40001') {
      return { ok: false, error: 'This lead changed in another session. Refresh before saving.' };
    }
    return { ok: false, error: 'Could not save this lead. Please try again.' };
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

  const { error } = await context.supabase.rpc('crm_add_lead_note', {
    p_lead_id: leadId,
    p_note: parsed.value,
  });

  if (error) {
    console.error('CRM note insert failed.', error);
    return { ok: false, error: 'Could not save the note. Please try again.' };
  }

  refreshLeadRoutes(leadId);
  return { ok: true };
}