'use client';

import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Code2,
  FileText,
  Globe2,
  ReceiptText,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { useMemo, useState, useTransition, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  assignProjectDeveloperAction,
  deleteProjectWorkItemAction,
  saveProjectWorkItemAction,
} from '../../actions';
import {
  PROJECT_WORK_ITEM_PRIORITIES,
  PROJECT_WORK_ITEM_STATUSES,
  getProjectLaunchProgress,
  getProjectWorkProgress,
  type CrmProject,
  type ProjectWorkItem,
  type ProjectWorkItemKind,
  type ProjectWorkItemPriority,
  type ProjectWorkItemStatus,
  type TeamMember,
} from '@/lib/crm';

const WORKSPACE_VIEWS = ['brief', 'work', 'launch', 'invoice'] as const;
type WorkspaceView = (typeof WORKSPACE_VIEWS)[number];

const VIEW_LABELS: Record<WorkspaceView, string> = {
  brief: 'Brief',
  work: 'Work',
  launch: 'Launch',
  invoice: 'Invoice',
};

const STATUS_LABELS: Record<ProjectWorkItemStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  blocked: 'Blocked',
  done: 'Done',
  skipped: 'Skipped',
};

const PRIORITY_LABELS: Record<ProjectWorkItemPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
};

const READINESS_LABELS: Record<string, string> = {
  unknown: 'Not discussed',
  ready: 'Ready',
  partial: 'Partly ready',
  needed: 'Needs WeReact',
};

const VIEW_ICONS = {
  brief: FileText,
  work: Code2,
  launch: ClipboardCheck,
  invoice: ReceiptText,
};

type WorkItemDraft = {
  kind: Exclude<ProjectWorkItemKind, 'delivery_check'>;
  title: string;
  details: string;
  status: ProjectWorkItemStatus;
  priority: ProjectWorkItemPriority;
  dueOn: string;
  assignedTo: string;
};

const EMPTY_WORK_ITEM: WorkItemDraft = {
  kind: 'task',
  title: '',
  details: '',
  status: 'todo',
  priority: 'normal',
  dueOn: '',
  assignedTo: '',
};

type ProjectWorkspaceProps = {
  leadId: string;
  project: CrmProject | null;
  teamMembers: TeamMember[];
  workItems: ProjectWorkItem[];
  brief: ReactNode;
  invoiceSlot?: ReactNode;
};

function isComplete(status: ProjectWorkItemStatus) {
  return status === 'done' || status === 'skipped';
}

function memberLabel(member: TeamMember) {
  return member.name?.trim() || member.email;
}

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-MA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function workItemPayload(item: ProjectWorkItem, changes: Partial<ProjectWorkItem> = {}) {
  const next = { ...item, ...changes };
  return {
    projectId: next.project_id,
    kind: next.kind,
    title: next.title,
    details: next.details,
    status: next.status,
    priority: next.priority,
    dueOn: next.due_on ?? '',
    assignedTo: next.assigned_to ?? '',
    required: next.required,
    position: next.position,
    completedAt: next.completed_at,
  };
}

export function ProjectWorkspace({
  leadId,
  project,
  teamMembers,
  workItems,
  brief,
  invoiceSlot,
}: ProjectWorkspaceProps) {
  const router = useRouter();
  const [view, setView] = useState<WorkspaceView>('brief');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectWorkItem | null>(null);
  const [itemDraft, setItemDraft] = useState<WorkItemDraft>(EMPTY_WORK_ITEM);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [saving, startSaving] = useTransition();

  const projectItems = useMemo(
    () => project ? workItems.filter((item) => item.project_id === project.id) : [],
    [project, workItems],
  );
  const workProgress = useMemo(() => getProjectWorkProgress(projectItems), [projectItems]);
  const launchProgress = useMemo(() => getProjectLaunchProgress(projectItems), [projectItems]);
  const launchReady = launchProgress.total > 0 && launchProgress.ready;
  const milestones = projectItems.filter((item) => item.kind === 'milestone');
  const tasks = projectItems.filter((item) => item.kind === 'task');
  const checks = projectItems.filter((item) => item.kind === 'delivery_check');
  const nextMilestone = milestones.find((item) => item.id === workProgress.next) ?? null;
  const availableViews = project ? WORKSPACE_VIEWS : (['brief'] as const);

  function showResult(ok: boolean, resultMessage: string) {
    setIsError(!ok);
    setMessage(resultMessage);
  }

  function refreshAfterAction() {
    router.refresh();
  }

  function assignDeveloper(value: string) {
    if (saving || !project) return;
    startSaving(async () => {
      const result = await assignProjectDeveloperAction(leadId, project.id, value || null);
      showResult(result.ok, result.ok ? 'Developer assignment updated.' : (result.error ?? 'Could not update assignment.'));
      if (result.ok) refreshAfterAction();
    });
  }

  function updateItem(item: ProjectWorkItem, changes: Partial<ProjectWorkItem>, successMessage: string) {
    if (saving) return;
    startSaving(async () => {
      const result = await saveProjectWorkItemAction(
        leadId,
        item.id,
        workItemPayload(item, changes),
      );
      showResult(result.ok, result.ok ? successMessage : (result.error ?? 'Could not update this work item.'));
      if (result.ok) refreshAfterAction();
    });
  }

  function updateStatus(item: ProjectWorkItem, status: ProjectWorkItemStatus) {
    updateItem(item, {
      status,
      completed_at: isComplete(status) ? (item.completed_at ?? new Date().toISOString()) : null,
    }, `${item.title} updated.`);
  }

  function beginAdd() {
    if (saving) return;
    setEditingItem(null);
    setItemDraft(EMPTY_WORK_ITEM);
    setEditorOpen(true);
    setMessage('');
    setIsError(false);
  }

  function beginEdit(item: ProjectWorkItem) {
    if (saving || item.kind === 'delivery_check') return;
    setEditingItem(item);
    setItemDraft({
      kind: item.kind,
      title: item.title,
      details: item.details,
      status: item.status,
      priority: item.priority,
      dueOn: item.due_on ?? '',
      assignedTo: item.assigned_to ?? '',
    });
    setEditorOpen(true);
    setMessage('');
    setIsError(false);
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditingItem(null);
    setItemDraft(EMPTY_WORK_ITEM);
  }

  function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !project) return;

    const position = editingItem?.position
      ?? (projectItems.reduce((highest, item) => Math.max(highest, item.position), -1) + 1);
    const completedAt = isComplete(itemDraft.status)
      ? (editingItem?.completed_at ?? new Date().toISOString())
      : null;

    startSaving(async () => {
      const result = await saveProjectWorkItemAction(leadId, editingItem?.id ?? null, {
        projectId: project.id,
        kind: itemDraft.kind,
        title: itemDraft.title,
        details: itemDraft.details,
        status: itemDraft.status,
        priority: itemDraft.priority,
        dueOn: itemDraft.dueOn,
        assignedTo: itemDraft.assignedTo,
        required: false,
        position,
        completedAt,
      });
      showResult(result.ok, result.ok ? (editingItem ? 'Work item updated.' : 'Work item added.') : (result.error ?? 'Could not save this work item.'));
      if (result.ok) {
        closeEditor();
        refreshAfterAction();
      }
    });
  }

  function deleteItem(item: ProjectWorkItem) {
    if (saving || !project || !window.confirm(`Delete "${item.title}"?`)) return;
    startSaving(async () => {
      const result = await deleteProjectWorkItemAction(leadId, project.id, item.id);
      showResult(result.ok, result.ok ? 'Work item deleted.' : (result.error ?? 'Could not delete this work item.'));
      if (result.ok) refreshAfterAction();
    });
  }

  function renderWorkItemRow(item: ProjectWorkItem) {
    return (
      <article className={`crm-work-item-row crm-work-item-row--${item.status}`} key={item.id}>
        <div className="crm-work-item__identity">
          <span className={`crm-work-item__priority crm-work-item__priority--${item.priority}`} />
          <div>
            <strong>{item.title}</strong>
            {item.details && <p>{item.details}</p>}
          </div>
        </div>
        <label className="crm-work-item__field">
          <span>Status</span>
          <select
            className="crm-work-item__control"
            value={item.status}
            aria-label={`Status for ${item.title}`}
            disabled={saving}
            onChange={(event) => updateStatus(item, event.target.value as ProjectWorkItemStatus)}
          >
            {PROJECT_WORK_ITEM_STATUSES.map((status) => (
              <option value={status} key={status}>{STATUS_LABELS[status]}</option>
            ))}
          </select>
        </label>
        <label className="crm-work-item__field">
          <span>Priority</span>
          <select
            className="crm-work-item__control"
            value={item.priority}
            aria-label={`Priority for ${item.title}`}
            disabled={saving}
            onChange={(event) => updateItem(
              item,
              { priority: event.target.value as ProjectWorkItemPriority },
              `${item.title} priority updated.`,
            )}
          >
            {PROJECT_WORK_ITEM_PRIORITIES.map((priority) => (
              <option value={priority} key={priority}>{PRIORITY_LABELS[priority]}</option>
            ))}
          </select>
        </label>
        <div className="crm-work-item__meta">
          <span><UserRound size={13} />{item.assigned_to ? item.assigned_to.split('@')[0] : 'Unassigned'}</span>
          <span className={item.due_on && item.due_on < new Date().toISOString().slice(0, 10) && !isComplete(item.status) ? 'is-overdue' : ''}>
            <CalendarDays size={13} />{formatDate(item.due_on)}
          </span>
        </div>
        <div className="crm-work-item__actions">
          <button type="button" className="crm-work-icon-button" disabled={saving} onClick={() => beginEdit(item)} aria-label={`Edit ${item.title}`} title="Edit work item">
            <Pencil size={15} />
          </button>
          <button type="button" className="crm-work-icon-button is-danger" disabled={saving} onClick={() => deleteItem(item)} aria-label={`Delete ${item.title}`} title="Delete work item">
            <Trash2 size={15} />
          </button>
        </div>
      </article>
    );
  }

  return (
    <div className="crm-project-workspace">
      <nav className="crm-project-view-tabs" aria-label="Project workspace views">
        {availableViews.map((item) => {
          const Icon = VIEW_ICONS[item];
          return (
            <button
              type="button"
              role="tab"
              aria-selected={view === item}
              aria-controls={`project-view-${item}`}
              id={`project-view-tab-${item}`}
              className={view === item ? 'is-active' : ''}
              onClick={() => setView(item)}
              key={item}
            >
              <Icon size={15} />
              {VIEW_LABELS[item]}
            </button>
          );
        })}
      </nav>

      <section
        role="tabpanel"
        id="project-view-brief"
        aria-labelledby="project-view-tab-brief"
        className="crm-project-view-panel"
        hidden={view !== 'brief'}
      >
        {brief}
      </section>

      {project && (
        <>
          <section
            role="tabpanel"
            id="project-view-work"
            aria-labelledby="project-view-tab-work"
            className="crm-project-view-panel"
            hidden={view !== 'work'}
          >
            <div className="crm-work-summary">
              <label className="crm-work-summary__assignment">
                <span><UserRound size={14} /> Assigned developer</span>
                <select
                  value={project.assigned_developer_email ?? ''}
                  disabled={saving}
                  onChange={(event) => assignDeveloper(event.target.value)}
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map((member) => (
                    <option value={member.email} key={member.email}>{memberLabel(member)}</option>
                  ))}
                </select>
              </label>
              <div className="crm-work-summary__deadline">
                <span><CalendarDays size={14} /> Target launch</span>
                <strong>{formatDate(project.target_launch)}</strong>
              </div>
              <div className="crm-work-summary__progress">
                <span>Milestone progress</span>
                <strong>{workProgress.completed} / {workProgress.total}</strong>
                <i aria-label={`${workProgress.percentage}% of milestones complete`}>
                  <b style={{ width: `${workProgress.percentage}%` }} />
                </i>
              </div>
            </div>

            <div className="crm-milestone-rail" aria-label="Project milestones">
              {milestones.length > 0 ? milestones.map((item) => (
                <div className={`${isComplete(item.status) ? 'is-complete' : ''} ${item.id === workProgress.next ? 'is-next' : ''}`} key={item.id}>
                  <span>{isComplete(item.status) ? <CheckCircle2 size={14} /> : item.position + 1}</span>
                  <strong>{item.title}</strong>
                  <small>{item.id === workProgress.next ? 'Next milestone' : STATUS_LABELS[item.status]}</small>
                </div>
              )) : <p className="crm-work-empty">No milestones yet. Add one to make delivery progress visible.</p>}
            </div>

            {nextMilestone && (
              <p className="crm-next-milestone"><span>Next milestone</span>{nextMilestone.title}</p>
            )}

            <div className="crm-work-list-header">
              <div>
                <span>Delivery work</span>
                <strong>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</strong>
              </div>
              <button type="button" className="crm-secondary-button" onClick={beginAdd}>
                <Plus size={15} /> Add work item
              </button>
            </div>

            {editorOpen && (
              <form className="crm-work-item-editor" onSubmit={saveItem}>
                <header>
                  <div>
                    <span>{editingItem ? 'Edit work item' : 'Add work item'}</span>
                    <strong>{editingItem?.title ?? 'Plan delivery work'}</strong>
                  </div>
                  <button type="button" className="crm-work-icon-button" onClick={closeEditor} aria-label="Close work item editor" title="Close">
                    <X size={16} />
                  </button>
                </header>
                <div className="crm-work-item-editor__grid">
                  <label className="crm-field crm-work-item-editor__title">
                    <span>Title *</span>
                    <input required maxLength={180} value={itemDraft.title} onChange={(event) => setItemDraft((current) => ({ ...current, title: event.target.value }))} />
                  </label>
                  <label className="crm-field">
                    <span>Type</span>
                    <select value={itemDraft.kind} onChange={(event) => setItemDraft((current) => ({ ...current, kind: event.target.value as WorkItemDraft['kind'] }))}>
                      <option value="task">Task</option>
                      <option value="milestone">Milestone</option>
                    </select>
                  </label>
                  <label className="crm-field">
                    <span>Status</span>
                    <select value={itemDraft.status} onChange={(event) => setItemDraft((current) => ({ ...current, status: event.target.value as ProjectWorkItemStatus }))}>
                      {PROJECT_WORK_ITEM_STATUSES.map((status) => <option value={status} key={status}>{STATUS_LABELS[status]}</option>)}
                    </select>
                  </label>
                  <label className="crm-field">
                    <span>Priority</span>
                    <select value={itemDraft.priority} onChange={(event) => setItemDraft((current) => ({ ...current, priority: event.target.value as ProjectWorkItemPriority }))}>
                      {PROJECT_WORK_ITEM_PRIORITIES.map((priority) => <option value={priority} key={priority}>{PRIORITY_LABELS[priority]}</option>)}
                    </select>
                  </label>
                  <label className="crm-field">
                    <span>Owner</span>
                    <select value={itemDraft.assignedTo} onChange={(event) => setItemDraft((current) => ({ ...current, assignedTo: event.target.value }))}>
                      <option value="">Unassigned</option>
                      {teamMembers.map((member) => <option value={member.email} key={member.email}>{memberLabel(member)}</option>)}
                    </select>
                  </label>
                  <label className="crm-field">
                    <span>Due date</span>
                    <input type="date" value={itemDraft.dueOn} onChange={(event) => setItemDraft((current) => ({ ...current, dueOn: event.target.value }))} />
                  </label>
                  <label className="crm-field crm-work-item-editor__details">
                    <span>Details</span>
                    <textarea maxLength={2000} value={itemDraft.details} onChange={(event) => setItemDraft((current) => ({ ...current, details: event.target.value }))} />
                  </label>
                </div>
                <footer>
                  <button type="button" className="crm-text-button" onClick={closeEditor}>Cancel</button>
                  <button type="submit" className="crm-primary-button" disabled={saving}>
                    <Save size={15} />{saving ? 'Saving...' : 'Save work item'}
                  </button>
                </footer>
              </form>
            )}

            <div className="crm-work-item-list">
              {milestones.map(renderWorkItemRow)}
              {tasks.map(renderWorkItemRow)}
              {milestones.length === 0 && tasks.length === 0 && !editorOpen && (
                <p className="crm-work-empty">No delivery work has been added.</p>
              )}
            </div>
          </section>

          <section
            role="tabpanel"
            id="project-view-launch"
            aria-labelledby="project-view-tab-launch"
            className="crm-project-view-panel"
            hidden={view !== 'launch'}
          >
            <div className="crm-launch-readiness">
              <div>
                <span><Globe2 size={14} /> Domain readiness</span>
                <strong>{READINESS_LABELS[project.domain_status] ?? project.domain_status}</strong>
                <small>{project.domain_name || 'No domain recorded'}</small>
              </div>
              <div>
                <span><Code2 size={14} /> Hosting readiness</span>
                <strong>{READINESS_LABELS[project.hosting_status] ?? project.hosting_status}</strong>
                <small>{project.hosting_status === 'ready' ? 'Production hosting confirmed' : 'Resolve before launch'}</small>
              </div>
              <div className={launchReady ? 'is-ready' : 'is-blocked'}>
                <span>{launchReady ? <CheckCircle2 size={14} /> : <CircleAlert size={14} />} Launch gate</span>
                <strong>{launchReady ? 'Ready to close' : 'Launch blocked'}</strong>
                <small>{launchProgress.completed} of {launchProgress.total} required checks complete</small>
              </div>
            </div>

            {!launchReady && (
              <div className="crm-launch-blocker" role="status">
                <CircleAlert size={18} />
                <div>
                  <strong>Launch blocked</strong>
                  <p>Complete the required checks before closing this project and recording payment.</p>
                  <ul>
                    {launchProgress.incomplete.map((title) => <li key={title}>{title}</li>)}
                  </ul>
                </div>
              </div>
            )}

            <div className="crm-launch-list">
              <header>
                <span>Required checklist</span>
                <strong>{launchProgress.percentage}% complete</strong>
              </header>
              {checks.map((item) => (
                <article className={isComplete(item.status) ? 'is-complete' : ''} key={item.id}>
                  <span className="crm-launch-check-icon">
                    {isComplete(item.status) ? <CheckCircle2 size={17} /> : <CircleAlert size={17} />}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    {item.details && <p>{item.details}</p>}
                  </div>
                  {item.required && <small>Required</small>}
                  <select
                    className="crm-work-item__control"
                    value={item.status}
                    aria-label={`Checklist status for ${item.title}`}
                    disabled={saving}
                    onChange={(event) => updateStatus(item, event.target.value as ProjectWorkItemStatus)}
                  >
                    {PROJECT_WORK_ITEM_STATUSES.map((status) => (
                      <option value={status} key={status}>{STATUS_LABELS[status]}</option>
                    ))}
                  </select>
                </article>
              ))}
              {checks.length === 0 && <p className="crm-work-empty">The required launch checklist has not been created yet.</p>}
            </div>
          </section>

          <section
            role="tabpanel"
            id="project-view-invoice"
            aria-labelledby="project-view-tab-invoice"
            className="crm-project-view-panel crm-invoice-slot"
            hidden={view !== 'invoice'}
            aria-label="Invoice workspace"
          >
            {invoiceSlot}
          </section>
        </>
      )}

      <p className={`crm-form-message ${isError ? 'is-error' : ''}`} aria-live="polite">{message}</p>
    </div>
  );
}
