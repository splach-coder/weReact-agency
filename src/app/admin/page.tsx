import { requireAdminMember } from '@/lib/admin-auth';
import type { CrmLead, CrmProject } from '@/lib/crm';
import type { FinanceTransaction } from '@/lib/operations';
import { AdminShell } from './AdminShell';
import { OverviewDashboard } from './OverviewDashboard';
import { RealtimeRefresh } from './RealtimeRefresh';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const { supabase, member } = await requireAdminMember();
  const [leadsResult, projectsResult, financeResult, subscriberResult] = await Promise.all([
    supabase.from('leads').select('id,created_at,updated_at,client_id,name,email,company,phone,whatsapp,message,status,source,attribution,notes,assigned_to,estimated_value,next_follow_up,last_contacted_at').order('created_at', { ascending: false }),
    supabase.from('crm_projects').select('id,created_at,updated_at,client_id,originating_lead_id,project_name,project_type,domain_name,status,goals,pages,features,languages,content_status,brand_status,domain_status,hosting_status,reference_sites,budget,target_launch,developer_notes,created_by').order('updated_at', { ascending: false }),
    supabase.from('finance_transactions').select('id,created_at,occurred_on,type,status,amount,category,description,reference,client_id,project_id,source,created_by').order('occurred_on', { ascending: false }),
    supabase.from('newsletter_subscribers').select('email', { count: 'exact', head: true }).eq('status', 'subscribed'),
  ]);
  if (leadsResult.error || projectsResult.error) console.error('Agency overview query failed.', { leads: leadsResult.error, projects: projectsResult.error });
  if (financeResult.error && financeResult.error.code !== '42P01') console.error('Finance overview query failed.', financeResult.error);
  if (subscriberResult.error) console.error('Newsletter overview query failed.', subscriberResult.error);
  const leads = (leadsResult.data ?? []).map((lead) => ({ ...lead, email: lead.email ?? '', phone: lead.phone ?? '' })) as CrmLead[];
  return (
    <AdminShell member={member}>
      <OverviewDashboard leads={leads} projects={(projectsResult.data ?? []) as CrmProject[]} finances={(financeResult.data ?? []) as FinanceTransaction[]} subscriberCount={subscriberResult.count ?? 0} />
      <RealtimeRefresh tables={['leads', 'crm_projects', 'finance_transactions', 'newsletter_subscribers']} />
    </AdminShell>
  );
}
