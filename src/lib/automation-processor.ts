import { timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import type { AutomationEvent } from './automation';

type ParseResult<T> = { valid: true; value: T } | { valid: false; error: string };

export class AutomationDispatchError extends Error {
  permanent: boolean;

  constructor(message: string, permanent = false) {
    super(message);
    this.name = 'AutomationDispatchError';
    this.permanent = permanent;
  }
}

export function authenticateAutomationRequest(
  authorization: string | null,
  secret: string,
) {
  if (!authorization?.startsWith('Bearer ') || !secret) return false;
  const supplied = Buffer.from(authorization.slice(7), 'utf8');
  const expected = Buffer.from(secret, 'utf8');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function parseAutomationBatchSize(value: unknown): ParseResult<number> {
  if (value === undefined) return { valid: true, value: 10 };
  if (!Number.isInteger(value) || (value as number) < 1 || (value as number) > 25) {
    return { valid: false, error: 'Batch size must be an integer from 1 to 25.' };
  }
  return { valid: true, value: value as number };
}

export async function dispatchAutomationEvent(
  event: AutomationEvent,
  handlers: { refreshAttention: () => Promise<void> },
) {
  switch (event.event_type) {
    case 'attention.refresh':
      await handlers.refreshAttention();
      return;
    default:
      throw new AutomationDispatchError('Unsupported automation event type.', true);
  }
}

export function decideAutomationFailure(
  input: { attempts: number; maxAttempts: number; permanent: boolean },
  now = new Date(),
) {
  if (input.permanent || input.attempts >= input.maxAttempts) {
    return { status: 'failed' as const, nextAttemptAt: null };
  }
  const delayMs = Math.min(60 * 60 * 1000, 60_000 * 2 ** Math.max(0, input.attempts - 1));
  return {
    status: 'retry' as const,
    nextAttemptAt: new Date(now.getTime() + delayMs).toISOString(),
  };
}

function serviceClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Automation storage is not configured.');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function processAutomationBatch(batchSize: number) {
  const parsedBatch = parseAutomationBatchSize(batchSize);
  if (!parsedBatch.valid) throw new Error(parsedBatch.error);
  const supabase = serviceClient();

  const refreshAttention = async () => {
    const { error } = await supabase.rpc('crm_refresh_attention_items');
    if (error) throw new AutomationDispatchError('Attention refresh failed.');
  };

  // Refresh deterministic work on every recovery run, even when the outbox is empty.
  try {
    await refreshAttention();
  } catch (error) {
    console.error('Scheduled attention refresh failed.', error instanceof Error ? error.message : 'Unknown error');
  }

  const { data, error: claimError } = await supabase.rpc('automation_claim_events', {
    p_limit: parsedBatch.value,
  });
  if (claimError) throw new Error(`Could not claim automation events: ${claimError.message}`);

  const events = (data ?? []) as AutomationEvent[];
  const result = { claimed: events.length, completed: 0, retried: 0, failed: 0 };

  for (const event of events) {
    try {
      await dispatchAutomationEvent(event, { refreshAttention });
      const { error } = await supabase.from('automation_events').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        locked_at: null,
        last_error: null,
      }).eq('id', event.id).eq('status', 'processing');
      if (error) throw new AutomationDispatchError('Could not complete automation event.');
      result.completed += 1;
    } catch (error) {
      const permanent = error instanceof AutomationDispatchError && error.permanent;
      const decision = decideAutomationFailure({
        attempts: event.attempts,
        maxAttempts: event.max_attempts,
        permanent,
      });
      const { error: updateError } = await supabase.from('automation_events').update({
        status: decision.status,
        next_attempt_at: decision.nextAttemptAt ?? event.next_attempt_at,
        locked_at: null,
        completed_at: null,
        last_error: permanent ? 'Unsupported automation event type.' : 'Automation handler failed.',
      }).eq('id', event.id).eq('status', 'processing');
      if (updateError) console.error('Automation failure state could not be saved.', updateError.message);
      if (decision.status === 'retry') result.retried += 1;
      else result.failed += 1;
    }
  }

  const now = new Date().toISOString();
  await supabase.from('integration_health').upsert({
    provider: 'automation',
    status: result.failed ? 'degraded' : 'healthy',
    message: result.failed
      ? `${result.failed} automation event${result.failed === 1 ? '' : 's'} need attention.`
      : `Recovery completed: ${result.completed} completed, ${result.retried} retrying.`,
    last_checked_at: now,
    ...(result.failed ? { last_failure_at: now } : { last_success_at: now }),
  }, { onConflict: 'provider' });

  return result;
}
