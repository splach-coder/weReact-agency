import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parseAutomationRetry } from './automation';

const UUID = '11111111-1111-4111-8111-111111111111';

test('validates automation retry ids before server mutation', () => {
  assert.deepEqual(parseAutomationRetry({ id: UUID }), {
    valid: true,
    value: { id: UUID },
  });
  assert.equal(parseAutomationRetry({ id: 'not-an-id' }).valid, false);
  assert.equal(parseAutomationRetry(null).valid, false);
});

test('automation workspace is protected and never renders deployment secrets', () => {
  const page = readFileSync(
    new URL('../app/admin/automation/page.tsx', import.meta.url),
    'utf8',
  );
  const workspace = readFileSync(
    new URL('../app/admin/automation/AutomationWorkspace.tsx', import.meta.url),
    'utf8',
  );

  assert.match(page, /requireAdminMember\(\)/);
  assert.match(page, /from\('integration_health'\)/);
  assert.match(page, /from\('automation_events'\)/);
  assert.match(page, /from\('communications'\)/);
  assert.doesNotMatch(page, /process\.env|SERVICE_ROLE|API_KEY|SECRET/);
  assert.doesNotMatch(workspace, /last_error|payload/);
  assert.match(workspace, /Not active yet/);
  assert.match(workspace, /Retry/);
});

test('automation retries use the validated team RPC and appear in navigation', () => {
  const actions = readFileSync(
    new URL('../app/admin/attention-actions.ts', import.meta.url),
    'utf8',
  );
  const shell = readFileSync(new URL('../app/admin/AdminShell.tsx', import.meta.url), 'utf8');

  assert.match(actions, /parseAutomationRetry/);
  assert.match(actions, /retryAutomationEventAction/);
  assert.match(actions, /crm_retry_automation_event/);
  assert.match(actions, /requireAdminMember/);
  assert.match(shell, /href: '\/admin\/automation'/);
  assert.match(shell, /label: 'Automation'/);
});

test('automation workspace is dense on desktop and readable on phone', () => {
  const css = readFileSync(new URL('../app/admin/operations.css', import.meta.url), 'utf8');

  assert.match(css, /\.ops-automation-grid/);
  assert.match(css, /\.ops-integration-row/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.ops-automation-grid/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.ops-automation-event/);
});
