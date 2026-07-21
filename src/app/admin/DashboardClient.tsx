'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarClock,
  CircleDollarSign,
  LayoutGrid,
  List,
  Mail,
  MessageCircle,
  Phone,
  Search,
  UserRound,
} from 'lucide-react';
import {
  CRM_STATUSES,
  filterLeads,
  formatLeadAge,
  getLeadContactRoute,
  groupLeadsByStatus,
  type CrmLead,
  type LeadStatus,
} from '@/lib/crm';

const STATUS_META: Record<LeadStatus, { label: string; short: string }> = {
  new: { label: 'New enquiries', short: 'New' },
  contacted: { label: 'Contacted', short: 'Contacted' },
  qualified: { label: 'Qualified', short: 'Qualified' },
  won: { label: 'Won', short: 'Won' },
  lost: { label: 'Lost', short: 'Lost' },
};

function formatMoney(value: number | null) {
  if (value == null) return null;
  return new Intl.NumberFormat('en-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-MA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function isOverdue(value: string | null) {
  return Boolean(value && new Date(value).getTime() < Date.now());
}

function sourceLabel(source: string) {
  return source === 'website_contact_form' ? 'Website' : source.replaceAll('_', ' ');
}

function ContactIcon({ kind }: { kind: ReturnType<typeof getLeadContactRoute>['kind'] }) {
  if (kind === 'whatsapp') return <MessageCircle size={15} />;
  if (kind === 'phone') return <Phone size={15} />;
  return <Mail size={15} />;
}

function LeadCard({ lead }: { lead: CrmLead }) {
  const contact = getLeadContactRoute(lead);
  const value = formatMoney(lead.estimated_value);

  return (
    <article className="crm-lead-card">
      <div className="crm-lead-card__top">
        <span className={`crm-status-dot crm-status-dot--${lead.status}`} />
        <span>{formatLeadAge(lead.created_at)}</span>
      </div>

      <Link href={`/admin/leads/${lead.id}`} className="crm-lead-card__name">
        {lead.name}
      </Link>
      <p className="crm-lead-card__company">{lead.company || lead.email}</p>

      <div className="crm-lead-card__meta">
        {lead.assigned_to && (
          <span><UserRound size={13} /> {lead.assigned_to.split('@')[0]}</span>
        )}
        {value && (
          <span><CircleDollarSign size={13} /> {value}</span>
        )}
        {lead.next_follow_up && (
          <span className={isOverdue(lead.next_follow_up) ? 'is-overdue' : ''}>
            <CalendarClock size={13} /> {formatDate(lead.next_follow_up)}
          </span>
        )}
      </div>

      <div className="crm-lead-card__footer">
        <span>{sourceLabel(lead.source)}</span>
        <div>
          <a
            href={contact.href}
            className="crm-card-action"
            target={contact.kind === 'whatsapp' ? '_blank' : undefined}
            rel={contact.kind === 'whatsapp' ? 'noreferrer' : undefined}
            aria-label={`Contact ${lead.name} by ${contact.kind}`}
            title={`Contact by ${contact.kind}`}
          >
            <ContactIcon kind={contact.kind} />
          </a>
          <Link
            href={`/admin/leads/${lead.id}`}
            className="crm-card-action"
            aria-label={`Open ${lead.name}`}
            title="Open lead"
          >
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: string;
}) {
  return (
    <div className={`crm-metric ${tone ? `crm-metric--${tone}` : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

export function DashboardClient({ leads }: { leads: CrmLead[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<LeadStatus | 'all'>('all');
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');

  const filtered = useMemo(
    () => filterLeads(leads, { query, status }),
    [leads, query, status],
  );
  const grouped = useMemo(() => groupLeadsByStatus(filtered), [filtered]);
  const newCount = leads.filter((lead) => lead.status === 'new').length;
  const qualifiedCount = leads.filter((lead) => lead.status === 'qualified').length;
  const overdueCount = leads.filter((lead) => isOverdue(lead.next_follow_up)).length;
  const wonValue = leads
    .filter((lead) => lead.status === 'won')
    .reduce((sum, lead) => sum + (lead.estimated_value ?? 0), 0);

  return (
    <main className="crm-main">
      <section className="crm-page-intro">
        <div>
          <p className="crm-eyebrow"><span /> Sales workspace</p>
          <h1>Every lead, one clear next step.</h1>
          <p>Track enquiries from first contact to signed project without losing the campaign story behind them.</p>
        </div>
        <div className="crm-live"><span /> Live workspace</div>
      </section>

      <section className="crm-metrics" aria-label="Pipeline summary">
        <Metric label="Total leads" value={leads.length} detail="All captured enquiries" />
        <Metric label="Needs contact" value={newCount} detail="Fresh opportunities" tone="new" />
        <Metric label="Qualified" value={qualifiedCount} detail="Ready for proposal" tone="qualified" />
        <Metric
          label="Won value"
          value={formatMoney(wonValue) ?? 'MAD 0'}
          detail="Closed project value"
          tone="won"
        />
        <Metric label="Follow-ups due" value={overdueCount} detail="Needs attention" tone="due" />
      </section>

      <section className="crm-workspace">
        <div className="crm-toolbar">
          <div className="crm-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, company, email or phone"
              aria-label="Search leads"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus | 'all')}
            className="crm-select"
            aria-label="Filter by status"
          >
            <option value="all">All stages</option>
            {CRM_STATUSES.map((item) => (
              <option value={item} key={item}>{STATUS_META[item].label}</option>
            ))}
          </select>

          <div className="crm-segmented" aria-label="Dashboard view">
            <button
              type="button"
              className={view === 'pipeline' ? 'is-active' : ''}
              onClick={() => setView('pipeline')}
              aria-pressed={view === 'pipeline'}
              title="Pipeline view"
            >
              <LayoutGrid size={16} />
              <span>Pipeline</span>
            </button>
            <button
              type="button"
              className={view === 'table' ? 'is-active' : ''}
              onClick={() => setView('table')}
              aria-pressed={view === 'table'}
              title="Table view"
            >
              <List size={16} />
              <span>Table</span>
            </button>
          </div>
        </div>

        <div className="crm-results-line">
          <span>{filtered.length} {filtered.length === 1 ? 'lead' : 'leads'}</span>
          {(query || status !== 'all') && (
            <button type="button" onClick={() => { setQuery(''); setStatus('all'); }}>
              Clear filters
            </button>
          )}
        </div>

        {view === 'pipeline' ? (
          <div className="crm-pipeline">
            {CRM_STATUSES.map((stage) => (
              <section className="crm-stage" key={stage}>
                <header>
                  <div>
                    <span className={`crm-status-dot crm-status-dot--${stage}`} />
                    <h2>{STATUS_META[stage].short}</h2>
                  </div>
                  <strong>{grouped[stage].length}</strong>
                </header>
                <div className="crm-stage__leads">
                  {grouped[stage].map((lead) => <LeadCard lead={lead} key={lead.id} />)}
                  {grouped[stage].length === 0 && <p className="crm-stage__empty">No leads here</p>}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Stage</th>
                  <th>Assigned</th>
                  <th>Value</th>
                  <th>Follow-up</th>
                  <th>Received</th>
                  <th><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <Link href={`/admin/leads/${lead.id}`}><strong>{lead.name}</strong></Link>
                      <small>{lead.company || lead.email}</small>
                    </td>
                    <td><span className={`crm-status crm-status--${lead.status}`}>{STATUS_META[lead.status].short}</span></td>
                    <td>{lead.assigned_to?.split('@')[0] || 'Unassigned'}</td>
                    <td>{formatMoney(lead.estimated_value) || '?'}</td>
                    <td className={isOverdue(lead.next_follow_up) ? 'is-overdue' : ''}>
                      {lead.next_follow_up ? formatDate(lead.next_follow_up) : '?'}
                    </td>
                    <td>{formatDate(lead.created_at)}</td>
                    <td><Link href={`/admin/leads/${lead.id}`} className="crm-table-open" aria-label={`Open ${lead.name}`}><ArrowUpRight size={16} /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="crm-empty-state">No leads match these filters.</div>}
          </div>
        )}
      </section>
    </main>
  );
}
