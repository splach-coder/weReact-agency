'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Check, Clock3, Inbox } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { groupAttentionItems, type AttentionItem } from '@/lib/automation';
import { attentionMutationAction } from './attention-actions';

const GROUPS = [
  ['overdue', 'Overdue'],
  ['today', 'Today'],
  ['upcoming', 'Upcoming'],
] as const;

function dueLabel(value: string | null) {
  if (!value) return 'No deadline';
  return new Intl.DateTimeFormat('en-MA', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Casablanca',
  }).format(new Date(value));
}

export function AttentionInbox({
  items,
  nowIso,
}: {
  items: AttentionItem[];
  nowIso: string;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const groups = useMemo(
    () => groupAttentionItems(items, new Date(nowIso)),
    [items, nowIso],
  );
  const visibleCount = groups.overdue.length + groups.today.length + groups.upcoming.length;

  function mutate(item: AttentionItem, action: 'complete' | 'snooze') {
    setPendingId(item.id);
    setError('');
    startTransition(async () => {
      const result = await attentionMutationAction({
        id: item.id,
        action,
        snoozeUntil: action === 'snooze'
          ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          : null,
      });
      if (!result.ok) setError(result.error ?? 'Could not update this task.');
      else router.refresh();
      setPendingId(null);
    });
  }

  return (
    <section className="ops-panel ops-attention">
      <header>
        <div>
          <p>What needs you</p>
          <h2>Attention inbox</h2>
        </div>
        <span className="ops-attention-count">{visibleCount}</span>
      </header>

      {error ? <p className="ops-attention-error" role="alert">{error}</p> : null}
      {!visibleCount ? (
        <div className="ops-attention-empty">
          <Inbox size={22} aria-hidden="true" />
          <strong>You are caught up.</strong>
          <span>New leads and delivery risks will appear here.</span>
        </div>
      ) : (
        <div className="ops-attention-groups">
          {GROUPS.map(([key, label]) => groups[key].length ? (
            <section className="ops-attention-group" key={key}>
              <header>
                <span>{label}</span>
                <b>{groups[key].length}</b>
              </header>
              <div>
                {groups[key].map((item) => (
                  <article className={`ops-attention-row is-${item.priority}`} key={item.id}>
                    <span className="ops-attention-priority" aria-hidden="true" />
                    <Link className="ops-attention-copy" href={item.source_href}>
                      <strong>{item.title}</strong>
                      <small>{item.detail || item.kind.replaceAll('_', ' ')}</small>
                      <time>{dueLabel(item.due_at)}</time>
                    </Link>
                    <div className="ops-attention-actions">
                      <Link
                        className="ops-attention-action is-primary"
                        href={item.source_href}
                        title={item.action_label}
                        aria-label={item.action_label}
                      >
                        <ArrowUpRight size={16} />
                      </Link>
                      <button
                        className="ops-attention-action"
                        type="button"
                        title="Snooze for 24 hours"
                        aria-label="Snooze for 24 hours"
                        disabled={isPending && pendingId === item.id}
                        onClick={() => mutate(item, 'snooze')}
                      >
                        <Clock3 size={16} />
                      </button>
                      <button
                        className="ops-attention-action"
                        type="button"
                        title="Mark complete"
                        aria-label="Mark complete"
                        disabled={isPending && pendingId === item.id}
                        onClick={() => mutate(item, 'complete')}
                      >
                        <Check size={17} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null)}
        </div>
      )}
    </section>
  );
}
