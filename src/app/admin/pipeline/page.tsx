import { requireAdminMember } from '@/lib/admin-auth';
import type { CrmLead, CrmProject } from '@/lib/crm';
import { AdminShell } from '../AdminShell';
import { DashboardClient } from '../DashboardClient';
import { RealtimeRefresh } from '../RealtimeRefresh';

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
  const { supabase, member } = await requireAdminMember();
  const [{ data: leads, error: leadsError }, { data: projects, error: projectsError }] = await Promise.all([
    supabase.from('leads').select('id,created_at,updated_at,client_id,name,email,company,phone,whatsapp,message,status,source,attribution,notes,assigned_to,estimated_value,next_follow_up,last_contacted_at').order('created_at', { ascending: false }),
    supabase.from('crm_projects').select('id,created_at,updated_at,client_id,originating_lead_id,project_name,project_type,domain_name,status,goals,pages,features,languages,content_status,brand_status,domain_status,hosting_status,reference_sites,budget,target_launch,developer_notes,created_by').order('updated_at', { ascending: false }),
  ]);
  if (leadsError || projectsError) console.error('CRM pipeline query failed.', { leadsError, projectsError });
  const typedLeads = (leads ?? []).map((lead) => ({ ...lead, email: lead.email ?? '', phone: lead.phone ?? '' })) as CrmLead[];
  return <AdminShell member={member}><DashboardClient leads={typedLeads} projects={(projects ?? []) as CrmProject[]} /><RealtimeRefresh tables={['leads', 'crm_projects']} /></AdminShell>;
}
