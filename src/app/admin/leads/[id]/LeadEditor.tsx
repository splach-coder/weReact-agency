'use client';

import { useMemo, useState, useTransition, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CircleCheckBig, Globe2, Plus, RotateCcw, Save, Send, XCircle } from 'lucide-react';
import { addLeadNoteAction, saveProjectBriefAction, updateLeadAction } from '../../actions';
import { ProjectWorkspace } from './ProjectWorkspace';
import { InvoiceWorkspace } from './InvoiceWorkspace';
import {
  SALES_PIPELINE_STATUSES,
  getLeadLifecycleAction,
  getProjectLifecycleAction,
  getProjectBriefProgress,
  getProjectLaunchProgress,
  type CrmLead,
  type CrmProject,
  type LeadEvent,
  type LeadStatus,
  type ProjectWorkItem,
  type ProjectStatus,
  type TeamMember,
} from '@/lib/crm';
import { formatMad, type Invoice, type InvoiceLine } from '@/lib/operations';

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New enquiry',
  contacted: 'Contacted',
  discovery: 'Discovery',
  proposal_sent: 'Proposal sent',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  briefing: 'Briefing',
  ready_for_dev: 'Ready for development',
  building: 'Building',
  review: 'Client review',
  launched: 'Completed',
  paused: 'Paused',
};

const WEBSITE_TYPES = [
  'Business website',
  'Landing page',
  'Booking website',
  'E-commerce',
  'Web application',
  'Website redesign',
];

const ASSET_STATUSES = [
  ['unknown', 'Not discussed'],
  ['ready', 'Ready'],
  ['partial', 'Partly ready'],
  ['needed', 'Needs WeReact'],
] as const;

const PROJECT_SECTIONS = ['overview', 'scope', 'assets', 'delivery'] as const;
type ProjectSection = (typeof PROJECT_SECTIONS)[number];

const PROJECT_SECTION_LABELS: Record<ProjectSection, string> = {
  overview: 'Overview',
  scope: 'Scope',
  assets: 'Assets',
  delivery: 'Delivery',
};

function toMarrakechInput(iso: string | null) {
  if (!iso) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Casablanca',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(iso));
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return value.year + '-' + value.month + '-' + value.day + 'T' + value.hour + ':' + value.minute;
}

function eventTitle(kind: LeadEvent['kind']) {
  if (kind === 'created') return 'Lead received';
  if (kind === 'status_change') return 'Pipeline updated';
  if (kind === 'email_sent') return 'Email sent';
  if (kind === 'contacted') return 'Client contacted';
  return 'Team note';
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('en-MA', {
    timeZone: 'Africa/Casablanca',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function LeadWorkflowEditor({ lead, hasProjects }: { lead: CrmLead; hasProjects: boolean }) {
  const router = useRouter();
  const [estimatedValue, setEstimatedValue] = useState(
    lead.estimated_value == null ? '' : String(lead.estimated_value),
  );
  const [followUp, setFollowUp] = useState(toMarrakechInput(lead.next_follow_up));
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [saving, startSaving] = useTransition();
  const lifecycleAction = getLeadLifecycleAction(lead.status);
  const activeStageIndex = SALES_PIPELINE_STATUSES.indexOf(
    lead.status as (typeof SALES_PIPELINE_STATUSES)[number],
  );
  const isClosed = lead.status === 'won' || lead.status === 'lost';
  const winningWithoutProject = lifecycleAction?.nextStatus === 'won' && !hasProjects;

  function submitWorkflow(nextStatus: LeadStatus, successMessage: string) {
    setMessage('');
    setIsError(false);

    startSaving(async () => {
      let nextFollowUp = '';
      if (followUp) {
        const parsed = new Date(followUp);
        if (Number.isNaN(parsed.getTime())) {
          setIsError(true);
          setMessage('Choose a valid follow-up date.');
          return;
        }
        nextFollowUp = parsed.toISOString();
      }

      const result = await updateLeadAction(lead.id, {
        status: nextStatus,
        assignedTo: '',
        estimatedValue,
        nextFollowUp,
        expectedUpdatedAt: lead.updated_at,
      });

      setIsError(!result.ok);
      setMessage(result.ok ? successMessage : (result.error ?? 'Could not save.'));
      if (result.ok) router.refresh();
    });
  }

  function saveWorkflow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitWorkflow(lead.status, 'Sales details saved.');
  }

  function advanceLead() {
    if (!lifecycleAction || winningWithoutProject) return;
    submitWorkflow(lifecycleAction.nextStatus, lifecycleAction.nextStatus === 'won'
      ? 'Sale won. The client is now linked to website delivery.'
      : 'Sales phase updated.');
  }

  function markLost() {
    if (!window.confirm('Mark this enquiry as lost? You can reopen it later.')) return;
    submitWorkflow('lost', 'Client moved to Lost clients.');
  }

  function reopenLead() {
    submitWorkflow('discovery', 'Client reopened in Discovery.');
  }

  return (
    <aside className="crm-workflow crm-sales-phase">
      <header className="crm-sales-phase__header">
        <div>
          <p className="crm-eyebrow"><span /> Sales phase</p>
          <h2>{STATUS_LABELS[lead.status]}</h2>
        </div>
        <span className={'crm-outcome-badge crm-outcome-badge--' + lead.status}>
          {isClosed ? STATUS_LABELS[lead.status] : 'Active'}
        </span>
      </header>

      <ol className="crm-sales-rail" aria-label="Sales progress">
        {SALES_PIPELINE_STATUSES.map((stage, index) => (
          <li
            className={
              index < activeStageIndex
                ? 'is-complete'
                : index === activeStageIndex
                  ? 'is-current'
                  : ''
            }
            aria-current={index === activeStageIndex ? 'step' : undefined}
            key={stage}
          >
            <span>{index + 1}</span>
            <small>{STATUS_LABELS[stage]}</small>
          </li>
        ))}
      </ol>

      {isClosed && (
        <div className={'crm-sales-outcome crm-sales-outcome--' + lead.status}>
          <strong>{lead.status === 'won' ? 'Sale won' : 'Sale lost'}</strong>
          <span>{lead.status === 'won'
            ? 'The sales record is closed; delivery continues through its website project.'
            : 'This enquiry is stored in Lost clients and no longer clutters the active pipeline.'}</span>
        </div>
      )}

      <form className="crm-editor-form" onSubmit={saveWorkflow}>
        <div className="crm-sales-fields">
          <div className="crm-field">
            <label htmlFor="lead-follow-up">Next follow-up</label>
            <input id="lead-follow-up" type="datetime-local" value={followUp} onChange={(event) => setFollowUp(event.target.value)} />
          </div>

          <div className="crm-field">
            <label htmlFor="lead-value">Expected budget (MAD)</label>
            <input
              id="lead-value"
              type="number"
              min="0"
              max="10000000"
              step="50"
              inputMode="decimal"
              value={estimatedValue}
              onChange={(event) => setEstimatedValue(event.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="crm-sales-actions">
          <button type="submit" className="crm-secondary-button" disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save details'}
          </button>

          {lifecycleAction && (
            <button
              type="button"
              className="crm-primary-button"
              disabled={saving || winningWithoutProject}
              title={winningWithoutProject ? 'Create a website project before closing this sale as won.' : undefined}
              onClick={advanceLead}
            >
              <ArrowRight size={16} />
              {lifecycleAction.label}
            </button>
          )}

          {isClosed ? (
            <button type="button" className="crm-text-button" disabled={saving} onClick={reopenLead}>
              <RotateCcw size={15} /> Reopen in discovery
            </button>
          ) : (
            <button type="button" className="crm-text-button crm-text-button--danger" disabled={saving} onClick={markLost}>
              <XCircle size={15} /> Mark as lost
            </button>
          )}
        </div>

        {winningWithoutProject && (
          <p className="crm-workflow-hint">Create the website project below before marking the sale as won.</p>
        )}
        <p className={'crm-form-message ' + (isError ? 'is-error' : '')} aria-live="polite">{message}</p>
      </form>
    </aside>
  );
}
type ProjectDraft = {
  projectId: string;
  expectedUpdatedAt: string;
  projectName: string;
  projectType: string;
  domainName: string;
  status: ProjectStatus;
  goals: string;
  pages: string;
  features: string;
  languages: string;
  contentStatus: string;
  brandStatus: string;
  domainStatus: string;
  hostingStatus: string;
  references: string;
  budget: string;
  targetLaunch: string;
  developerNotes: string;
};

function projectToDraft(project?: CrmProject): ProjectDraft {
  return {
    projectId: project?.id ?? '',
    expectedUpdatedAt: project?.updated_at ?? '',
    projectName: project?.project_name ?? '',
    projectType: project?.project_type ?? '',
    domainName: project?.domain_name ?? '',
    status: project?.status ?? 'briefing',
    goals: project?.goals ?? '',
    pages: project?.pages.join('\n') ?? '',
    features: project?.features.join('\n') ?? '',
    languages: project?.languages.join(', ') ?? '',
    contentStatus: project?.content_status ?? 'unknown',
    brandStatus: project?.brand_status ?? 'unknown',
    domainStatus: project?.domain_status ?? 'unknown',
    hostingStatus: project?.hosting_status ?? 'unknown',
    references: project?.reference_sites.join('\n') ?? '',
    budget: project?.budget == null ? '' : String(project.budget),
    targetLaunch: project?.target_launch ?? '',
    developerNotes: project?.developer_notes ?? '',
  };
}

type ProjectBriefEditorProps = {
  lead: CrmLead;
  projects: CrmProject[];
  initialProjectId?: string;
  teamMembers?: TeamMember[];
  workItems?: ProjectWorkItem[];
  invoices?: Invoice[];
  invoiceLines?: InvoiceLine[];
  invoiceSlot?: ReactNode;
};

export function ProjectBriefEditor({
  lead,
  projects,
  initialProjectId,
  teamMembers = [],
  workItems = [],
  invoices = [],
  invoiceLines = [],
  invoiceSlot,
}: ProjectBriefEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<ProjectDraft>(() => {
    const initialProject = projects.find((project) => project.id === initialProjectId) ?? projects[0];
    return projectToDraft(initialProject);
  });
  const selectedProject = projects.find((project) => project.id === draft.projectId) ?? null;
  const [section, setSection] = useState<ProjectSection>('overview');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [saving, startSaving] = useTransition();
  const [dirty, setDirty] = useState(false);

  const progress = useMemo(() => getProjectBriefProgress({
    project_name: draft.projectName,
    project_type: draft.projectType,
    goals: draft.goals,
    pages: draft.pages.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean),
    features: draft.features.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean),
    languages: draft.languages.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean),
  }), [draft]);

  function update<K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) {
    setDirty(true);
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function chooseProject(project?: CrmProject) {
    if (dirty && !window.confirm('Discard the unsaved changes to this website?')) return;
    setDirty(false);
    setDraft(projectToDraft(project));
    setSection('overview');
    setMessage('');
    setIsError(false);
    router.replace(
      project ? `/admin/leads/${lead.id}?project=${project.id}` : `/admin/leads/${lead.id}`,
      { scroll: false },
    );
  }

  function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitProject(draft.status);
  }

  function submitProject(nextStatus: ProjectStatus) {
    setMessage('');
    setIsError(false);
    startSaving(async () => {
      const result = await saveProjectBriefAction(lead.id, { ...draft, status: nextStatus });
      setIsError(!result.ok);
      setMessage(result.ok
        ? (nextStatus === 'launched'
          ? `Project closed and ${formatMad(Number(draft.budget))} recorded as paid revenue.`
          : `${PROJECT_STATUS_LABELS[nextStatus]} saved.`)
        : (result.error ?? 'Could not save.'));
      if (result.ok) {
        const projectId = result.projectId ?? draft.projectId;
        setDraft((current) => ({
          ...current,
          status: nextStatus,
          projectId,
          expectedUpdatedAt: result.updatedAt ?? current.expectedUpdatedAt,
        }));
        setDirty(false);
        if (projectId) {
          router.replace(`/admin/leads/${lead.id}?project=${projectId}`, { scroll: false });
        }
        router.refresh();
      }
    });
  }

  const lifecycleAction = getProjectLifecycleAction(draft.status);
  const confirmedBudget = Number(draft.budget);
  const launchProgress = useMemo(
    () => getProjectLaunchProgress(workItems.filter((item) => item.project_id === draft.projectId)),
    [draft.projectId, workItems],
  );
  const closingWithoutAmount = lifecycleAction?.nextStatus === 'launched'
    && (!Number.isFinite(confirmedBudget) || confirmedBudget <= 0);
  const closingWithIncompleteChecks = lifecycleAction?.nextStatus === 'launched'
    && (launchProgress.total === 0 || !launchProgress.ready);
  const lifecycleDisabled = saving
    || !progress.ready
    || closingWithoutAmount
    || closingWithIncompleteChecks
    || (draft.status !== 'briefing' && !draft.projectId);

  function advanceProject() {
    if (!lifecycleAction) return;
    const confirmation = lifecycleAction.nextStatus === 'launched'
      ? `Close this project and record ${formatMad(confirmedBudget)} as paid revenue?`
      : lifecycleAction.confirmation;
    if (confirmation && !window.confirm(confirmation)) return;
    submitProject(lifecycleAction.nextStatus);
  }

  const workspaceProject = selectedProject ? {
    ...selectedProject,
    project_name: draft.projectName,
    project_type: draft.projectType,
    domain_name: draft.domainName,
    status: draft.status,
    domain_status: draft.domainStatus,
    hosting_status: draft.hostingStatus,
    target_launch: draft.targetLaunch || null,
  } : null;

  return (
    <section className="crm-section crm-project-brief">
      <header className="crm-project-header">
        <div>
          <p className="crm-eyebrow"><span /> Project workspace</p>
          <h2>{draft.projectId ? (draft.projectName || 'Website project') : 'Create a website project'}</h2>
          <p>One workspace per website, from client brief to launch.</p>
        </div>
        <div className="crm-progress" aria-label={progress.percentage + '% brief complete'}>
          <strong>{progress.percentage}%</strong>
          <span><i style={{ width: progress.percentage + '%' }} /></span>
        </div>
      </header>

      <div className="crm-project-tabs crm-project-selector" aria-label="Client websites">
        {projects.map((project) => (
          <button
            type="button"
            key={project.id}
            onClick={() => chooseProject(project)}
            className={draft.projectId === project.id ? 'is-active' : ''}
          >
            <Globe2 size={15} />
            <span>{project.project_name}</span>
            <small>{PROJECT_STATUS_LABELS[project.status]}</small>
          </button>
        ))}
        <button type="button" onClick={() => chooseProject()} className={!draft.projectId ? 'is-active' : ''}>
          <Plus size={15} /><span>Add another website</span>
        </button>
      </div>

      <label className="crm-project-selector-mobile">
        <Globe2 size={16} />
        <span>Selected project</span>
        <select
          value={draft.projectId || 'new'}
          aria-label="Selected project"
          onChange={(event) => chooseProject(
            event.target.value === 'new'
              ? undefined
              : projects.find((project) => project.id === event.target.value),
          )}
        >
          {projects.map((project) => (
            <option value={project.id} key={project.id}>{project.project_name}</option>
          ))}
          <option value="new">Add another website</option>
        </select>
      </label>

      {!draft.projectId && (
        <div className="crm-project-new-note">
          <strong>{projects.length === 0 ? 'Start the first website brief' : 'Add a separate website'}</strong>
          <p>{projects.length === 0
            ? 'Capture what this client needs so sales and delivery share one clear source of truth.'
            : 'Use a new workspace when this client commissions another website or a separate brand.'}</p>
        </div>
      )}

      <ProjectWorkspace
        key={draft.projectId || 'new-project'}
        leadId={lead.id}
        project={workspaceProject}
        teamMembers={teamMembers}
        workItems={workItems}
        invoiceSlot={invoiceSlot ?? (workspaceProject ? (
          <InvoiceWorkspace
            key={`${workspaceProject.id}:${invoices[0]?.id ?? 'new'}:${invoices[0]?.updated_at ?? ''}`}
            leadId={lead.id}
            lead={lead}
            project={workspaceProject}
            invoices={invoices}
            invoiceLines={invoiceLines}
          />
        ) : undefined)}
        brief={
      <form onSubmit={saveProject} className="crm-brief-form">
        <div className="crm-brief-nav" role="tablist" aria-label="Project brief sections">
          {PROJECT_SECTIONS.map((item) => (
            <button
              type="button"
              role="tab"
              aria-selected={section === item}
              aria-controls={'project-panel-' + item}
              id={'project-tab-' + item}
              className={section === item ? 'is-active' : ''}
              onClick={() => setSection(item)}
              key={item}
            >
              {PROJECT_SECTION_LABELS[item]}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={'project-panel-' + section}
          aria-labelledby={'project-tab-' + section}
          className="crm-brief-panel"
        >
          {section === 'overview' && (
            <>
              <div className="crm-form-grid">
                <div className="crm-field">
                  <label htmlFor="project-name">Project name *</label>
                  <input id="project-name" value={draft.projectName} onChange={(event) => update('projectName', event.target.value)} placeholder="e.g. Atlas Tours booking website" required />
                </div>
                <div className="crm-field">
                  <label htmlFor="project-type">Website type *</label>
                  <select id="project-type" value={draft.projectType} onChange={(event) => update('projectType', event.target.value)} required>
                    <option value="">Choose a type</option>
                    {WEBSITE_TYPES.map((type) => <option value={type} key={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div className="crm-field">
                <label htmlFor="project-domain">Domain name</label>
                <input
                  id="project-domain"
                  type="text"
                  inputMode="url"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={draft.domainName}
                  onChange={(event) => update('domainName', event.target.value)}
                  placeholder="example.com"
                />
              </div>

              <div className="crm-field">
                <label htmlFor="project-goals">Business goal *</label>
                <textarea id="project-goals" value={draft.goals} onChange={(event) => update('goals', event.target.value)} placeholder="What should this website achieve? Who should contact, book, or buy?" />
              </div>
            </>
          )}

          {section === 'scope' && (
            <>
              <div className="crm-form-grid">
                <div className="crm-field">
                  <label htmlFor="project-pages">Pages needed * <small>One per line</small></label>
                  <textarea id="project-pages" value={draft.pages} onChange={(event) => update('pages', event.target.value)} placeholder={'Home\nAbout\nServices\nContact'} />
                </div>
                <div className="crm-field">
                  <label htmlFor="project-features">Features * <small>One per line</small></label>
                  <textarea id="project-features" value={draft.features} onChange={(event) => update('features', event.target.value)} placeholder={'WhatsApp CTA\nBooking form\nGoogle reviews'} />
                </div>
              </div>

              <div className="crm-form-grid">
                <div className="crm-field">
                  <label htmlFor="project-languages">Languages *</label>
                  <input id="project-languages" value={draft.languages} onChange={(event) => update('languages', event.target.value)} placeholder="English, French" />
                </div>
                <div className="crm-field">
                  <label htmlFor="project-references">Reference websites</label>
                  <textarea id="project-references" value={draft.references} onChange={(event) => update('references', event.target.value)} placeholder="One URL per line" />
                </div>
              </div>
            </>
          )}

          {section === 'assets' && (
            <fieldset className="crm-readiness">
              <legend>Client assets</legend>
              {([
                ['contentStatus', 'Content'],
                ['brandStatus', 'Logo & brand'],
                ['domainStatus', 'Domain'],
                ['hostingStatus', 'Hosting'],
              ] as const).map(([key, label]) => (
                <div className="crm-field" key={key}>
                  <label htmlFor={key}>{label}</label>
                  <select id={key} value={draft[key]} onChange={(event) => update(key, event.target.value)}>
                    {ASSET_STATUSES.map(([value, text]) => <option value={value} key={value}>{text}</option>)}
                  </select>
                </div>
              ))}
            </fieldset>
          )}

          {section === 'delivery' && (
            <>
              <div className="crm-form-grid">
                <div className="crm-field">
                  <label htmlFor="project-budget">Confirmed budget (MAD)</label>
                  <input id="project-budget" type="number" min="0" inputMode="decimal" value={draft.budget} onChange={(event) => update('budget', event.target.value)} placeholder="e.g. 6000" disabled={draft.status === 'launched'} />
                </div>
                <div className="crm-field">
                  <label htmlFor="project-date">Target launch</label>
                  <input id="project-date" type="date" value={draft.targetLaunch} onChange={(event) => update('targetLaunch', event.target.value)} />
                </div>
              </div>

              <div className="crm-field">
                <label htmlFor="developer-notes">Developer notes</label>
                <textarea id="developer-notes" value={draft.developerNotes} onChange={(event) => update('developerNotes', event.target.value)} placeholder="Client preferences, constraints, content promises, integrations..." />
              </div>
            </>
          )}
        </div>

        {progress.missing.length > 0 && (
          <p className="crm-brief-hint">Before handoff: add {progress.missing.map((field) => field.replace('_', ' ')).join(', ')}.</p>
        )}
        {closingWithoutAmount && (
          <p className="crm-brief-hint is-payment">Add the confirmed project amount before closing and recording payment.</p>
        )}
        {closingWithIncompleteChecks && (
          <div className="crm-brief-hint is-launch-blocked" role="status">
            <strong>Remaining launch checks:</strong>
            <span>{launchProgress.total === 0
              ? 'The required launch checklist is unavailable.'
              : launchProgress.incomplete.join(', ') + '.'}</span>
          </div>
        )}

        <div className="crm-brief-actions">
          <button type="submit" className="crm-secondary-button" disabled={saving || !dirty}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
          {lifecycleAction ? (
            <button type="button" className="crm-primary-button" disabled={lifecycleDisabled} onClick={advanceProject}>
              {lifecycleAction.nextStatus === 'launched'
                ? <CircleCheckBig size={16} />
                : <ArrowRight size={16} />}
              {saving ? 'Updating...' : lifecycleAction.label}
            </button>
          ) : (
            <div className="crm-project-complete" role="status">
              <CircleCheckBig size={18} />
              <div>
                <strong>Payment recorded</strong>
                <span>{formatMad(confirmedBudget)} · Project filed in Closed Projects</span>
              </div>
              <Link href="/admin/finance" className="crm-project-complete__link">View in Finance</Link>
            </div>
          )}
        </div>
        <p className={'crm-form-message ' + (isError ? 'is-error' : '')} aria-live="polite">{message}</p>
      </form>
        }
      />
    </section>
  );
}

export function LeadActivity({
  leadId,
  events,
  embedded = false,
}: {
  leadId: string;
  events: LeadEvent[];
  embedded?: boolean;
}) {
  const router = useRouter();
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [saving, startSaving] = useTransition();

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsError(false);
    startSaving(async () => {
      const result = await addLeadNoteAction(leadId, note);
      setIsError(!result.ok);
      setMessage(result.ok ? 'Note added.' : (result.error ?? 'Could not save.'));
      if (result.ok) {
        setNote('');
        router.refresh();
      }
    });
  }

  const content = (
    <>
      <form className="crm-note-composer" onSubmit={saveNote}>
        <div className="crm-field">
          <label htmlFor="lead-note">Private sales note</label>
          <textarea id="lead-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Call outcome, objection, proposal sent, next action..." maxLength={2000} />
        </div>
        <div className="crm-form-actions">
          <button type="submit" className="crm-secondary-button" disabled={saving}>
            <Send size={14} />{saving ? 'Adding...' : 'Add note'}
          </button>
          <p className={'crm-form-message ' + (isError ? 'is-error' : '')} aria-live="polite">{message}</p>
        </div>
      </form>
      <div className="crm-timeline">
        {events.map((item) => (
          <article className="crm-event" key={item.id}>
            <span className="crm-event__dot" />
            <div>
              <strong>{eventTitle(item.kind)}</strong>
              {item.body && <p>{item.body}</p>}
            </div>
            <time dateTime={item.created_at}>{formatTimestamp(item.created_at)}</time>
          </article>
        ))}
        {events.length === 0 && <div className="crm-empty-state">No activity recorded yet.</div>}
      </div>
    </>
  );

  if (embedded) {
    return <div className="crm-drawer-activity">{content}</div>;
  }

  return (
    <details className="crm-section crm-collapsible crm-activity-details">
      <summary>
        <span>History</span>
        <small>{events.length} {events.length === 1 ? 'entry' : 'entries'}</small>
      </summary>
      <div className="crm-collapsible__content">{content}</div>
    </details>
  );
}
