'use client';

import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Send } from 'lucide-react';
import { addLeadNoteAction, updateLeadAction } from '../../actions';
import {
  CRM_STATUSES,
  type CrmLead,
  type LeadEvent,
  type LeadStatus,
  type TeamMember,
} from '@/lib/crm';

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  won: 'Won',
  lost: 'Lost',
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
  return `${value.year}-${value.month}-${value.day}T${value.hour}:${value.minute}`;
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

export function LeadWorkflowEditor({
  lead,
  members,
}: {
  lead: CrmLead;
  members: TeamMember[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [assignedTo, setAssignedTo] = useState(lead.assigned_to ?? '');
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
        assignedTo,
        estimatedValue,
        nextFollowUp,
        expectedUpdatedAt: lead.updated_at,
      });

      setIsError(!result.ok);
      setMessage(result.ok ? 'Lead updated.' : (result.error ?? 'Could not save.'));
      if (result.ok) router.refresh();
    });
  }

  return (
    <aside className="crm-workflow">
      <h2>Next step</h2>
      <p>Keep the stage, owner, value, and next follow-up current so no opportunity goes quiet.</p>

      <form className="crm-editor-form" onSubmit={saveWorkflow}>
        <div className="crm-field">
          <label htmlFor="lead-status">Pipeline stage</label>
          <select id="lead-status" value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)}>
            {CRM_STATUSES.map((item) => <option value={item} key={item}>{STATUS_LABELS[item]}</option>)}
          </select>
        </div>

        <div className="crm-field">
          <label htmlFor="lead-owner">Assigned to</label>
          <select id="lead-owner" value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}>
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option value={member.email} key={member.email}>{member.name ?? member.email}</option>
            ))}
          </select>
        </div>

        <div className="crm-field">
          <label htmlFor="lead-value">Estimated value (MAD)</label>
          <input
            id="lead-value"
            type="number"
            min="0"
            max="10000000"
            step="50"
            inputMode="decimal"
            value={estimatedValue}
            onChange={(event) => setEstimatedValue(event.target.value)}
            placeholder="e.g. 3500"
          />
        </div>

        <div className="crm-field">
          <label htmlFor="lead-follow-up">Next follow-up</label>
          <input
            id="lead-follow-up"
            type="datetime-local"
            value={followUp}
            onChange={(event) => setFollowUp(event.target.value)}
          />
        </div>

        <div className="crm-form-actions">
          <button type="submit" className="crm-primary-button" disabled={saving}>
            <Save size={15} />
            {saving ? 'Saving' : 'Save lead'}
          </button>
        </div>
        <p className={`crm-form-message ${isError ? 'is-error' : ''}`} aria-live="polite">
          {message}
        </p>
      </form>
    </aside>
  );
}

export function LeadActivity({
  leadId,
  events,
}: {
  leadId: string;
  events: LeadEvent[];
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

  return (
    <section className="crm-section">
      <header>
        <h2>Activity</h2>
        <span>{events.length} {events.length === 1 ? 'entry' : 'entries'}</span>
      </header>

      <form className="crm-note-composer" onSubmit={saveNote}>
        <div className="crm-field">
          <label htmlFor="lead-note">Add a private note</label>
          <textarea
            id="lead-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Call outcome, objection, proposal sent, next action..."
            maxLength={2000}
          />
        </div>
        <div className="crm-form-actions">
          <button type="submit" className="crm-secondary-button" disabled={saving}>
            <Send size={14} />
            {saving ? 'Adding' : 'Add note'}
          </button>
          <p className={`crm-form-message ${isError ? 'is-error' : ''}`} aria-live="polite">
            {message}
          </p>
        </div>
      </form>

      <div className="crm-timeline">
        {events.map((item) => (
          <article className="crm-event" key={item.id}>
            <span className="crm-event__dot" />
            <div>
              <strong>{eventTitle(item.kind)}</strong>
              {item.body && <p>{item.body}</p>}
              <div className="crm-event__author">{item.author || 'System'}</div>
            </div>
            <time dateTime={item.created_at}>{formatTimestamp(item.created_at)}</time>
          </article>
        ))}
        {events.length === 0 && <div className="crm-empty-state">No activity recorded yet.</div>}
      </div>
    </section>
  );
}
