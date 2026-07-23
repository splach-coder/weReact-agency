'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminMember } from '@/lib/admin-auth';
import { parseAttentionMutation } from '@/lib/automation';

export type AttentionActionResult = {
  ok: boolean;
  error?: string;
};

export async function attentionMutationAction(input: unknown): Promise<AttentionActionResult> {
  const parsed = parseAttentionMutation(input);
  if (!parsed.valid) return { ok: false, error: parsed.error };

  const { supabase } = await requireAdminMember();
  const { error } = parsed.value.action === 'complete'
    ? await supabase.rpc('crm_complete_attention_item', {
        p_item_id: parsed.value.id,
      })
    : await supabase.rpc('crm_snooze_attention_item', {
        p_item_id: parsed.value.id,
        p_until: parsed.value.snoozeUntil,
      });

  if (error) {
    console.error('Attention item mutation failed.', error.message);
    return { ok: false, error: 'Could not update this task. Please try again.' };
  }

  revalidatePath('/admin');
  return { ok: true };
}
