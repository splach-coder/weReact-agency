'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  ArrowUpRight,
  CalendarClock,
  GripVertical,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Search,
} from 'lucide-react';
import { moveLeadStageAction } from './actions';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  CRM_STATUSES,
  filterLeads,
  formatLeadAge,
  getWhatsAppHref,
  groupLeadsByStatus,
  type CrmLead,
  type CrmProject,
  type LeadStatus,
} from '@/lib/crm';

const STATUS_META: Record<LeadStatus, { label: string; short: string }> = {
  new: { label: 'New enquiries', short: 'New' },
  contacted: { label: 'First contact made', short: 'Contacted' },
  discovery: { label: 'Needs discovery', short: 'Discovery' },
  proposal_sent: { label: 'Proposal delivered', short: 'Proposal sent' },
  negotiation: { label: 'Terms in discussion', short: 'Negotiation' },
  won: { label: 'Sale won', short: 'Won' },
  lost: { label: 'Sale lost', short: 'Lost' },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-MA', { day: '2-digit', month: 'short' }).format(new Date(value));
}

function isOverdue(value: string | null) {
  return Boolean(value && new Date(value).getTime() < Date.now());
}

function getProjectSummary(projects: CrmProject[]) {
  if (projects.length === 0) return 'No website brief yet';
  if (projects.length === 1) return projects[0].project_name;
  return `${projects[0].project_name} +${projects.length - 1}`;
}

function ContactActions({ lead }: { lead: CrmLead }) {
  return (
    <div className="crm-lead-card__actions" aria-label={`Contact ${lead.name}`}>
      {lead.whatsapp?.trim() && (
        <a
          href={getWhatsAppHref(lead.whatsapp)}
          target="_blank"
          rel="noreferrer"
          aria-label={`WhatsApp ${lead.name}`}
          title="WhatsApp"
        >
          <WhatsAppIcon size={17} />
        </a>
      )}
      {lead.phone.trim() && (
        <a href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`} aria-label={`Call ${lead.name}`} title="Call">
          <Phone size={17} />
        </a>
      )}
      <a href={`mailto:${lead.email.trim()}`} aria-label={`Email ${lead.name}`} title="Email">
        <Mail size={17} />
      </a>
      <Link href={`/admin/leads/${lead.id}`} aria-label={`Open ${lead.name}`} title="Open client">
        <ArrowUpRight size={17} />
      </Link>
    </div>
  );
}

type LeadCardProps = {
  lead: CrmLead;
  projects: CrmProject[];
  onMove: (leadId: string, status: LeadStatus) => void;
  draggable?: boolean;
};

function LeadCard({ lead, projects, onMove, draggable = false }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `lead:${lead.id}`,
    data: { leadId: lead.id, status: lead.status },
    disabled: !draggable,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      className={`crm-lead-card${isDragging ? ' is-dragging' : ''}`}
      style={style}
    >
      <div className="crm-lead-card__top">
        <span><i className={`crm-status-dot crm-status-dot--${lead.status}`} />{formatLeadAge(lead.created_at)}</span>
        {draggable && (
          <button
            type="button"
            className="crm-drag-handle"
            aria-label={`Move ${lead.name} to another sales stage`}
            title="Drag to move"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={17} />
          </button>
        )}
      </div>

      <Link href={`/admin/leads/${lead.id}`} className="crm-lead-card__name">{lead.name}</Link>
      <p className="crm-lead-card__company">{lead.company || lead.email}</p>
      <p className="crm-lead-card__project">{getProjectSummary(projects)}</p>

      {lead.next_follow_up && (
        <p className={`crm-follow-up ${isOverdue(lead.next_follow_up) ? 'is-overdue' : ''}`}>
          <CalendarClock size={14} />
          {isOverdue(lead.next_follow_up) ? 'Due ' : 'Next '}{formatDate(lead.next_follow_up)}
        </p>
      )}

      <label className="crm-mobile-stage-select">
        <span>Sales stage</span>
        <select
          value={lead.status}
          onChange={(event) => onMove(lead.id, event.target.value as LeadStatus)}
          aria-label={`Sales stage for ${lead.name}`}
        >
          {CRM_STATUSES.map((stage) => (
            <option value={stage} key={stage}>{STATUS_META[stage].short}</option>
          ))}
        </select>
      </label>

      <div className="crm-lead-card__footer">
        <ContactActions lead={lead} />
      </div>
    </article>
  );
}

function PipelineStage({
  stage,
  leads,
  projectsByLead,
  onMove,
}: {
  stage: LeadStatus;
  leads: CrmLead[];
  projectsByLead: Map<string, CrmProject[]>;
  onMove: (leadId: string, status: LeadStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage:${stage}`,
    data: { stage },
  });

  return (
    <section ref={setNodeRef} className={`crm-stage${isOver ? ' is-over' : ''}`}>
      <header>
        <div><span className={`crm-status-dot crm-status-dot--${stage}`} /><h2>{STATUS_META[stage].short}</h2></div>
        <strong>{leads.length}</strong>
      </header>
      <div className="crm-stage__leads">
        {leads.map((lead) => (
          <LeadCard
            lead={lead}
            projects={projectsByLead.get(lead.id) ?? []}
            onMove={onMove}
            draggable
            key={lead.id}
          />
        ))}
        {leads.length === 0 && <p className="crm-stage__empty">Drop a client here</p>}
      </div>
    </section>
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
  const [boardLeads, setBoardLeads] = useState(leads);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<LeadStatus | 'all'>('all');
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline');
  const [moveError, setMoveError] = useState('');
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    if (!movingLeadId) setBoardLeads(leads);
  }, [leads, movingLeadId]);

  const filtered = useMemo(() => filterLeads(boardLeads, { query, status }), [boardLeads, query, status]);
  const grouped = useMemo(() => groupLeadsByStatus(filtered), [filtered]);
  const projectsByLead = useMemo(() => {
    const map = new Map<string, CrmProject[]>();
    projects.forEach((project) => {
      if (!project.originating_lead_id) return;
      map.set(project.originating_lead_id, [...(map.get(project.originating_lead_id) ?? []), project]);
    });
    return map;
  }, [projects]);

  const newCount = boardLeads.filter((lead) => lead.status === 'new').length;
  const overdueCount = boardLeads.filter((lead) => isOverdue(lead.next_follow_up)).length;
  const activeSalesCount = boardLeads.filter((lead) => ['proposal_sent', 'negotiation'].includes(lead.status)).length;
  const activeBuildCount = projects.filter((project) => ['building', 'review'].includes(project.status)).length;

  async function moveLead(leadId: string, nextStatus: LeadStatus) {
    const lead = boardLeads.find((item) => item.id === leadId);
    if (!lead || lead.status === nextStatus || movingLeadId) return;

    const previousLeads = boardLeads;
    setMoveError('');
    setMovingLeadId(leadId);
    setBoardLeads((current) => current.map((item) => (
      item.id === leadId ? { ...item, status: nextStatus } : item
    )));

    try {
      const result = await moveLeadStageAction(leadId, nextStatus, lead.updated_at);
      if (!result.ok) {
        setBoardLeads(previousLeads);
        setMoveError(result.error || 'Could not move this client.');
        return;
      }

      if (result.updatedAt) {
        setBoardLeads((current) => current.map((item) => (
          item.id === leadId ? { ...item, updated_at: result.updatedAt as string } : item
        )));
      }
    } catch {
      setBoardLeads(previousLeads);
      setMoveError('Could not move this client. Check your connection and try again.');
    } finally {
      setMovingLeadId(null);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const leadId = String(event.active.data.current?.leadId || '').trim();
    const stage = event.over?.data.current?.stage;
    if (leadId && CRM_STATUSES.includes(stage as LeadStatus)) void moveLead(leadId, stage as LeadStatus);
  }

  return (
    <main className="crm-main">
      <section className="crm-page-intro">
        <div>
          <p className="crm-eyebrow"><span /> Sales workspace</p>
          <h1>Client pipeline</h1>
          <p>Move each enquiry from first contact to a signed project.</p>
        </div>
        <div className="crm-live"><span /> Live</div>
      </section>

      <section className="crm-metrics crm-metrics--four" aria-label="Work summary">
        <Metric label="New" value={newCount} detail="Needs first reply" tone="new" />
        <Metric label="Follow-ups" value={overdueCount} detail="Due now" tone="due" />
        <Metric label="Active deals" value={activeSalesCount} detail="Proposal or negotiation" tone="qualified" />
        <Metric label="In production" value={activeBuildCount} detail="Build or review" tone="won" />
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

        {moveError && <p className="crm-action-message is-error" role="alert">{moveError}</p>}
        <p className="sr-only" aria-live="polite">
          {movingLeadId ? 'Moving client' : moveError ? moveError : ''}
        </p>

        {view === 'pipeline' ? (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="crm-pipeline">
              {CRM_STATUSES.map((stage) => (
                <PipelineStage
                  stage={stage}
                  leads={grouped[stage]}
                  projectsByLead={projectsByLead}
                  onMove={(leadId, nextStatus) => void moveLead(leadId, nextStatus)}
                  key={stage}
                />
              ))}
            </div>
          </DndContext>
        ) : (
          <div className="crm-client-list">
            {filtered.map((lead) => (
              <LeadCard
                lead={lead}
                projects={projectsByLead.get(lead.id) ?? []}
                onMove={(leadId, nextStatus) => void moveLead(leadId, nextStatus)}
                key={lead.id}
              />
            ))}
            {filtered.length === 0 && <div className="crm-empty-state">No clients match these filters.</div>}
          </div>
        )}
      </section>
    </main>
  );
}
