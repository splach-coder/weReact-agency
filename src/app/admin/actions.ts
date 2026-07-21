'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseLeadNote, parseLeadUpdate, parseProjectBrief } from '@/lib/crm-actions';
import { DEFAULT_SELLER_EMAIL } from '@/lib/crm';

export type CrmActionResult = {
  ok: boolean;
  error?: string;
  projectId?: string;
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

  return { supabase, member } as const;
}

function refreshLeadRoutes(leadId: string) {
  revalidatePath('/admin');
  revalidatePath('/crm');
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateLeadAction(leadId: string, input: unknown): Promise<CrmActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };

  const parsed = parseLeadUpdate(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { error } = await context.supabase.rpc('crm_update_lead', {
    p_lead_id: leadId,
    p_status: parsed.value.status,
    p_assigned_to: DEFAULT_SELLER_EMAIL,
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

export async function saveProjectBriefAction(leadId: string, input: unknown): Promise<CrmActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };

  const parsed = parseProjectBrief(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { data, error } = await context.supabase.rpc('crm_upsert_project', {
    p_lead_id: leadId,
    p_project_id: parsed.value.project_id,
    p_brief: parsed.value,
  });

  if (error) {
    console.error('CRM project brief save failed.', error);
    return {
      ok: false,
      error: error.code === '22023'
        ? 'Complete the required project details before handoff.'
        : 'Could not save the project brief. Please try again.',
    };
  }

  refreshLeadRoutes(leadId);
  return { ok: true, projectId: typeof data === 'string' ? data : undefined };
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
