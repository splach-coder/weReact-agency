import {
  normalizeProviderEventType,
  type CommunicationState,
} from './automation';

type ParseResult<T> = { valid: true; value: T } | { valid: false; error: string };

export type ResendWebhookHeaders = {
  id: string;
  timestamp: string;
  signature: string;
};

export type NormalizedResendEvent = {
  provider: 'resend';
  providerEventId: string;
  eventType: string;
  state: CommunicationState;
  occurredAt: string;
  messageId: string;
  from: string;
  to: string;
  subject: string;
  payload: Record<string, unknown>;
};

const POSITIVE_STATE_RANK: Partial<Record<CommunicationState, number>> = {
  draft: 0,
  queued: 1,
  sent: 2,
  delivered: 3,
  opened: 4,
  clicked: 5,
  replied: 6,
};

const FAILURE_STATES = new Set<CommunicationState>(['bounced', 'complained', 'failed']);

export function getResendWebhookHeaders(headers: Headers): ParseResult<ResendWebhookHeaders> {
  const id = headers.get('svix-id')?.trim() ?? '';
  const timestamp = headers.get('svix-timestamp')?.trim() ?? '';
  const signature = headers.get('svix-signature')?.trim() ?? '';

  if (!id || !timestamp || !signature) {
    return { valid: false, error: 'Missing webhook signature headers.' };
  }

  return { valid: true, value: { id, timestamp, signature } };
}

export function parseResendWebhook(
  payload: unknown,
  providerEventId: string,
): ParseResult<NormalizedResendEvent | null> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, error: 'Malformed Resend webhook event.' };
  }

  const event = payload as Record<string, unknown>;
  const eventType = typeof event.type === 'string' ? event.type.trim() : '';
  const state = normalizeProviderEventType(eventType);

  // Resend also sends domain, contact, and broadcast events. They are valid,
  // but not communication delivery events, so acknowledge them without writes.
  if (!state) return { valid: true, value: null };

  const createdAt = typeof event.created_at === 'string' ? event.created_at.trim() : '';
  const occurredAt = new Date(createdAt);
  const data = event.data;

  if (
    !providerEventId.trim()
    || !createdAt
    || Number.isNaN(occurredAt.getTime())
    || !data
    || typeof data !== 'object'
    || Array.isArray(data)
  ) {
    return { valid: false, error: 'Malformed Resend webhook event.' };
  }

  const details = data as Record<string, unknown>;
  const messageId = typeof details.email_id === 'string' ? details.email_id.trim() : '';
  if (!messageId) return { valid: false, error: 'Malformed Resend webhook event.' };

  const recipients = Array.isArray(details.to)
    ? details.to.filter((value): value is string => typeof value === 'string')
    : typeof details.to === 'string'
      ? [details.to]
      : [];

  return {
    valid: true,
    value: {
      provider: 'resend',
      providerEventId: providerEventId.trim(),
      eventType,
      state,
      occurredAt: occurredAt.toISOString(),
      messageId,
      from: typeof details.from === 'string' ? details.from : '',
      to: recipients.join(', '),
      subject: typeof details.subject === 'string' ? details.subject : '',
      payload: event,
    },
  };
}

export function shouldAdvanceCommunicationState(
  current: CommunicationState,
  next: CommunicationState,
) {
  const currentIsFailure = FAILURE_STATES.has(current);
  const nextIsFailure = FAILURE_STATES.has(next);

  if (current === next || currentIsFailure) return false;
  if (nextIsFailure) return true;

  return (POSITIVE_STATE_RANK[next] ?? -1) > (POSITIVE_STATE_RANK[current] ?? -1);
}
