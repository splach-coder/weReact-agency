import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getWhatsAppHref, type CrmLead, type CrmProject, type LeadEvent, type ProjectWorkItem, type TeamMember } from '@/lib/crm';
import type { Invoice, InvoiceLine } from '@/lib/operations';
import { AdminShell } from '../../AdminShell';
import { RealtimeRefresh } from '../../RealtimeRefresh';
import { LeadWorkflowEditor, ProjectBriefEditor } from './LeadEditor';
import { WhatsAppIcon } from './CopyButton';
import { ClientDetailPanels } from './ClientDetailPanels';

export const dynamic = 'force-dynamic';

function phoneHref(value: string) {
  return 'tel:' + value.replace(/[^\d+]/g, '');
}

function formatReceived(value: string) {
  return new Intl.DateTimeFormat('en-MA', {
    timeZone: 'Africa/Casablanca',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function dataLabel(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const [{ id }, { project: initialProjectId }] = await Promise.all([params, searchParams]);
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect('/crm/login');

  const { data: member } = await supabase
    .from('team_members')
    .select('email,name,role')
    .eq('email', user.email)
    .maybeSingle();
  if (!member) redirect('/admin');

  const [{ data: lead, error: leadError }, { data: events, error: eventsError }] = await Promise.all([
    supabase
      .from('leads')
      .select('id,created_at,updated_at,client_id,name,email,company,phone,whatsapp,message,status,source,attribution,notes,assigned_to,estimated_value,next_follow_up,last_contacted_at')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('lead_events')
      .select('id,lead_id,created_at,author,kind,body,meta')
      .eq('lead_id', id)
      .order('created_at', { ascending: false }),
  ]);

  if (!lead && !leadError) notFound();
  if (leadError || eventsError || !lead) {
    console.error('CRM lead detail query failed.', { leadError, eventsError });
    return (
      <AdminShell member={member as TeamMember}>
        <main className="crm-error"><div><h1>Could not load this client.</h1><p>Refresh the page or return to the dashboard.</p></div></main>
      </AdminShell>
    );
  }

  const typedLead = { ...lead, email: lead.email ?? '', phone: lead.phone ?? '' } as CrmLead;
  let client: { id: string } | null = typedLead.client_id ? { id: typedLead.client_id } : null;

  if (!client && typedLead.email) {
    const { data } = await supabase
      .from('clients')
      .select('id')
      .eq('email', typedLead.email.toLowerCase())
      .maybeSingle();
    client = data;
  }
  const { data: projects, error: projectsError } = client
    ? await supabase
        .from('crm_projects')
        .select('id,created_at,updated_at,client_id,originating_lead_id,project_name,project_type,domain_name,status,goals,pages,features,languages,content_status,brand_status,domain_status,hosting_status,reference_sites,budget,target_launch,developer_notes,created_by,assigned_developer_email')
        .eq('client_id', client.id)
        .order('updated_at', { ascending: false })
    : { data: [], error: null };

  if (projectsError) console.error('CRM project query failed.', projectsError);

  const typedEvents = (events ?? []) as LeadEvent[];
  const typedProjects = (projects ?? []) as CrmProject[];
  const selectedProject = typedProjects.find((project) => project.id === initialProjectId) ?? typedProjects[0] ?? null;
  const [teamMembersResult, workItemsResult, invoicesResult, invoiceLinesResult] = selectedProject
    ? await Promise.all([
        supabase.from('team_members').select('email,name,role').order('name', { ascending: true }),
        supabase
          .from('project_work_items')
          .select('id,project_id,kind,title,details,status,priority,due_on,assigned_to,required,position,completed_at,created_at,updated_at')
          .eq('project_id', selectedProject.id)
          .order('position', { ascending: true }),
        supabase
          .from('invoices')
          .select('id,project_id,client_id,finance_transaction_id,number,status,issued_on,due_on,paid_on,currency,subtotal,total,notes,seller_snapshot,customer_snapshot,created_by,created_at,updated_at')
          .eq('project_id', selectedProject.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('invoice_lines')
          .select('id,invoice_id,description,quantity,unit_price,line_total,position,invoices!inner(project_id)')
          .eq('invoices.project_id', selectedProject.id)
          .order('position', { ascending: true }),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
        { data: [], error: null },
        { data: [], error: null },
      ];

  if (workItemsResult.error || invoicesResult.error || invoiceLinesResult.error || teamMembersResult.error) {
    console.error('CRM project workspace query failed.', {
      workItemsError: workItemsResult.error,
      invoicesError: invoicesResult.error,
      invoiceLinesError: invoiceLinesResult.error,
      teamMembersError: teamMembersResult.error,
    });
  }

  // These remain scoped to the selected project for the workspace introduced in Task 4.
  const projectWorkspace = {
    teamMembers: (teamMembersResult.data ?? []) as TeamMember[],
    workItems: (workItemsResult.data ?? []) as ProjectWorkItem[],
    invoices: (invoicesResult.data ?? []) as Invoice[],
    invoiceLines: (invoiceLinesResult.data ?? []) as InvoiceLine[],
  };
  void projectWorkspace;
  const attributionEntries = Object.entries(typedLead.attribution ?? {}).filter(([, value]) => value);
  const technicalKeys = new Set(['transaction_id', 'submission_id', 'message_id', 'request_id']);
  const acquisition = attributionEntries.filter(([key]) => !technicalKeys.has(key.toLowerCase()));
  const technicalAttribution = attributionEntries.filter(([key]) => technicalKeys.has(key.toLowerCase()));
  const message = typedLead.message.trim() || 'No project message was provided.';

  const contactActions = (
    <>
      {typedLead.email && <a href={'mailto:' + typedLead.email} className="crm-action-link"><Mail size={16} /> Email</a>}
      {typedLead.phone && <a href={phoneHref(typedLead.phone)} className="crm-action-link"><Phone size={16} /> Call</a>}
      {typedLead.whatsapp && (
        <a href={getWhatsAppHref(typedLead.whatsapp)} target="_blank" rel="noreferrer" className="crm-primary-button">
          <WhatsAppIcon size={17} /> WhatsApp
        </a>
      )}
    </>
  );

  return (
    <AdminShell member={member as TeamMember}>
      <main className="crm-detail crm-client-page">
        <div className="crm-client-commandbar">
          <Link href="/admin/pipeline" className="crm-back-link"><ArrowLeft size={16} /> Pipeline</Link>
          <ClientDetailPanels
            lead={typedLead}
            events={typedEvents}
            received={formatReceived(typedLead.created_at)}
            clientId={client?.id}
            acquisition={acquisition.map(([key, value]) => ({ label: dataLabel(key), value: String(value) }))}
            technical={[
              { label: 'Created', value: formatReceived(typedLead.created_at) },
              { label: 'Last updated', value: formatReceived(typedLead.updated_at) },
              ...technicalAttribution.map(([key, value]) => ({ label: dataLabel(key), value: String(value) })),
            ]}
          />
        </div>

        <section className="crm-client-hero">
          <div>
            <p className="crm-eyebrow"><span /> {typedLead.company || 'Website enquiry'}</p>
            <h1>{typedLead.name}</h1>
            <p>{typedLead.email || typedLead.whatsapp || typedLead.phone || 'No contact details'}</p>
          </div>
          <div className="crm-contact-actions">{contactActions}</div>
        </section>

        <section className="crm-client-request">
          <div>
            <span>Client request</span>
            <small>Submitted {formatReceived(typedLead.created_at)}</small>
          </div>
          <p>{message}</p>
        </section>

        <div className="crm-client-workspace">
          {typedLead.status !== 'won' && (
            <LeadWorkflowEditor key={typedLead.updated_at} lead={typedLead} hasProjects={typedProjects.length > 0} />
          )}

          <ProjectBriefEditor
            key={(initialProjectId ?? 'default') + ':' + (typedProjects.map((project) => project.id + ':' + project.updated_at).join('|') || 'new')}
            lead={typedLead}
            projects={typedProjects}
            initialProjectId={initialProjectId}
          />
        </div>

        <div className="crm-mobile-contact" aria-label="Contact client">{contactActions}</div>
        <RealtimeRefresh tables={['leads', 'lead_events', 'crm_projects', 'project_work_items', 'invoices', 'invoice_lines']} />
      </main>
    </AdminShell>
  );
}
