import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import {
  AutomationDispatchError,
  authenticateAutomationRequest,
  decideAutomationFailure,
  dispatchAutomationEvent,
  parseAutomationBatchSize,
} from './automation-processor';
import type { AutomationEvent } from './automation';

function event(overrides: Partial<AutomationEvent> = {}): AutomationEvent {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    event_type: 'attention.refresh',
    aggregate_type: 'system',
    aggregate_id: null,
    idempotency_key: 'attention:refresh:2026-07-23',
    payload: {},
    status: 'processing',
    attempts: 1,
    max_attempts: 5,
    next_attempt_at: '2026-07-23T12:00:00.000Z',
    locked_at: '2026-07-23T12:00:00.000Z',
    completed_at: null,
    last_error: null,
    created_at: '2026-07-23T12:00:00.000Z',
    updated_at: '2026-07-23T12:00:00.000Z',
    ...overrides,
  };
}

test('authenticates the internal endpoint with an exact bearer secret', () => {
  assert.equal(authenticateAutomationRequest('Bearer internal-secret', 'internal-secret'), true);
  assert.equal(authenticateAutomationRequest('Bearer wrong', 'internal-secret'), false);
  assert.equal(authenticateAutomationRequest(null, 'internal-secret'), false);
  assert.equal(authenticateAutomationRequest('internal-secret', 'internal-secret'), false);
});

test('accepts only bounded automation batch sizes', () => {
  assert.deepEqual(parseAutomationBatchSize(undefined), { valid: true, value: 10 });
  assert.deepEqual(parseAutomationBatchSize(25), { valid: true, value: 25 });
  assert.equal(parseAutomationBatchSize(0).valid, false);
  assert.equal(parseAutomationBatchSize(26).valid, false);
  assert.equal(parseAutomationBatchSize('10').valid, false);
});

test('dispatches known idempotent events and permanently rejects unknown ones', async () => {
  let refreshes = 0;
  await dispatchAutomationEvent(event(), {
    refreshAttention: async () => { refreshes += 1; },
  });
  assert.equal(refreshes, 1);

  await assert.rejects(
    dispatchAutomationEvent(event({ event_type: 'unknown.action' }), {
      refreshAttention: async () => undefined,
    }),
    (error) => error instanceof AutomationDispatchError && error.permanent,
  );
});

test('retries transient failures with backoff and dead-letters exhausted work', () => {
  const now = new Date('2026-07-23T12:00:00.000Z');
  assert.deepEqual(decideAutomationFailure({
    attempts: 1,
    maxAttempts: 5,
    permanent: false,
  }, now), {
    status: 'retry',
    nextAttemptAt: '2026-07-23T12:01:00.000Z',
  });
  assert.deepEqual(decideAutomationFailure({
    attempts: 5,
    maxAttempts: 5,
    permanent: false,
  }, now), {
    status: 'failed',
    nextAttemptAt: null,
  });
  assert.equal(decideAutomationFailure({
    attempts: 1,
    maxAttempts: 5,
    permanent: true,
  }, now).status, 'failed');
});

test('internal route and database claim are private, bounded, and replay-safe', () => {
  const route = readFileSync(
    new URL('../app/api/internal/automation/route.ts', import.meta.url),
    'utf8',
  );
  const migrationUrl = new URL(
    '../../supabase/migrations/20260723203000_automation_processor.sql',
    import.meta.url,
  );
  assert.equal(existsSync(migrationUrl), true);
  const migration = readFileSync(migrationUrl, 'utf8');

  assert.match(route, /AUTOMATION_INTERNAL_SECRET/);
  assert.match(route, /headers\.get\('authorization'\)/);
  assert.match(route, /processAutomationBatch/);
  assert.doesNotMatch(route, /searchParams[\s\S]*(?:secret|token)/i);
  assert.match(migration, /automation_claim_events/i);
  assert.match(migration, /for update skip locked/i);
  assert.match(migration, /least\(greatest\(p_limit, 1\), 25\)/i);
  assert.match(migration, /revoke all on function public\.automation_claim_events\(integer\) from public, anon, authenticated/i);
  assert.match(migration, /grant execute on function public\.automation_claim_events\(integer\) to service_role/i);
});
test('service automation uses the current Supabase JWT role claim', () => {
  const migrationUrl = new URL(
    '../../supabase/migrations/20260723221000_fix_automation_service_role.sql',
    import.meta.url,
  );
  assert.equal(existsSync(migrationUrl), true);
  const migration = readFileSync(migrationUrl, 'utf8');

  assert.match(migration, /auth\.jwt\(\)\s*->>\s*'role'/i);
  assert.doesNotMatch(migration, /request\.jwt\.claim\.role/i);
  assert.match(migration, /grant execute on function public\.automation_claim_events\(integer\) to service_role/i);
});