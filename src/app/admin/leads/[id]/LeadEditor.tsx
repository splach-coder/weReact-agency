'use client';

import { FormEvent, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Globe2, Plus, Save, Send } from 'lucide-react';
import { addLeadNoteAction, saveProjectBriefAction, updateLeadAction } from '../../actions';
import {
  CRM_STATUSES,
  PROJECT_STATUSES,
  getProjectBriefProgress,
  type CrmLead,
  type CrmProject,
  type LeadEvent,
  type LeadStatus,
  type ProjectStatus,
} from '@/lib/crm';

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
  launched: 'Launched',
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

export function LeadWorkflowEditor({ lead }: { lead: CrmLead }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [estimatedValue, setEstimatedValue] = useState(
    lead.estimated_value == null ? '' : String(lead.estimated_value),
  );
  const [followUp, setFollowUp] = useState(toMarrakechInput(lead.next_follow_up));
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [saving, startSaving] = useTransition();

  function saveWorkflow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        status,
        assignedTo: '',
        estimatedValue,
        nextFollowUp,
        expectedUpdatedAt: lead.updated_at,
      });

      setIsError(!result.ok);
      setMessage(result.ok ? 'Sales next step saved.' : (result.error ?? 'Could not save.'));
      if (result.ok) router.refresh();
    });
  }

  return (
    <aside className="crm-workflow">
      <p className="crm-eyebrow"><span /> Sales</p>
      <h2>Next action</h2>
      <p>Keep the deal stage, value, and next follow-up current.</p>

      <form className="crm-editor-form" onSubmit={saveWorkflow}>
        <div className="crm-field">
          <label htmlFor="lead-status">Sales stage</label>
          <select id="lead-status" value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)}>
            {CRM_STATUSES.map((item) => <option value={item} key={item}>{STATUS_LABELS[item]}</option>)}
          </select>
        </div>

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

        <button type="submit" className="crm-primary-button crm-button-wide" disabled={saving}>
          <Save size={16} />
          {saving ? 'Saving...' : 'Save next step'}
        </button>
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

export function ProjectBriefEditor({ lead, projects }: { lead: CrmLead; projects: CrmProject[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<ProjectDraft>(() => projectToDraft(projects[0]));
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
        ? (nextStatus === 'ready_for_dev' ? 'Brief is ready for development.' : 'Project brief saved.')
        : (result.error ?? 'Could not save.'));
      if (result.ok) {
        update('status', nextStatus);
        if (result.projectId) update('projectId', result.projectId);
        if (result.updatedAt) update('expectedUpdatedAt', result.updatedAt);
        setDirty(false);
        router.refresh();
      }
    });
  }

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

      <div className="crm-project-tabs" aria-label="Client websites">
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

      {!draft.projectId && (
        <div className="crm-project-new-note">
          <strong>{projects.length === 0 ? 'Start the first website brief' : 'Add a separate website'}</strong>
          <p>{projects.length === 0
            ? 'Capture what this client needs so sales and delivery share one clear source of truth.'
            : 'Use a new workspace when this client commissions another website or a separate brand.'}</p>
        </div>
      )}

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
              <div className="crm-form-grid crm-form-grid--three">
                <div className="crm-field">
                  <label htmlFor="project-stage">Delivery stage</label>
                  <select id="project-stage" value={draft.status} onChange={(event) => update('status', event.target.value as ProjectStatus)}>
                    {PROJECT_STATUSES.map((status) => <option value={status} key={status}>{PROJECT_STATUS_LABELS[status]}</option>)}
                  </select>
                </div>
                <div className="crm-field">
                  <label htmlFor="project-budget">Confirmed budget (MAD)</label>
                  <input id="project-budget" type="number" min="0" inputMode="decimal" value={draft.budget} onChange={(event) => update('budget', event.target.value)} placeholder="e.g. 6000" />
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

        <div className="crm-brief-actions">
          <button type="submit" className="crm-secondary-button" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save project'}
          </button>
          <button type="button" className="crm-primary-button" disabled={saving || !progress.ready} onClick={() => submitProject('ready_for_dev')}>
            <Check size={16} /> Ready for development
          </button>
        </div>
        <p className={'crm-form-message ' + (isError ? 'is-error' : '')} aria-live="polite">{message}</p>
      </form>
    </section>
  );
}

export function LeadActivity({ leadId, events }: { leadId: string; events: LeadEvent[] }) {
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

  return (
    <details className="crm-section crm-collapsible crm-activity-details">
      <summary>
        <span>History</span>
        <small>{events.length} {events.length === 1 ? 'entry' : 'entries'}</small>
      </summary>
      <div className="crm-collapsible__content">
        <form className="crm-note-composer" onSubmit={saveNote}>
          <div className="crm-field">
            <label htmlFor="lead-note">Private sales note</label>
            <textarea id="lead-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Call outcome, client objection, proposal sent, next action..." maxLength={2000} />
          </div>
          <div className="crm-form-actions">
            <button type="submit" className="crm-secondary-button" disabled={saving}><Send size={14} />{saving ? 'Adding...' : 'Add note'}</button>
            <p className={'crm-form-message ' + (isError ? 'is-error' : '')} aria-live="polite">{message}</p>
          </div>
        </form>
        <div className="crm-timeline">
          {events.map((item) => (
            <article className="crm-event" key={item.id}>
              <span className="crm-event__dot" />
              <div>
                <strong>{eventTitle(item.kind)}</strong>
                {item.body && <p>{item.body}</p>}              </div>
              <time dateTime={item.created_at}>{formatTimestamp(item.created_at)}</time>
            </article>
          ))}
          {events.length === 0 && <div className="crm-empty-state">No activity recorded yet.</div>}
        </div>
      </div>
    </details>
  );
}
