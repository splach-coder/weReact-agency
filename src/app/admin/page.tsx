import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CrmLead, CrmProject, TeamMember } from '@/lib/crm';
import { AdminHeader } from './AdminHeader';
import { DashboardClient } from './DashboardClient';
import { RealtimeRefresh } from './RealtimeRefresh';
import { SignOutButton } from './SignOutButton';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect('/crm/login');

  const { data: member, error: memberError } = await supabase
    .from('team_members')
    .select('email,name,role')
    .eq('email', user.email)
    .maybeSingle();

  if (memberError || !member) {
    return (
      <main className="crm-error">
        <div>
          <p className="crm-eyebrow"><span /> Private workspace</p>
          <h1>Access is not enabled.</h1>
          <p>{user.email} is signed in, but this account is not on the WeReact CRM allowlist.</p>
          <div className="mt-6"><SignOutButton /></div>
        </div>
      </main>
    );
  }

  const [{ data: leads, error: leadsError }, { data: projects, error: projectsError }] = await Promise.all([
    supabase
      .from('leads')
      .select('id,created_at,updated_at,name,email,company,phone,whatsapp,message,status,source,attribution,notes,assigned_to,estimated_value,next_follow_up,last_contacted_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('crm_projects')
      .select('id,created_at,updated_at,client_id,originating_lead_id,project_name,project_type,status,goals,pages,features,languages,content_status,brand_status,domain_status,hosting_status,reference_sites,budget,target_launch,developer_notes,created_by')
      .order('updated_at', { ascending: false }),
  ]);

  if (leadsError || projectsError) {
    console.error('CRM dashboard query failed.', { leadsError, projectsError });
    return (
      <>
        <AdminHeader member={member as TeamMember} />
        <main className="crm-error"><div><h1>Could not load the workspace.</h1><p>Refresh once or try again shortly.</p></div></main>
      </>
    );
  }

  return (
    <>
      <AdminHeader member={member as TeamMember} />
      <DashboardClient leads={(leads ?? []) as CrmLead[]} projects={(projects ?? []) as CrmProject[]} />
      <RealtimeRefresh tables={['leads', 'crm_projects']} />
    </>
  );
}
