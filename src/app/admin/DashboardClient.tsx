'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowUpRight,
  CalendarClock,
  ChevronDown,
  GripVertical,
  LayoutGrid,
  List,
  Mail,
  MoreVertical,
  Phone,
  RotateCcw,
  Search,
  Trash2,
  UserPlus,
} from 'lucide-react';
import {
  archiveProjectAction,
  moveLeadStageAction,
  moveProjectStageAction,
  reopenProjectAction,
} from './actions';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ManualLeadDrawer } from './ManualLeadDrawer';
import {
  CRM_STATUSES,
  SALES_PIPELINE_STATUSES,
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

const DELIVERY_STATUSES = ['ready_for_dev', 'building', 'review'] as const;
type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

const DELIVERY_META: Record<DeliveryStatus, { label: string; short: string }> = {
  ready_for_dev: { label: 'Ready for development', short: 'Ready for dev' },
  building: { label: 'Developing', short: 'Developing' },
  review: { label: 'Client review', short: 'Review' },
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
      {lead.email.trim() && (
        <a href={`mailto:${lead.email.trim()}`} aria-label={`Email ${lead.name}`} title="Email">
          <Mail size={17} />
        </a>
      )}
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
  showStageSelect?: boolean;
  moving?: boolean;
};

function LeadCard({ lead, projects, onMove, draggable = false, showStageSelect = true, moving = false }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `lead:${lead.id}`,
    data: { leadId: lead.id, status: lead.status, stage: lead.status },
    disabled: !draggable,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
      <p className="crm-lead-card__company">{lead.company || lead.email || lead.whatsapp || lead.phone || 'No company'}</p>
      <p className="crm-lead-card__project">{getProjectSummary(projects)}</p>

      {lead.next_follow_up && (
        <p className={`crm-follow-up ${isOverdue(lead.next_follow_up) ? 'is-overdue' : ''}`}>
          <CalendarClock size={14} />
          {isOverdue(lead.next_follow_up) ? 'Due ' : 'Next '}{formatDate(lead.next_follow_up)}
        </p>
      )}

      {showStageSelect && <label className="crm-mobile-stage-select">
        <span>{moving ? 'Moving client...' : 'Move client'}</span>
        <select
          value={lead.status}
          onChange={(event) => onMove(lead.id, event.target.value as LeadStatus)}
          aria-label={`Move client ${lead.name} to another sales stage`}
          disabled={moving}
        >
          {CRM_STATUSES.map((stage) => (
            <option value={stage} key={stage}>{STATUS_META[stage].short}</option>
          ))}
        </select>
      </label>}

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
  collapsed,
  onToggle,
}: {
  stage: LeadStatus;
  leads: CrmLead[];
  projectsByLead: Map<string, CrmProject[]>;
  onMove: (leadId: string, status: LeadStatus) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage:${stage}`,
    data: { stage },
  });

  return (
    <section ref={setNodeRef} className={`crm-stage${isOver ? ' is-over' : ''}${collapsed ? ' is-collapsed' : ''}`}>
      <header>
        <button type="button" className="crm-stage__toggle" onClick={onToggle} aria-expanded={!collapsed}>
          <span className={`crm-status-dot crm-status-dot--${stage}`} />
          <h2>{STATUS_META[stage].short}</h2>
          {leads.length === 0 && <ChevronDown size={15} aria-hidden="true" />}
        </button>
        <strong>{leads.length}</strong>
      </header>
      {!collapsed && (
        <SortableContext items={leads.map((lead) => `lead:${lead.id}`)} strategy={verticalListSortingStrategy}>
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
        </SortableContext>
      )}
    </section>
  );
}

function ProjectCard({ project, onMove, onReopen, onArchive, dragOverlay = false, readOnly = false, draggable = true, moving = false, lifecycleBusy = false }: {
  project: CrmProject;
  onMove: (projectId: string, status: DeliveryStatus) => void;
  onReopen?: (project: CrmProject) => void;
  onArchive?: (project: CrmProject) => void;
  dragOverlay?: boolean;
  readOnly?: boolean;
  draggable?: boolean;
  moving?: boolean;
  lifecycleBusy?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `project:${project.id}`,
    data: { projectId: project.id, stage: project.status },
    disabled: !draggable || readOnly,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <article ref={setNodeRef} className={`crm-project-card${isDragging ? ' is-dragging' : ''}`} style={style}>
      <div className="crm-project-card__top">
        <span className={`crm-status-dot crm-status-dot--${project.status}`} />
        <span>{DELIVERY_META[project.status as DeliveryStatus]?.short ?? project.status}</span>
        {!readOnly && draggable && <button type="button" className="crm-drag-handle" aria-label={`Move ${project.project_name}`} title="Drag to move" {...attributes} {...listeners}>
          <GripVertical size={17} />
        </button>}
      </div>
      {project.originating_lead_id ? (
        <Link href={`/admin/leads/${project.originating_lead_id}?project=${project.id}`} className="crm-project-card__name">{project.project_name}</Link>
      ) : (
        <strong className="crm-project-card__name">{project.project_name}</strong>
      )}
      <p className="crm-project-card__domain">{project.domain_name || project.project_type}</p>
      {readOnly && onReopen && onArchive && (
        <details className="crm-project-actions">
          <summary aria-label={`Manage ${project.project_name}`} aria-haspopup="menu">
            <MoreVertical size={17} />
          </summary>
          <div className="crm-project-actions__menu" role="menu">
            <button type="button" role="menuitem" disabled={lifecycleBusy} onClick={() => onReopen(project)}>
              <RotateCcw size={15} /> Reopen in Review
            </button>
            <button type="button" role="menuitem" className="is-danger" disabled={lifecycleBusy} onClick={() => onArchive(project)}>
              <Trash2 size={15} /> Delete project
            </button>
          </div>
        </details>
      )}
      {!readOnly && <label className="crm-mobile-stage-select">
        <span>{moving ? 'Moving project...' : 'Move project'}</span>
        <select
          value={project.status}
          onChange={(event) => onMove(project.id, event.target.value as DeliveryStatus)}
          aria-label={`Move project ${project.project_name} to another delivery stage`}
          disabled={moving}
        >
          {DELIVERY_STATUSES.map((stage) => <option value={stage} key={stage}>{DELIVERY_META[stage].short}</option>)}
        </select>
      </label>}
    </article>
  );
}

function DeliveryStage({ stage, projects, onMove, collapsed, onToggle }: {
  stage: DeliveryStatus;
  projects: CrmProject[];
  onMove: (projectId: string, status: DeliveryStatus) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `delivery:${stage}`, data: { stage } });

  return (
    <section ref={setNodeRef} className={`crm-stage crm-stage--delivery${isOver ? ' is-over' : ''}${collapsed ? ' is-collapsed' : ''}`}>
      <header>
        <button type="button" className="crm-stage__toggle" onClick={onToggle} aria-expanded={!collapsed}>
          <span className={`crm-status-dot crm-status-dot--${stage}`} />
          <h2>{DELIVERY_META[stage].short}</h2>
          {projects.length === 0 && <ChevronDown size={15} aria-hidden="true" />}
        </button>
        <strong>{projects.length}</strong>
      </header>
      {!collapsed && (
        <SortableContext items={projects.map((project) => `project:${project.id}`)} strategy={verticalListSortingStrategy}>
          <div className="crm-stage__leads">
            {projects.map((project) => <ProjectCard project={project} onMove={onMove} key={project.id} />)}
            {projects.length === 0 && <p className="crm-stage__empty">Drop a project here</p>}
          </div>
        </SortableContext>
      )}
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
  const [boardProjects, setBoardProjects] = useState(projects);
  const [query, setQuery] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [status, setStatus] = useState<LeadStatus | 'all'>('all');
  const [board, setBoard] = useState<'sales' | 'delivery' | 'closed' | 'lost'>('sales');
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline');
  const [mobileSalesStage, setMobileSalesStage] = useState<(typeof SALES_PIPELINE_STATUSES)[number]>('new');
  const [mobileDeliveryStage, setMobileDeliveryStage] = useState<DeliveryStatus>('ready_for_dev');
  const [moveError, setMoveError] = useState('');
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);
  const [movingProjectId, setMovingProjectId] = useState<string | null>(null);
  const [projectActionId, setProjectActionId] = useState<string | null>(null);
  const [lifecycleMessage, setLifecycleMessage] = useState('');
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({});
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    if (!movingLeadId) setBoardLeads(leads);
    if (!movingProjectId) setBoardProjects(projects);
  }, [leads, projects, movingLeadId, movingProjectId]);

  const activeSalesLeads = useMemo(() => boardLeads.filter((lead) => SALES_PIPELINE_STATUSES.includes(lead.status as (typeof SALES_PIPELINE_STATUSES)[number])), [boardLeads]);
  const closedProjects = useMemo(() => boardProjects.filter((project) => project.status === 'launched'), [boardProjects]);
  const lostLeads = useMemo(() => filterLeads(boardLeads.filter((lead) => lead.status === 'lost'), { query, status: 'all' }), [boardLeads, query]);
  const filtered = useMemo(() => filterLeads(activeSalesLeads, { query, status }), [activeSalesLeads, query, status]);
  const filteredClosedProjects = useMemo(() => closedProjects.filter((project) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [project.project_name, project.domain_name, project.project_type].some((value) => value.toLowerCase().includes(needle));
  }), [closedProjects, query]);
  const grouped = useMemo(() => groupLeadsByStatus(filtered), [filtered]);
  const deliveryProjects = useMemo(() => boardProjects.filter((project) => {
    if (!DELIVERY_STATUSES.includes(project.status as DeliveryStatus)) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [project.project_name, project.domain_name, project.project_type].some((value) => value.toLowerCase().includes(needle));
  }), [boardProjects, query]);
  const groupedDelivery = useMemo(() => DELIVERY_STATUSES.reduce<Record<DeliveryStatus, CrmProject[]>>((groups, stage) => {
    groups[stage] = deliveryProjects.filter((project) => project.status === stage);
    return groups;
  }, { ready_for_dev: [], building: [], review: [] }), [deliveryProjects]);
  const projectsByLead = useMemo(() => {
    const map = new Map<string, CrmProject[]>();
    boardProjects.forEach((project) => {
      if (!project.originating_lead_id) return;
      map.set(project.originating_lead_id, [...(map.get(project.originating_lead_id) ?? []), project]);
    });
    return map;
  }, [boardProjects]);

  const newCount = boardLeads.filter((lead) => lead.status === 'new').length;
  const overdueCount = boardLeads.filter((lead) => isOverdue(lead.next_follow_up)).length;
  const activeSalesCount = boardLeads.filter((lead) => ['proposal_sent', 'negotiation'].includes(lead.status)).length;
  const activeBuildCount = boardProjects.filter((project) => ['ready_for_dev', 'building', 'review'].includes(project.status)).length;

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

  async function moveProject(projectId: string, nextStatus: DeliveryStatus) {
    const project = boardProjects.find((item) => item.id === projectId);
    if (!project || project.status === nextStatus || movingProjectId) return;

    const previousProjects = boardProjects;
    setMoveError('');
    setMovingProjectId(projectId);
    setBoardProjects((current) => current.map((item) => item.id === projectId ? { ...item, status: nextStatus } : item));

    try {
      const result = await moveProjectStageAction(projectId, nextStatus, project.updated_at);
      if (!result.ok) {
        setBoardProjects(previousProjects);
        setMoveError(result.error || 'Could not move this project.');
        return;
      }
      if (result.updatedAt) {
        setBoardProjects((current) => current.map((item) => item.id === projectId ? { ...item, updated_at: result.updatedAt as string } : item));
      }
    } catch {
      setBoardProjects(previousProjects);
      setMoveError('Could not move this project. Check your connection and try again.');
    } finally {
      setMovingProjectId(null);
    }
  }

  async function reopenClosedProject(project: CrmProject) {
    if (projectActionId) return;
    if (!window.confirm(`Reopen ${project.project_name} in Review? Its automatic close revenue will be removed from Finance.`)) return;

    setMoveError('');
    setLifecycleMessage('');
    setProjectActionId(project.id);
    try {
      const result = await reopenProjectAction(project.id, project.updated_at);
      if (!result.ok) {
        setMoveError(result.error || 'Could not reopen this project.');
        return;
      }
      setBoardProjects((current) => current.map((item) => item.id === project.id
        ? { ...item, status: 'review', updated_at: result.updatedAt ?? item.updated_at }
        : item));
      setMobileDeliveryStage('review');
      setBoard('delivery');
      setLifecycleMessage(`${project.project_name} reopened in Review. Its automatic revenue was removed.`);
    } catch {
      setMoveError('Could not reopen this project. Check your connection and try again.');
    } finally {
      setProjectActionId(null);
    }
  }

  async function archiveClosedProject(project: CrmProject) {
    if (projectActionId) return;
    if (!window.confirm(`Delete ${project.project_name}? This removes its automatic revenue from Finance and archives its invoice. The client and history stay available.`)) return;

    setMoveError('');
    setLifecycleMessage('');
    setProjectActionId(project.id);
    try {
      const result = await archiveProjectAction(project.id, project.updated_at);
      if (!result.ok) {
        setMoveError(result.error || 'Could not delete this project.');
        return;
      }
      setBoardProjects((current) => current.filter((item) => item.id !== project.id));
      setLifecycleMessage(`${project.project_name} deleted. Its automatic revenue was removed from Finance.`);
    } catch {
      setMoveError('Could not delete this project. Check your connection and try again.');
    } finally {
      setProjectActionId(null);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(String(event.active.id));
  }

  function handleDragCancel() {
    setActiveDragId(null);
  }

  function handleLeadDragEnd(event: DragEndEvent) {
    setActiveDragId(null);
    const leadId = String(event.active.data.current?.leadId || '').trim();
    const stage = event.over?.data.current?.stage;
    if (leadId && CRM_STATUSES.includes(stage as LeadStatus)) void moveLead(leadId, stage as LeadStatus);
  }

  function handleProjectDragEnd(event: DragEndEvent) {
    setActiveDragId(null);
    const projectId = String(event.active.data.current?.projectId || '').trim();
    const stage = event.over?.data.current?.stage;
    if (projectId && DELIVERY_STATUSES.includes(stage as DeliveryStatus)) void moveProject(projectId, stage as DeliveryStatus);
  }

  function toggleStage(stage: string, isCollapsed: boolean) {
    setCollapsedStages((current) => ({ ...current, [stage]: !isCollapsed }));
  }

  return (
    <main className="crm-main">
      <section className="crm-metrics crm-metrics--four" aria-label="Work summary">
        <Metric label="New" value={newCount} detail="Needs first reply" tone="new" />
        <Metric label="Follow-ups" value={overdueCount} detail="Due now" tone="due" />
        <Metric label="Active deals" value={activeSalesCount} detail="Proposal or negotiation" tone="qualified" />
        <Metric label="In production" value={activeBuildCount} detail="Build or review" tone="won" />
      </section>

      <section className="crm-workspace">
        <div className="crm-workspace-heading">
          <div className="crm-workspace-tabs" role="tablist" aria-label="CRM workspaces">
            <button type="button" role="tab" aria-selected={board === 'sales'} className={board === 'sales' ? 'is-active' : ''} onClick={() => setBoard('sales')}>Sales pipeline</button>
            <button type="button" role="tab" aria-selected={board === 'delivery'} className={board === 'delivery' ? 'is-active' : ''} onClick={() => setBoard('delivery')}>Website delivery <span>{activeBuildCount}</span></button>
            <button type="button" role="tab" aria-selected={board === 'closed'} className={board === 'closed' ? 'is-active' : ''} onClick={() => setBoard('closed')}>Closed projects <span>{closedProjects.length}</span></button>
            <button type="button" role="tab" aria-selected={board === 'lost'} className={board === 'lost' ? 'is-active' : ''} onClick={() => setBoard('lost')}>Lost clients <span>{lostLeads.length}</span></button>
          </div>
          <button type="button" className="crm-new-client-button" onClick={() => setShowNewClient(true)}>
            <UserPlus size={17} /> New client
          </button>
        </div>

        <div className={`crm-toolbar${board === 'delivery' ? ' crm-toolbar--delivery' : ''}`}>
          <div className="crm-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={board === 'delivery' || board === 'closed' ? 'Find a project' : 'Find a client'} aria-label={board === 'delivery' || board === 'closed' ? 'Search projects' : 'Search clients'} /></div>
          {board === 'sales' && (
            <>
              <select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus | 'all')} className="crm-select" aria-label="Filter by status">
                <option value="all">All stages</option>
                {SALES_PIPELINE_STATUSES.map((item) => <option value={item} key={item}>{STATUS_META[item].label}</option>)}
              </select>
              <div className="crm-segmented" aria-label="Dashboard view">
                <button type="button" className={view === 'pipeline' ? 'is-active' : ''} onClick={() => setView('pipeline')} aria-label="Pipeline view"><LayoutGrid size={17} /></button>
                <button type="button" className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label="List view"><List size={17} /></button>
              </div>
            </>
          )}
        </div>

        <div className="crm-results-line">
          <span>
            {board === 'sales' && `${filtered.length} ${filtered.length === 1 ? 'client' : 'clients'}`}
            {board === 'delivery' && `${deliveryProjects.length} ${deliveryProjects.length === 1 ? 'project' : 'projects'}`}
            {board === 'closed' && `${filteredClosedProjects.length} ${filteredClosedProjects.length === 1 ? 'closed project' : 'closed projects'}`}
            {board === 'lost' && `${lostLeads.length} ${lostLeads.length === 1 ? 'lost client' : 'lost clients'}`}
          </span>
          {(query || status !== 'all') && <button type="button" onClick={() => { setQuery(''); setStatus('all'); }}>Clear</button>}
        </div>

        {moveError && <p className="crm-action-message is-error" role="alert">{moveError}</p>}
        {lifecycleMessage && <p className="crm-action-message" role="status">{lifecycleMessage}</p>}
        <p className="sr-only" aria-live="polite">
          {movingLeadId || movingProjectId ? 'Moving work item' : moveError ? moveError : ''}
        </p>

        {board === 'sales' && view === 'pipeline' && (
          <>
          <div className="crm-desktop-board">
          <DndContext id="crm-sales-pipeline" sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleLeadDragEnd}>
            <div className="crm-pipeline">
              {SALES_PIPELINE_STATUSES.map((stage) => (
                <PipelineStage
                  stage={stage}
                  leads={grouped[stage]}
                  projectsByLead={projectsByLead}
                  onMove={(leadId, nextStatus) => void moveLead(leadId, nextStatus)}
                  collapsed={grouped[stage].length === 0 && (collapsedStages[stage] ?? true)}
                  onToggle={() => grouped[stage].length === 0 && toggleStage(stage, collapsedStages[stage] ?? true)}
                  key={stage}
                />
              ))}
            </div>
            <DragOverlay dropAnimation={null}>
              {activeDragId?.startsWith('lead:') && (() => {
                const lead = boardLeads.find((item) => `lead:${item.id}` === activeDragId);
                return lead ? <LeadCard lead={lead} projects={projectsByLead.get(lead.id) ?? []} onMove={() => undefined} /> : null;
              })()}
            </DragOverlay>
          </DndContext>
          </div>
          <div className="crm-mobile-board">
            <div className="crm-mobile-stage-tabs" role="tablist" aria-label="Sales pipeline stages">
              {SALES_PIPELINE_STATUSES.map((stage) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={mobileSalesStage === stage}
                  className={mobileSalesStage === stage ? 'is-active' : ''}
                  onClick={() => setMobileSalesStage(stage)}
                  key={stage}
                >
                  <span className={`crm-status-dot crm-status-dot--${stage}`} />
                  <span>{STATUS_META[stage].short}</span>
                  <strong>{grouped[stage].length}</strong>
                </button>
              ))}
            </div>
            <div className="crm-mobile-stage-summary">
              <div>
                <span>Current stage</span>
                <strong>{STATUS_META[mobileSalesStage].label}</strong>
              </div>
              <span>{grouped[mobileSalesStage].length} {grouped[mobileSalesStage].length === 1 ? 'client' : 'clients'}</span>
            </div>
            <div className="crm-mobile-stack">
              {grouped[mobileSalesStage].map((lead) => (
                <LeadCard
                  lead={lead}
                  projects={projectsByLead.get(lead.id) ?? []}
                  onMove={(leadId, nextStatus) => void moveLead(leadId, nextStatus)}
                  moving={movingLeadId === lead.id}
                  key={lead.id}
                />
              ))}
              {grouped[mobileSalesStage].length === 0 && (
                <div className="crm-mobile-empty">No clients are waiting in this stage.</div>
              )}
            </div>
          </div>
          </>
        )}

        {board === 'sales' && view === 'list' && (
          <div className="crm-client-list">
            {filtered.map((lead) => <LeadCard lead={lead} projects={projectsByLead.get(lead.id) ?? []} onMove={(leadId, nextStatus) => void moveLead(leadId, nextStatus)} key={lead.id} />)}
            {filtered.length === 0 && <div className="crm-empty-state">No clients match these filters.</div>}
          </div>
        )}

        {board === 'delivery' && (
          <>
          <div className="crm-desktop-board">
          <DndContext id="crm-delivery-pipeline" sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleProjectDragEnd}>
            <div className="crm-pipeline crm-pipeline--delivery">
              {DELIVERY_STATUSES.map((stage) => (
                <DeliveryStage
                  stage={stage}
                  projects={groupedDelivery[stage]}
                  onMove={(projectId, nextStatus) => void moveProject(projectId, nextStatus)}
                  collapsed={groupedDelivery[stage].length === 0 && (collapsedStages[stage] ?? true)}
                  onToggle={() => groupedDelivery[stage].length === 0 && toggleStage(stage, collapsedStages[stage] ?? true)}
                  key={stage}
                />
              ))}
            </div>
            <DragOverlay dropAnimation={null}>
              {activeDragId?.startsWith('project:') && (() => {
                const project = boardProjects.find((item) => `project:${item.id}` === activeDragId);
                return project ? <ProjectCard project={project} onMove={() => undefined} dragOverlay /> : null;
              })()}
            </DragOverlay>
          </DndContext>
          </div>
          <div className="crm-mobile-board">
            <div className="crm-mobile-stage-tabs" role="tablist" aria-label="Website delivery stages">
              {DELIVERY_STATUSES.map((stage) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={mobileDeliveryStage === stage}
                  className={mobileDeliveryStage === stage ? 'is-active' : ''}
                  onClick={() => setMobileDeliveryStage(stage)}
                  key={stage}
                >
                  <span className={`crm-status-dot crm-status-dot--${stage}`} />
                  <span>{DELIVERY_META[stage].short}</span>
                  <strong>{groupedDelivery[stage].length}</strong>
                </button>
              ))}
            </div>
            <div className="crm-mobile-stage-summary">
              <div>
                <span>Current stage</span>
                <strong>{DELIVERY_META[mobileDeliveryStage].label}</strong>
              </div>
              <span>{groupedDelivery[mobileDeliveryStage].length} {groupedDelivery[mobileDeliveryStage].length === 1 ? 'project' : 'projects'}</span>
            </div>
            <div className="crm-mobile-stack">
              {groupedDelivery[mobileDeliveryStage].map((project) => (
                <ProjectCard
                  project={project}
                  onMove={(projectId, nextStatus) => void moveProject(projectId, nextStatus)}
                  draggable={false}
                  moving={movingProjectId === project.id}
                  key={project.id}
                />
              ))}
              {groupedDelivery[mobileDeliveryStage].length === 0 && (
                <div className="crm-mobile-empty">No projects are waiting in this stage.</div>
              )}
            </div>
          </div>
          </>
        )}

        {board === 'closed' && (
          <DndContext id="crm-closed-projects" sensors={sensors}>
            <div className="crm-client-list crm-closed-projects">
              {filteredClosedProjects.map((project) => (
                <ProjectCard
                  project={project}
                  onMove={() => undefined}
                  onReopen={(item) => void reopenClosedProject(item)}
                  onArchive={(item) => void archiveClosedProject(item)}
                  lifecycleBusy={projectActionId === project.id}
                  readOnly
                  key={project.id}
                />
              ))}
              {filteredClosedProjects.length === 0 && <div className="crm-empty-state">No completed projects match this search.</div>}
            </div>
          </DndContext>
        )}

        {board === 'lost' && (
          <div className="crm-client-list crm-lost-clients">
            {lostLeads.map((lead) => (
              <LeadCard
                lead={lead}
                projects={projectsByLead.get(lead.id) ?? []}
                onMove={() => undefined}
                showStageSelect={false}
                key={lead.id}
              />
            ))}
            {lostLeads.length === 0 && <div className="crm-empty-state">No lost clients match this search.</div>}
          </div>
        )}
      </section>
      <ManualLeadDrawer open={showNewClient} onClose={() => setShowNewClient(false)} />
    </main>
  );
}
