'use client';

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MailCheck,
  RefreshCw,
  Workflow,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { IntegrationHealth } from '@/lib/automation';
import { retryAutomationEventAction } from '../attention-actions';

export type AutomationMetrics = {
  queued: number;
  running: number;
  failed: number;
  emailSent: number;
  emailDeliveryRate: number;
  emailEngaged: number;
  emailFailed: number;
};

export type AutomationEventSummary = {
  id: string;
  event_type: string;
  aggregate_type: string;
  aggregate_id: string | null;
  idempotency_key: string;
  status: 'pending' | 'processing' | 'retry' | 'completed' | 'failed';
  attempts: number;
  max_attempts: number;
  next_attempt_at: string;
  locked_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

const PROVIDER_LABELS: Record<IntegrationHealth['provider'], { label: string; detail: string }> = {
  resend: { label: 'Email', detail: 'Delivery and engagement tracking' },
  whatsapp: { label: 'WhatsApp', detail: 'Official client messaging' },
  openai: { label: 'AI copilots', detail: 'Structured drafts and summaries' },
  automation: { label: 'Automation', detail: 'Reliable event processing' },
  storage: { label: 'Client files', detail: 'Portal and delivery storage' },
  payments: { label: 'Payments', detail: 'Payment confirmation provider' },
};

function formatDate(value: string | null) {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat('en-MA', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Casablanca',
  }).format(new Date(value));
}

function eventLabel(value: string) {
  return value.replaceAll('.', ' / ').replaceAll('_', ' ');
}

export function AutomationWorkspace({
  integrations,
  events,
  metrics,
}: {
  integrations: IntegrationHealth[];
  events: AutomationEventSummary[];
  metrics: AutomationMetrics;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function retry(id: string) {
    setPendingId(id);
    setError('');
    startTransition(async () => {
      const result = await retryAutomationEventAction({ id });
      if (!result.ok) setError(result.error ?? 'Could not retry this automation.');
      else router.refresh();
      setPendingId(null);
    });
  }

  return (
    <main className="ops-main">
      <header className="ops-page-header">
        <div>
          <p>System control</p>
          <h1>Automation health</h1>
        </div>
        <span>Verified delivery, queues, and provider readiness</span>
      </header>

      <section className="ops-kpis ops-kpis--automation" aria-label="Automation performance">
        <article><span><Clock3 size={17} /> Queue</span><strong>{metrics.queued}</strong><small>pending or retrying</small></article>
        <article><span><Activity size={17} /> Running</span><strong>{metrics.running}</strong><small>being processed now</small></article>
        <article><span><AlertTriangle size={17} /> Failed</span><strong className={metrics.failed ? 'is-negative' : ''}>{metrics.failed}</strong><small>needs a decision</small></article>
        <article><span><MailCheck size={17} /> Email delivery</span><strong>{metrics.emailDeliveryRate}%</strong><small>{metrics.emailEngaged} engaged / {metrics.emailFailed} failed</small></article>
      </section>

      {error ? <p className="ops-form-result is-error" role="alert">{error}</p> : null}

      <div className="ops-automation-grid">
        <section className="ops-panel ops-integrations">
          <header><div><p>Providers</p><h2>Connected systems</h2></div><Workflow size={18} /></header>
          <div>
            {integrations.map((integration) => {
              const content = PROVIDER_LABELS[integration.provider];
              const inactive = ['unconfigured', 'disabled'].includes(integration.status);
              return (
                <article className="ops-integration-row" key={integration.provider}>
                  <span className={`ops-integration-state is-${integration.status}`} aria-hidden="true">
                    {integration.status === 'healthy' ? <CheckCircle2 size={16} /> : <Activity size={16} />}
                  </span>
                  <span>
                    <strong>{content.label}</strong>
                    <small>{content.detail}</small>
                  </span>
                  <span>
                    <b className={`is-${integration.status}`}>{inactive ? 'Not active yet' : integration.status}</b>
                    <small>{inactive ? integration.message : `Checked ${formatDate(integration.last_checked_at)}`}</small>
                  </span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="ops-panel ops-automation-events">
          <header>
            <div><p>Recent runs</p><h2>Event activity</h2></div>
            <span>{events.length} shown</span>
          </header>
          {events.length ? (
            <div>
              {events.map((event) => (
                <article className="ops-automation-event" key={event.id}>
                  <span className={`ops-event-state is-${event.status}`} aria-hidden="true" />
                  <span>
                    <strong>{eventLabel(event.event_type)}</strong>
                    <small>{event.aggregate_type} · {formatDate(event.created_at)}</small>
                  </span>
                  <span>
                    <b>{event.status}</b>
                    <small>{event.attempts}/{event.max_attempts} attempts</small>
                  </span>
                  {['failed', 'retry'].includes(event.status) ? (
                    <button
                      type="button"
                      onClick={() => retry(event.id)}
                      disabled={isPending && pendingId === event.id}
                    >
                      <RefreshCw size={14} />
                      Retry
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          ) : <div className="ops-panel-empty">No automation runs yet. New workflow activity will appear here.</div>}
        </section>
      </div>
    </main>
  );
}
