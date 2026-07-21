import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getWhatsAppHref, type CrmLead, type LeadEvent, type TeamMember } from '@/lib/crm';
import { AdminHeader } from '../../AdminHeader';
import { RealtimeRefresh } from '../../RealtimeRefresh';
import { LeadActivity, LeadWorkflowEditor } from './LeadEditor';

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

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect('/admin/login');

  const { data: member } = await supabase
    .from('team_members')
    .select('email,name,role')
    .eq('email', user.email)
    .maybeSingle();
  if (!member) redirect('/admin');

  const [
    { data: lead, error: leadError },
    { data: events, error: eventsError },
    { data: members, error: membersError },
  ] = await Promise.all([
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
    supabase
      .from('team_members')
      .select('email,name,role')
      .order('name', { ascending: true }),
  ]);

  if (!lead && !leadError) notFound();
  if (leadError || eventsError || membersError || !lead) {
    console.error('CRM lead detail query failed.', { leadError, eventsError, membersError });
    return (
      <>
        <AdminHeader member={member as TeamMember} />
        <main className="crm-error"><div><h1>Could not load this lead.</h1><p>Refresh the page or return to the dashboard.</p></div></main>
      </>
    );
  }

  const typedLead = lead as CrmLead;
  const typedEvents = (events ?? []) as LeadEvent[];
  const typedMembers = (members ?? []) as TeamMember[];
  const attribution = Object.entries(typedLead.attribution ?? {}).filter(([, value]) => value);
  const message = typedLead.message.trim() || 'No project message was provided.';

  return (
    <>
      <AdminHeader member={member as TeamMember} />
      <main className="crm-detail">
        <Link href="/admin" className="crm-back-link"><ArrowLeft size={15} /> Back to pipeline</Link>

        <section className="crm-detail-hero">
          <div>
            <p className="crm-eyebrow"><span /> {typedLead.company || 'Website enquiry'}</p>
            <h1>{typedLead.name}</h1>
            <p>Received {formatReceived(typedLead.created_at)} - {typedLead.source.replaceAll('_', ' ')}</p>
          </div>

          <div className="crm-contact-actions">
            <a href={`mailto:${typedLead.email}`} className="crm-action-link"><Mail size={15} /> Email</a>
            {typedLead.phone && <a href={phoneHref(typedLead.phone)} className="crm-action-link"><Phone size={15} /> Call</a>}
            {typedLead.whatsapp && (
              <a href={getWhatsAppHref(typedLead.whatsapp)} target="_blank" rel="noreferrer" className="crm-primary-button">
                <MessageCircle size={15} /> WhatsApp
              </a>
            )}
          </div>
        </section>

        <div className="crm-detail-grid">
          <div className="crm-detail-stack">
            <section className="crm-section">
              <header><h2>Enquiry</h2><span>Original message</span></header>
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

            <section className="crm-section">
              <header><h2>Attribution</h2><span>How this lead found WeReact</span></header>
              {attribution.length ? (
                <div className="crm-attribution-grid">
                  {attribution.map(([key, value]) => (
                    <div className="crm-data-cell" key={key}><span>{key.replaceAll('_', ' ')}</span><strong>{String(value)}</strong></div>
                  ))}
                </div>
              ) : (
                <p className="crm-message">Direct visit. No campaign parameters were captured.</p>
              )}
            </section>

            <LeadActivity leadId={typedLead.id} events={typedEvents} />
          </div>

          <LeadWorkflowEditor key={typedLead.updated_at} lead={typedLead} members={typedMembers} />
        </div>

        <RealtimeRefresh tables={['leads', 'lead_events']} />
      </main>
    </>
  );
}
