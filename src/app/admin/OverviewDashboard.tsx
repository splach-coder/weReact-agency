import Link from 'next/link';
import { ArrowRight, CalendarClock, CircleDollarSign, Mail, PanelsTopLeft, TrendingUp } from 'lucide-react';
import type { CrmLead, CrmProject } from '@/lib/crm';
import { buildCashflowSeries, calculateAgencyMetrics, formatMad, type FinanceTransaction } from '@/lib/operations';

function isOverdue(value: string | null, now: Date) {
  return Boolean(value && new Date(value).getTime() < now.getTime());
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('en-MA', { day: '2-digit', month: 'short', timeZone: 'Africa/Casablanca' }).format(new Date(value));
}

export function OverviewDashboard({ leads, projects, finances, subscriberCount }: { leads: CrmLead[]; projects: CrmProject[]; finances: FinanceTransaction[]; subscriberCount: number }) {
  const now = new Date();
  const metrics = calculateAgencyMetrics(finances);
  const cashflow = buildCashflowSeries(finances, now);
  const maxCashflow = Math.max(1, ...cashflow.flatMap((item) => [item.income, item.expenses]));
  const openLeads = leads.filter((lead) => !['won', 'lost'].includes(lead.status));
  const activeProjects = projects.filter((project) => !['launched', 'paused'].includes(project.status));
  const overdue = openLeads.filter((lead) => isOverdue(lead.next_follow_up, now));
  const newLeads = openLeads.filter((lead) => lead.status === 'new');
  const launchSoon = activeProjects.filter((project) => project.target_launch && new Date(project.target_launch).getTime() <= now.getTime() + 14 * 86400000);
  const priorities = [
    ...overdue.map((lead) => ({ id: `lead-${lead.id}`, label: lead.name, detail: 'Follow-up is overdue', href: `/admin/leads/${lead.id}`, tone: 'danger' })),
    ...newLeads.map((lead) => ({ id: `new-${lead.id}`, label: lead.name, detail: 'New enquiry needs a first reply', href: `/admin/leads/${lead.id}`, tone: 'new' })),
    ...launchSoon.filter((project) => project.originating_lead_id).map((project) => ({ id: `project-${project.id}`, label: project.project_name, detail: `Launch target ${formatShortDate(project.target_launch as string)}`, href: `/admin/leads/${project.originating_lead_id}?project=${project.id}`, tone: 'gold' })),
  ].slice(0, 6);
  const salesStages = [
    ['New', leads.filter((lead) => lead.status === 'new').length],
    ['Discovery', leads.filter((lead) => lead.status === 'discovery').length],
    ['Proposal', leads.filter((lead) => lead.status === 'proposal_sent').length],
    ['Negotiation', leads.filter((lead) => lead.status === 'negotiation').length],
  ] as const;

  return (
    <main className="ops-main">
      <header className="ops-page-header">
        <div><p>Agency overview</p><h1>Good {now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening'}.</h1></div>
        <span>{new Intl.DateTimeFormat('en-MA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Africa/Casablanca' }).format(now)}</span>
      </header>

      <section className="ops-kpis" aria-label="Agency performance">
        <article><span><CircleDollarSign size={17} /> Revenue</span><strong>{formatMad(metrics.revenue)}</strong><small>{formatMad(metrics.pendingIncome)} pending</small></article>
        <article><span><TrendingUp size={17} /> Net result</span><strong className={metrics.net < 0 ? 'is-negative' : ''}>{formatMad(metrics.net)}</strong><small>{metrics.margin}% cash margin</small></article>
        <article><span><PanelsTopLeft size={17} /> Open leads</span><strong>{openLeads.length}</strong><small>{overdue.length} follow-ups overdue</small></article>
        <article><span><CalendarClock size={17} /> In production</span><strong>{activeProjects.length}</strong><small>{launchSoon.length} launch targets near</small></article>
      </section>

      <div className="ops-dashboard-grid">
        <section className="ops-panel ops-priorities">
          <header><div><p>Today</p><h2>Priority queue</h2></div><Link href="/admin/pipeline">Open pipeline <ArrowRight size={15} /></Link></header>
          {priorities.length ? <div className="ops-priority-list">{priorities.map((item) => (
            <Link href={item.href} key={item.id}><span className={`ops-priority-dot is-${item.tone}`} /><span><strong>{item.label}</strong><small>{item.detail}</small></span><ArrowRight size={15} /></Link>
          ))}</div> : <div className="ops-panel-empty">Nothing urgent. The queue is clear.</div>}
        </section>

        <section className="ops-panel ops-cashflow">
          <header><div><p>Last six months</p><h2>Cashflow</h2></div><Link href="/admin/finance">Finance <ArrowRight size={15} /></Link></header>
          <div className="ops-chart" aria-label="Six month income and expense chart">
            {cashflow.map((month) => <div className="ops-chart__month" key={month.key}><div className="ops-chart__bars"><i style={{ height: `${Math.max(2, month.income / maxCashflow * 100)}%` }} title={`${month.label} income: ${formatMad(month.income)}`} /><i style={{ height: `${Math.max(2, month.expenses / maxCashflow * 100)}%` }} title={`${month.label} expenses: ${formatMad(month.expenses)}`} /></div><span>{month.label}</span></div>)}
          </div>
          <div className="ops-chart-legend"><span><i /> Income</span><span><i /> Expenses</span></div>
        </section>

        <section className="ops-panel ops-sales-snapshot">
          <header><div><p>Current work</p><h2>Sales pipeline</h2></div><Link href="/admin/pipeline">Manage <ArrowRight size={15} /></Link></header>
          <div>{salesStages.map(([label, count]) => <div className="ops-stage-row" key={label}><span>{label}</span><div><i style={{ width: `${Math.max(count ? 12 : 0, count / Math.max(1, openLeads.length) * 100)}%` }} /></div><strong>{count}</strong></div>)}</div>
        </section>

        <section className="ops-panel ops-recent-finance">
          <header><div><p>Ledger</p><h2>Recent transactions</h2></div><Link href="/admin/finance">View all <ArrowRight size={15} /></Link></header>
          {finances.length ? <div>{finances.slice(0, 5).map((item) => <div className="ops-transaction-row" key={item.id}><span className={`is-${item.type}`}>{item.type === 'income' ? '+' : '-'}</span><span><strong>{item.description}</strong><small>{item.category} · {formatShortDate(item.occurred_on)}</small></span><b>{formatMad(item.amount)}</b></div>)}</div> : <div className="ops-panel-empty">Add the first transaction to start tracking company health.</div>}
        </section>

        <Link className="ops-newsletter-strip" href="/admin/newsletter"><Mail size={18} /><span><strong>{subscriberCount} newsletter {subscriberCount === 1 ? 'subscriber' : 'subscribers'}</strong><small>Write an update and keep your audience warm.</small></span><ArrowRight size={16} /></Link>
      </div>
    </main>
  );
}
