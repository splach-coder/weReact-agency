import type { CrmLead, CrmProject } from './crm';
import type { FinanceTransaction } from './operations';

export const ATTENTION_KINDS = [
  'new_lead',
  'follow_up_overdue',
  'proposal_review',
  'proposal_stale',
  'invoice_overdue',
  'email_bounced',
  'blocked_task',
  'launch_risk',
  'integration_failure',
] as const;
export const ATTENTION_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;
export const ATTENTION_STATUSES = ['open', 'snoozed', 'completed'] as const;
export const COMMUNICATION_STATES = [
  'draft',
  'queued',
  'sent',
  'delivered',
  'opened',
  'clicked',
  'replied',
  'bounced',
  'complained',
  'failed',
] as const;
export const INTEGRATION_STATUSES = ['unconfigured', 'configured', 'healthy', 'degraded', 'disabled'] as const;

export type AttentionKind = (typeof ATTENTION_KINDS)[number];
export type AttentionPriority = (typeof ATTENTION_PRIORITIES)[number];
export type AttentionStatus = (typeof ATTENTION_STATUSES)[number];
export type CommunicationState = (typeof COMMUNICATION_STATES)[number];
export type IntegrationStatus = (typeof INTEGRATION_STATUSES)[number];

export type AutomationEvent = {
  id: string;
  event_type: string;
  aggregate_type: string;
  aggregate_id: string | null;
  idempotency_key: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'processing' | 'retry' | 'completed' | 'failed';
  attempts: number;
  max_attempts: number;
  next_attempt_at: string;
  locked_at: string | null;
  completed_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

export type AttentionItem = {
  id: string;
  kind: AttentionKind;
  priority: AttentionPriority;
  status: AttentionStatus;
  title: string;
  detail: string;
  owner_email: string | null;
  due_at: string | null;
  snoozed_until: string | null;
  source_type: 'lead' | 'project' | 'invoice' | 'communication' | 'integration';
  source_id: string | null;
  source_href: string;
  action_label: string;
  idempotency_key: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Communication = {
  id: string;
  channel: 'email' | 'whatsapp' | 'phone' | 'system';
  direction: 'inbound' | 'outbound';
  provider: string;
  provider_message_id: string | null;
  state: CommunicationState;
  from_address: string;
  to_address: string;
  subject: string;
  body_summary: string;
  lead_id: string | null;
  client_id: string | null;
  project_id: string | null;
  invoice_id: string | null;
  approved_by: string | null;
  approved_at: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  failed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CommunicationEvent = {
  id: string;
  communication_id: string | null;
  provider: string;
  provider_event_id: string;
  event_type: string;
  occurred_at: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export type IntegrationHealth = {
  provider: 'resend' | 'whatsapp' | 'openai' | 'automation' | 'storage' | 'payments';
  status: IntegrationStatus;
  message: string;
  last_success_at: string | null;
  last_failure_at: string | null;
  last_checked_at: string;
  updated_at: string;
};

type AttentionMutation = {
  id: string;
  action: 'complete' | 'snooze';
  snoozeUntil: string | null;
};

type ParseResult<T> = { valid: true; value: T } | { valid: false; error: string };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

export function parseAttentionMutation(input: unknown, now = new Date()): ParseResult<AttentionMutation> {
  if (!input || typeof input !== 'object') return { valid: false, error: 'Attention action is missing.' };
  const value = input as Record<string, unknown>;
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const action = value.action;

  if (!UUID_PATTERN.test(id)) return { valid: false, error: 'Invalid attention item.' };
  if (action !== 'complete' && action !== 'snooze') return { valid: false, error: 'Choose a valid attention action.' };
  if (action === 'complete') return { valid: true, value: { id, action, snoozeUntil: null } };

  const rawUntil = typeof value.snoozeUntil === 'string' ? value.snoozeUntil.trim() : '';
  const until = new Date(rawUntil);
  if (!rawUntil || Number.isNaN(until.getTime()) || !/(?:Z|[+-]\d{2}:\d{2})$/.test(rawUntil)) {
    return { valid: false, error: 'Choose a valid snooze time.' };
  }
  const duration = until.getTime() - now.getTime();
  if (duration <= 0 || duration > MAX_SNOOZE_MS) {
    return { valid: false, error: 'Snooze must be within the next 30 days.' };
  }

  return { valid: true, value: { id, action, snoozeUntil: until.toISOString() } };
}

export function parseAutomationRetry(input: unknown): ParseResult<{ id: string }> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, error: 'Automation event is missing.' };
  }
  const value = input as Record<string, unknown>;
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  if (!UUID_PATTERN.test(id)) return { valid: false, error: 'Invalid automation event.' };
  return { valid: true, value: { id } };
}
const PROVIDER_EVENT_STATES: Record<string, CommunicationState> = {
  'email.sent': 'sent',
  'email.delivered': 'delivered',
  'email.opened': 'opened',
  'email.clicked': 'clicked',
  'email.bounced': 'bounced',
  'email.complained': 'complained',
  'email.failed': 'failed',
};

export function normalizeProviderEventType(value: unknown): CommunicationState | null {
  return typeof value === 'string' ? PROVIDER_EVENT_STATES[value] ?? null : null;
}

export function calculateCommunicationHealth(communications: Communication[]) {
  const eligible = communications.filter(
    (item) => item.channel === 'email' && item.direction === 'outbound' && item.state !== 'draft' && item.state !== 'queued',
  );
  const delivered = eligible.filter((item) => ['delivered', 'opened', 'clicked', 'replied'].includes(item.state)).length;
  const engaged = eligible.filter((item) => ['opened', 'clicked', 'replied'].includes(item.state)).length;
  const failed = eligible.filter((item) => ['bounced', 'complained', 'failed'].includes(item.state)).length;

  return {
    sent: eligible.length,
    delivered,
    engaged,
    failed,
    deliveryRate: eligible.length ? Math.round((delivered / eligible.length) * 100) : 0,
    engagementRate: delivered ? Math.round((engaged / delivered) * 100) : 0,
  };
}

const ATTENTION_PRIORITY_RANK: Record<AttentionPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

function moroccoDateKey(date: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Africa/Casablanca',
  }).format(date);
}

export function groupAttentionItems(items: AttentionItem[], now = new Date()) {
  const visible = items
    .filter((item) => {
      if (item.status === 'completed') return false;
      if (item.status !== 'snoozed' || !item.snoozed_until) return true;
      return new Date(item.snoozed_until).getTime() <= now.getTime();
    })
    .sort((left, right) => {
      const priority = ATTENTION_PRIORITY_RANK[left.priority] - ATTENTION_PRIORITY_RANK[right.priority];
      if (priority !== 0) return priority;
      const leftDue = left.due_at ? new Date(left.due_at).getTime() : Number.POSITIVE_INFINITY;
      const rightDue = right.due_at ? new Date(right.due_at).getTime() : Number.POSITIVE_INFINITY;
      return leftDue - rightDue || left.created_at.localeCompare(right.created_at);
    });

  const groups = {
    overdue: [] as AttentionItem[],
    today: [] as AttentionItem[],
    upcoming: [] as AttentionItem[],
  };
  const todayKey = moroccoDateKey(now);

  for (const item of visible) {
    if (!item.due_at) {
      groups.today.push(item);
      continue;
    }
    const due = new Date(item.due_at);
    if (due.getTime() < now.getTime()) groups.overdue.push(item);
    else if (moroccoDateKey(due) === todayKey) groups.today.push(item);
    else groups.upcoming.push(item);
  }

  return groups;
}
function rate(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

export function calculateFunnelMetrics(
  leads: CrmLead[],
  projects: CrmProject[],
  finances: FinanceTransaction[],
) {
  const responded = leads.filter((lead) => Boolean(lead.last_contacted_at));
  const respondedWithinSla = responded.filter((lead) => {
    const created = new Date(lead.created_at).getTime();
    const contacted = new Date(lead.last_contacted_at as string).getTime();
    return Number.isFinite(created) && Number.isFinite(contacted) && contacted >= created && contacted - created <= 60 * 60 * 1000;
  });
  const qualified = leads.filter((lead) => ['discovery', 'proposal_sent', 'negotiation', 'won'].includes(lead.status));
  const proposals = leads.filter((lead) => ['proposal_sent', 'negotiation', 'won'].includes(lead.status));
  const wins = leads.filter((lead) => lead.status === 'won');
  const losses = leads.filter((lead) => lead.status === 'lost');
  const pipeline = leads.filter((lead) => !['won', 'lost'].includes(lead.status));
  const projectLead = new Map(projects.map((project) => [project.id, project.originating_lead_id]));
  const leadSource = new Map(leads.map((lead) => [lead.id, lead.source || 'unknown']));
  const revenue = new Map<string, number>();

  for (const transaction of finances) {
    if (transaction.type !== 'income' || transaction.status !== 'paid' || !transaction.project_id) continue;
    const source = leadSource.get(projectLead.get(transaction.project_id) ?? '') ?? 'unknown';
    revenue.set(source, (revenue.get(source) ?? 0) + Number(transaction.amount));
  }

  const wonValues = wins.map((lead) => Number(lead.estimated_value ?? 0)).filter((value) => value > 0);

  return {
    totalLeads: leads.length,
    respondedLeads: responded.length,
    responseSlaRate: rate(respondedWithinSla.length, responded.length),
    qualifiedLeads: qualified.length,
    qualificationRate: rate(qualified.length, leads.length),
    proposals: proposals.length,
    proposalRate: rate(proposals.length, leads.length),
    wins: wins.length,
    losses: losses.length,
    winRate: rate(wins.length, leads.length),
    pipelineValue: pipeline.reduce((sum, lead) => sum + Number(lead.estimated_value ?? 0), 0),
    averageWonValue: wonValues.length
      ? Math.round(wonValues.reduce((sum, value) => sum + value, 0) / wonValues.length)
      : 0,
    revenueBySource: [...revenue.entries()]
      .map(([source, value]) => ({ source, revenue: Math.round(value * 100) / 100 }))
      .sort((left, right) => right.revenue - left.revenue || left.source.localeCompare(right.source)),
  };
}