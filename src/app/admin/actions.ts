'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseLeadNote, parseLeadUpdate, parseManualLead, parseProjectBrief, parseProjectWorkItem } from '@/lib/crm-actions';
import { isLeadStatus, isProjectStatus } from '@/lib/crm';

export type CrmActionResult = {
  ok: boolean;
  error?: string;
  id?: string;
  leadId?: string;
  duplicate?: boolean;
  projectId?: string;
  updatedAt?: string;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function getAuthorizedContext() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

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
  revalidatePath('/admin/pipeline');
  revalidatePath('/crm');
  revalidatePath(`/admin/leads/${leadId}`);
}
function readMutationResult(data: unknown) {
  if (typeof data === 'string') return { id: data, updatedAt: undefined };
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { id: undefined, updatedAt: undefined };

  const result = data as Record<string, unknown>;
  const id = ['id', 'work_item_id', 'invoice_id']
    .map((key) => result[key])
    .find((value): value is string => typeof value === 'string');
  const updatedAt = ['updated_at', 'updatedAt']
    .map((key) => result[key])
    .find((value): value is string => typeof value === 'string');

  return { id, updatedAt };
}
export async function createManualLeadAction(input: unknown): Promise<CrmActionResult> {
  const parsed = parseManualLead(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { data, error } = await context.supabase.rpc('crm_create_manual_lead', {
    p_payload: parsed.value,
  });

  if (error) {
    console.error('CRM manual lead creation failed.', error);
    return { ok: false, error: 'Could not add this client. Please try again.' };
  }

  const result = data && typeof data === 'object' && !Array.isArray(data)
    ? data as Record<string, unknown>
    : {};
  const leadId = typeof result.lead_id === 'string' ? result.lead_id : '';

  if (!UUID_PATTERN.test(leadId)) {
    return { ok: false, error: 'The client was saved, but the record could not be opened.' };
  }

  refreshLeadRoutes(leadId);
  return { ok: true, leadId, duplicate: result.created === false };
}
export async function moveLeadStageAction(
  leadId: string,
  status: unknown,
  expectedUpdatedAt: unknown,
): Promise<CrmActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };
  if (!isLeadStatus(status)) return { ok: false, error: 'Choose a valid sales stage.' };

  const rawVersion = typeof expectedUpdatedAt === 'string' ? expectedUpdatedAt : '';
  const version = new Date(rawVersion);
  if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(rawVersion) || Number.isNaN(version.getTime())) {
    return { ok: false, error: 'Refresh before moving this client.' };
  }

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { data, error } = await context.supabase.rpc('crm_move_lead', {
    p_lead_id: leadId,
    p_status: status,
    p_expected_updated_at: version.toISOString(),
  });

  if (error) {
    console.error('CRM stage move failed.', error);
    return {
      ok: false,
      error: error.code === '40001'
        ? 'This client changed in another session. Refresh and try again.'
        : 'Could not move this client. Please try again.',
    };
  }

  refreshLeadRoutes(leadId);
  return { ok: true, updatedAt: typeof data === 'string' ? data : undefined };
}

export async function moveProjectStageAction(
  projectId: string,
  status: unknown,
  expectedUpdatedAt: unknown,
): Promise<CrmActionResult> {
  if (!UUID_PATTERN.test(projectId)) return { ok: false, error: 'Invalid project reference.' };
  if (!isProjectStatus(status) || !['ready_for_dev', 'building', 'review'].includes(status)) {
    return { ok: false, error: 'Choose a valid delivery stage.' };
  }

  const rawVersion = typeof expectedUpdatedAt === 'string' ? expectedUpdatedAt : '';
  const version = new Date(rawVersion);
  if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(rawVersion) || Number.isNaN(version.getTime())) {
    return { ok: false, error: 'Refresh before moving this project.' };
  }

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { data, error } = await context.supabase.rpc('crm_move_project', {
    p_project_id: projectId,
    p_status: status,
    p_expected_updated_at: version.toISOString(),
  });

  if (error) {
    console.error('CRM project stage move failed.', error);
    return {
      ok: false,
      error: error.code === '40001'
        ? 'This project changed in another session. Refresh and try again.'
        : 'Could not move this project. Please try again.',
    };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/pipeline');
  revalidatePath('/crm');
  return { ok: true, updatedAt: typeof data === 'string' ? data : undefined };
}
export async function updateLeadAction(leadId: string, input: unknown): Promise<CrmActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };

  const parsed = parseLeadUpdate(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { error } = await context.supabase.rpc('crm_update_sales', {
    p_lead_id: leadId,
    p_status: parsed.value.status,
    p_estimated_value: parsed.value.estimated_value,
    p_next_follow_up: parsed.value.next_follow_up,
    p_expected_updated_at: parsed.value.expected_updated_at,
  });

  if (error) {
    console.error('CRM sales update failed.', error);
    if (error.code === '40001') {
      return { ok: false, error: 'This client changed in another session. Refresh before saving.' };
    }
    return { ok: false, error: 'Could not save this sales update. Please try again.' };
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
      error: error.code === '40001'
        ? 'This website changed in another session. Refresh before saving.'
        : error.code === '22023'
          ? 'Complete the required project details before handoff.'
          : 'Could not save the project brief. Please try again.',
    };
  }

  const projectId = typeof data === 'string' ? data : undefined;
  let updatedAt: string | undefined;
  if (projectId) {
    const { data: version } = await context.supabase
      .from('crm_projects')
      .select('updated_at')
      .eq('id', projectId)
      .maybeSingle();
    updatedAt = typeof version?.updated_at === 'string' ? version.updated_at : undefined;
  }

  refreshLeadRoutes(leadId);
  return { ok: true, projectId, updatedAt };
}

export async function assignProjectDeveloperAction(
  leadId: string,
  projectId: string,
  developerEmail: unknown,
): Promise<CrmActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };
  if (!UUID_PATTERN.test(projectId)) return { ok: false, error: 'Invalid project reference.' };

  const normalizedDeveloperEmail = developerEmail === null
    ? null
    : typeof developerEmail === 'string'
      ? developerEmail.trim().toLowerCase()
      : '';
  if (normalizedDeveloperEmail !== null && (!normalizedDeveloperEmail || !EMAIL_PATTERN.test(normalizedDeveloperEmail))) {
    return { ok: false, error: 'Enter a valid developer email or clear the assignment.' };
  }

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { error } = await context.supabase.rpc('crm_assign_project_developer', {
    p_project_id: projectId,
    p_developer_email: normalizedDeveloperEmail,
  });

  if (error) {
    console.error('CRM project developer assignment failed.', error);
    return { ok: false, error: 'Could not update the project developer. Please try again.' };
  }

  refreshLeadRoutes(leadId);
  return { ok: true, projectId };
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

export async function saveProjectWorkItemAction(
  leadId: string,
  workItemId: string | null,
  input: unknown,
): Promise<CrmActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };
  if (workItemId !== null && !UUID_PATTERN.test(workItemId)) {
    return { ok: false, error: 'Invalid work item reference.' };
  }

  const parsed = parseProjectWorkItem(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { data, error } = await context.supabase.rpc('crm_save_project_work_item', {
    p_project_id: parsed.value.project_id,
    p_work_item_id: workItemId,
    p_item: parsed.value,
  });

  if (error) {
    console.error('CRM work item save failed.', error);
    return {
      ok: false,
      error: error.code === '40001'
        ? 'This work item changed in another session. Refresh and try again.'
        : 'Could not save this work item. Please try again.',
    };
  }

  const result = readMutationResult(data);
  refreshLeadRoutes(leadId);
  return { ok: true, id: result.id ?? workItemId ?? undefined, updatedAt: result.updatedAt };
}

export async function deleteProjectWorkItemAction(
  leadId: string,
  projectId: string,
  workItemId: string,
): Promise<CrmActionResult> {
  if (!UUID_PATTERN.test(leadId)) return { ok: false, error: 'Invalid lead reference.' };
  if (!UUID_PATTERN.test(projectId)) return { ok: false, error: 'Invalid project reference.' };
  if (!UUID_PATTERN.test(workItemId)) return { ok: false, error: 'Invalid work item reference.' };

  const context = await getAuthorizedContext();
  if ('error' in context) return { ok: false, error: context.error };

  const { error } = await context.supabase.rpc('crm_delete_project_work_item', {
    p_project_id: projectId,
    p_work_item_id: workItemId,
  });

  if (error) {
    console.error('CRM work item delete failed.', error);
    return {
      ok: false,
      error: error.code === '40001'
        ? 'This work item changed in another session. Refresh and try again.'
        : 'Could not delete this work item. Please try again.',
    };
  }

  refreshLeadRoutes(leadId);
  return { ok: true, id: workItemId, updatedAt: undefined };
}
