'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  LayoutGrid,
  List,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from 'lucide-react';
import {
  CRM_STATUSES,
  filterLeads,
  formatLeadAge,
  getLeadContactRoute,
  groupLeadsByStatus,
  type CrmLead,
  type CrmProject,
  type LeadStatus,
} from '@/lib/crm';

const STATUS_META: Record<LeadStatus, { label: string; short: string }> = {
  new: { label: 'New enquiries', short: 'New' },
  contacted: { label: 'Contacted', short: 'Contacted' },
  qualified: { label: 'Qualified', short: 'Qualified' },
  won: { label: 'Won', short: 'Won' },
  lost: { label: 'Lost', short: 'Lost' },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-MA', { day: '2-digit', month: 'short' }).format(new Date(value));
}

function isOverdue(value: string | null) {
  return Boolean(value && new Date(value).getTime() < Date.now());
}

function ContactIcon({ kind }: { kind: ReturnType<typeof getLeadContactRoute>['kind'] }) {
  if (kind === 'whatsapp') return <MessageCircle size={17} />;
  if (kind === 'phone') return <Phone size={17} />;
  return <Mail size={17} />;
}

function ProjectBadge({ project }: { project: CrmProject }) {
  return (
    <span className={`crm-project-badge crm-project-badge--${project.status}`}>
      {project.status === 'ready_for_dev' && <CheckCircle2 size={13} />}
      {project.project_name}
    </span>
  );
}

function LeadCard({ lead, projects }: { lead: CrmLead; projects: CrmProject[] }) {
  const contact = getLeadContactRoute(lead);

  return (
    <article className="crm-lead-card">
      <div className="crm-lead-card__top">
        <span><i className={`crm-status-dot crm-status-dot--${lead.status}`} />{STATUS_META[lead.status].short}</span>
        <span>{formatLeadAge(lead.created_at)}</span>
      </div>

      <Link href={`/admin/leads/${lead.id}`} className="crm-lead-card__name">{lead.name}</Link>
      <p className="crm-lead-card__company">{lead.company || lead.email}</p>

      {projects.length > 0 ? (
        <div className="crm-lead-projects">{projects.slice(0, 2).map((project) => <ProjectBadge project={project} key={project.id} />)}</div>
      ) : (
        <p className="crm-no-brief">Brief not started</p>
      )}

      {lead.next_follow_up && (
        <p className={`crm-follow-up ${isOverdue(lead.next_follow_up) ? 'is-overdue' : ''}`}>
          <CalendarClock size={14} /> {isOverdue(lead.next_follow_up) ? 'Due ' : 'Next '}{formatDate(lead.next_follow_up)}
        </p>
      )}

      <div className="crm-lead-card__footer">
        <a
          href={contact.href}
          className="crm-quick-contact"
          target={contact.kind === 'whatsapp' ? '_blank' : undefined}
          rel={contact.kind === 'whatsapp' ? 'noreferrer' : undefined}
          aria-label={`Contact ${lead.name} by ${contact.kind}`}
        >
          <ContactIcon kind={contact.kind} /> Contact
        </a>
        <Link href={`/admin/leads/${lead.id}`} className="crm-open-client">Open <ArrowUpRight size={16} /></Link>
      </div>
    </article>
  );
}

function Metric({ label, value, detail, tone }: { label: string; value: number; detail: string; tone?: string }) {
  return (
    <div className={`crm-metric ${tone ? `crm-metric--${tone}` : ''}`}>
      <span>{label}</span><strong>{value}</strong><small>{detail}</small>
    </div>
  );
}

export function DashboardClient({ leads, projects }: { leads: CrmLead[]; projects: CrmProject[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<LeadStatus | 'all'>('all');
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline');

  const filtered = useMemo(() => filterLeads(leads, { query, status }), [leads, query, status]);
  const grouped = useMemo(() => groupLeadsByStatus(filtered), [filtered]);
  const projectsByLead = useMemo(() => {
    const map = new Map<string, CrmProject[]>();
    projects.forEach((project) => {
      if (!project.originating_lead_id) return;
      map.set(project.originating_lead_id, [...(map.get(project.originating_lead_id) ?? []), project]);
    });
    return map;
  }, [projects]);

  const newCount = leads.filter((lead) => lead.status === 'new').length;
  const overdueCount = leads.filter((lead) => isOverdue(lead.next_follow_up)).length;
  const handoffCount = projects.filter((project) => project.status === 'ready_for_dev').length;
  const activeCount = projects.filter((project) => ['building', 'review'].includes(project.status)).length;

  return (
    <main className="crm-main">
      <section className="crm-page-intro">
        <div>
          <p className="crm-eyebrow"><span /> Karim's workspace</p>
          <h1>Today’s client work.</h1>
          <p>Contact the right people, capture exactly what they need, then hand a complete website brief to Anas.</p>
        </div>
        <div className="crm-live"><span /> Live</div>
      </section>

      <section className="crm-metrics crm-metrics--four" aria-label="Work summary">
        <Metric label="New" value={newCount} detail="Needs first reply" tone="new" />
        <Metric label="Follow-ups" value={overdueCount} detail="Due now" tone="due" />
        <Metric label="For Anas" value={handoffCount} detail="Briefs ready" tone="qualified" />
        <Metric label="In production" value={activeCount} detail="Build or review" tone="won" />
      </section>

      <section className="crm-workspace">
        <div className="crm-toolbar">
          <div className="crm-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a client" aria-label="Search clients" /></div>
          <select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus | 'all')} className="crm-select" aria-label="Filter by status">
            <option value="all">All stages</option>
            {CRM_STATUSES.map((item) => <option value={item} key={item}>{STATUS_META[item].label}</option>)}
          </select>
          <div className="crm-segmented" aria-label="Dashboard view">
            <button type="button" className={view === 'pipeline' ? 'is-active' : ''} onClick={() => setView('pipeline')} aria-label="Pipeline view"><LayoutGrid size={17} /></button>
            <button type="button" className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label="List view"><List size={17} /></button>
          </div>
        </div>

        <div className="crm-results-line">
          <span>{filtered.length} {filtered.length === 1 ? 'client' : 'clients'}</span>
          {(query || status !== 'all') && <button type="button" onClick={() => { setQuery(''); setStatus('all'); }}>Clear</button>}
        </div>

        {view === 'pipeline' ? (
          <div className="crm-pipeline">
            {CRM_STATUSES.map((stage) => (
              <section className="crm-stage" key={stage}>
                <header><div><span className={`crm-status-dot crm-status-dot--${stage}`} /><h2>{STATUS_META[stage].short}</h2></div><strong>{grouped[stage].length}</strong></header>
                <div className="crm-stage__leads">
                  {grouped[stage].map((lead) => <LeadCard lead={lead} projects={projectsByLead.get(lead.id) ?? []} key={lead.id} />)}
                  {grouped[stage].length === 0 && <p className="crm-stage__empty">Nothing here</p>}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="crm-client-list">
            {filtered.map((lead) => <LeadCard lead={lead} projects={projectsByLead.get(lead.id) ?? []} key={lead.id} />)}
            {filtered.length === 0 && <div className="crm-empty-state">No clients match these filters.</div>}
          </div>
        )}
      </section>
    </main>
  );
}
