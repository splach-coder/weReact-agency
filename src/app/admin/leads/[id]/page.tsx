import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getWhatsAppHref, type CrmLead, type CrmProject, type LeadEvent, type TeamMember } from '@/lib/crm';
import { AdminHeader } from '../../AdminHeader';
import { RealtimeRefresh } from '../../RealtimeRefresh';
import { LeadActivity, LeadWorkflowEditor, ProjectBriefEditor } from './LeadEditor';
import { CopyButton, WhatsAppIcon } from './CopyButton';

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

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
      .select('id,created_at,updated_at,name,email,company,phone,whatsapp,message,status,source,attribution,notes,assigned_to,estimated_value,next_follow_up,last_contacted_at')
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
      <>
        <AdminHeader member={member as TeamMember} />
        <main className="crm-error"><div><h1>Could not load this client.</h1><p>Refresh the page or return to the dashboard.</p></div></main>
      </>
    );
  }

  const typedLead = lead as CrmLead;
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('email', typedLead.email.toLowerCase())
    .maybeSingle();

  const { data: projects, error: projectsError } = client
    ? await supabase
        .from('crm_projects')
        .select('id,created_at,updated_at,client_id,originating_lead_id,project_name,project_type,domain_name,status,goals,pages,features,languages,content_status,brand_status,domain_status,hosting_status,reference_sites,budget,target_launch,developer_notes,created_by')
        .eq('client_id', client.id)
        .order('updated_at', { ascending: false })
    : { data: [], error: null };

  if (projectsError) console.error('CRM project query failed.', projectsError);

  const typedEvents = (events ?? []) as LeadEvent[];
  const typedProjects = (projects ?? []) as CrmProject[];
  const attributionEntries = Object.entries(typedLead.attribution ?? {}).filter(([, value]) => value);
  const technicalKeys = new Set(['transaction_id', 'submission_id', 'message_id', 'request_id']);
  const acquisition = attributionEntries.filter(([key]) => !technicalKeys.has(key.toLowerCase()));
  const technicalAttribution = attributionEntries.filter(([key]) => technicalKeys.has(key.toLowerCase()));
  const message = typedLead.message.trim() || 'No project message was provided.';

  const contactActions = (
    <>
      <a href={'mailto:' + typedLead.email} className="crm-action-link"><Mail size={16} /> Email</a>
      {typedLead.phone && <a href={phoneHref(typedLead.phone)} className="crm-action-link"><Phone size={16} /> Call</a>}
      {typedLead.whatsapp && (
        <a href={getWhatsAppHref(typedLead.whatsapp)} target="_blank" rel="noreferrer" className="crm-primary-button">
          <WhatsAppIcon size={17} /> WhatsApp
        </a>
      )}
    </>
  );

  return (
    <>
      <AdminHeader member={member as TeamMember} />
      <main className="crm-detail">
        <Link href="/admin" className="crm-back-link"><ArrowLeft size={16} /> Pipeline</Link>

        <section className="crm-detail-hero">
          <div>
            <p className="crm-eyebrow"><span /> {typedLead.company || 'Website enquiry'}</p>
            <h1>{typedLead.name}</h1>
            <p>Received {formatReceived(typedLead.created_at)}</p>
          </div>
          <div className="crm-contact-actions">{contactActions}</div>
        </section>

        <div className="crm-detail-grid">
          <div className="crm-detail-stack">
            <section className="crm-section">
              <header><h2>Contact</h2><span>Client details</span></header>
              <div className="crm-contact-grid">
                <div className="crm-data-cell crm-data-cell--action">
                  <span>Email</span>
                  <div><a href={'mailto:' + typedLead.email}>{typedLead.email}</a><CopyButton value={typedLead.email} label="Copy email" /></div>
                </div>
                <div className="crm-data-cell crm-data-cell--action">
                  <span>Phone</span>
                  {typedLead.phone
                    ? <div><a href={phoneHref(typedLead.phone)}>{typedLead.phone}</a><CopyButton value={typedLead.phone} label="Copy phone" /></div>
                    : <strong>Not provided</strong>}
                </div>
                <div className="crm-data-cell crm-data-cell--action">
                  <span>WhatsApp</span>
                  {typedLead.whatsapp
                    ? <div><a href={getWhatsAppHref(typedLead.whatsapp)} target="_blank" rel="noreferrer"><WhatsAppIcon size={16} /> {typedLead.whatsapp}</a><CopyButton value={typedLead.whatsapp} label="Copy WhatsApp number" /></div>
                    : <strong>Not provided</strong>}
                </div>
                <div className="crm-data-cell"><span>Company</span><strong>{typedLead.company || 'Not provided'}</strong></div>
              </div>
            </section>

            <section className="crm-section">
              <header><h2>Original request</h2><span>Submitted by the client</span></header>
              <p className="crm-message">{message}</p>
            </section>

            <ProjectBriefEditor key={typedProjects.map((project) => project.id + ':' + project.updated_at).join('|') || 'new'} lead={typedLead} projects={typedProjects} />

            <LeadActivity leadId={typedLead.id} events={typedEvents} />

            {acquisition.length > 0 && (
              <details className="crm-section crm-collapsible">
                <summary>
                  <span>Acquisition</span>
                  <small>{acquisition.length} fields</small>
                </summary>
                <div className="crm-attribution-grid crm-collapsible__content">
                  {acquisition.map(([key, value]) => (
                    <div className="crm-data-cell" key={key}><span>{dataLabel(key)}</span><strong>{String(value)}</strong></div>
                  ))}
                </div>
              </details>
            )}

            <details className="crm-section crm-collapsible">
              <summary>
                <span>Technical details</span>
                <small>IDs and timestamps</small>
              </summary>
              <div className="crm-attribution-grid crm-collapsible__content">
                <div className="crm-data-cell crm-data-cell--action">
                  <span>Lead ID</span>
                  <div><strong>{typedLead.id}</strong><CopyButton value={typedLead.id} label="Copy lead ID" /></div>
                </div>
                <div className="crm-data-cell"><span>Source</span><strong>{typedLead.source || 'Unknown'}</strong></div>
                <div className="crm-data-cell"><span>Created</span><strong>{formatReceived(typedLead.created_at)}</strong></div>
                <div className="crm-data-cell"><span>Last updated</span><strong>{formatReceived(typedLead.updated_at)}</strong></div>
                {client?.id && (
                  <div className="crm-data-cell crm-data-cell--action">
                    <span>Client ID</span>
                    <div><strong>{client.id}</strong><CopyButton value={client.id} label="Copy client ID" /></div>
                  </div>
                )}
                {technicalAttribution.map(([key, value]) => (
                  <div className="crm-data-cell crm-data-cell--action" key={key}>
                    <span>{dataLabel(key)}</span>
                    <div><strong>{String(value)}</strong><CopyButton value={String(value)} label={'Copy ' + dataLabel(key)} /></div>
                  </div>
                ))}
              </div>
            </details>
          </div>

          <LeadWorkflowEditor key={typedLead.updated_at} lead={typedLead} />
        </div>

        <div className="crm-mobile-contact" aria-label="Contact client">{contactActions}</div>
        <RealtimeRefresh tables={['leads', 'lead_events', 'crm_projects']} />
      </main>
    </>
  );
}
