import 'server-only';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { TeamMember } from '@/lib/crm';

export async function requireAdminMember() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect('/admin/login');

  const providers = Array.isArray(user.app_metadata.providers) ? user.app_metadata.providers : [];
  if (user.app_metadata.provider !== 'google' && !providers.includes('google')) redirect('/admin/login');

  const { data: isTeamMember, error: membershipError } = await supabase.rpc('is_team_member');
  if (membershipError || isTeamMember !== true) redirect('/admin/login?error=access');

  const { data: member, error: memberError } = await supabase
    .from('team_members')
    .select('email,name,role')
    .eq('email', user.email)
    .maybeSingle();

  if (memberError || !member) redirect('/admin/login?error=access');
  return { supabase, member: member as TeamMember };
}
