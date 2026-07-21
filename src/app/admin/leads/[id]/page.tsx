import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getWhatsAppHref, type CrmLead, type CrmProject, type LeadEvent, type TeamMember } from '@/lib/crm';
import { AdminHeader } from '../../AdminHeader';
import { RealtimeRefresh } from '../../RealtimeRefresh';
import { LeadActivity, LeadWorkflowEditor, ProjectBriefEditor } from './LeadEditor';

export const dynamic = 'force-dynamic';

function phoneHref(value: string) {
  return `tel:${value.replace(/[^\d+]/g, '')}`;
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
        .select('id,created_at,updated_at,client_id,originating_lead_id,project_name,project_type,status,goals,pages,features,languages,content_status,brand_status,domain_status,hosting_status,reference_sites,budget,target_launch,developer_notes,created_by')
        .eq('client_id', client.id)
        .order('updated_at', { ascending: false })
    : { data: [], error: null };

  if (projectsError) console.error('CRM project query failed.', projectsError);

  const typedEvents = (events ?? []) as LeadEvent[];
  const typedProjects = (projects ?? []) as CrmProject[];
  const attribution = Object.entries(typedLead.attribution ?? {}).filter(([, value]) => value);
  const message = typedLead.message.trim() || 'No project message was provided.';

  const contactActions = (
    <>
      <a href={`mailto:${typedLead.email}`} className="crm-action-link"><Mail size={16} /> Email</a>
      {typedLead.phone && <a href={phoneHref(typedLead.phone)} className="crm-action-link"><Phone size={16} /> Call</a>}
      {typedLead.whatsapp && (
        <a href={getWhatsAppHref(typedLead.whatsapp)} target="_blank" rel="noreferrer" className="crm-primary-button">
          <MessageCircle size={16} /> WhatsApp
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
            <p>Received {formatReceived(typedLead.created_at)} · Managed by Karim</p>
          </div>
          <div className="crm-contact-actions">{contactActions}</div>
        </section>

        <div className="crm-detail-grid">
          <div className="crm-detail-stack">
            <ProjectBriefEditor lead={typedLead} projects={typedProjects} />

            <section className="crm-section">
              <header><h2>Client request</h2><span>Original message</span></header>
              <p className="crm-message">{message}</p>
            </section>

            <section className="crm-section">
              <header><h2>Contact</h2><span>Client details</span></header>
              <div className="crm-contact-grid">
                <div className="crm-data-cell"><span>Email</span><a href={`mailto:${typedLead.email}`}>{typedLead.email}</a></div>
                <div className="crm-data-cell"><span>Phone</span>{typedLead.phone ? <a href={phoneHref(typedLead.phone)}>{typedLead.phone}</a> : <strong>Not provided</strong>}</div>
                <div className="crm-data-cell"><span>WhatsApp</span>{typedLead.whatsapp ? <a href={getWhatsAppHref(typedLead.whatsapp)}>{typedLead.whatsapp}</a> : <strong>Not provided</strong>}</div>
                <div className="crm-data-cell"><span>Company</span><strong>{typedLead.company || 'Not provided'}</strong></div>
              </div>
            </section>

            {attribution.length > 0 && (
              <details className="crm-section crm-collapsible">
                <summary>Campaign attribution</summary>
                <div className="crm-attribution-grid">
                  {attribution.map(([key, value]) => (
                    <div className="crm-data-cell" key={key}><span>{key.replaceAll('_', ' ')}</span><strong>{String(value)}</strong></div>
                  ))}
                </div>
              </details>
            )}

            <LeadActivity leadId={typedLead.id} events={typedEvents} />
          </div>

          <LeadWorkflowEditor key={typedLead.updated_at} lead={typedLead} />
        </div>

        <div className="crm-mobile-contact" aria-label="Contact client">{contactActions}</div>
        <RealtimeRefresh tables={['leads', 'lead_events', 'crm_projects']} />
      </main>
    </>
  );
}
