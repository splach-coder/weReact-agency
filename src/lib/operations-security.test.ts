import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('secures agency finance and newsletter operations', () => {
  const migration = readFileSync(
    new URL('../../supabase/migrations/20260722130000_agency_operations.sql', import.meta.url),
    'utf8',
  );
  assert.match(migration, /create table if not exists public\.finance_transactions/i);
  assert.match(migration, /create table if not exists public\.newsletter_campaigns/i);
  assert.match(migration, /unsubscribe_token uuid/i);
  assert.match(migration, /alter table public\.finance_transactions enable row level security/i);
  assert.match(migration, /public\.is_team_member\(\)/i);
  assert.match(migration, /revoke all on table public\.finance_transactions from anon/i);
});
test('atomically records one paid revenue entry when a project closes', () => {
  const migrationUrl = new URL('../../supabase/migrations/20260722213000_project_close_finance.sql', import.meta.url);
  assert.equal(existsSync(migrationUrl), true, 'project-close finance migration must exist');
  const migration = existsSync(migrationUrl) ? readFileSync(migrationUrl, 'utf8') : '';

  assert.match(migration, /add column if not exists source text/i);
  assert.match(migration, /where source = 'project_close'/i);
  assert.match(migration, /new\.status = 'launched'/i);
  assert.match(migration, /confirmed project amount is required/i);
  assert.match(migration, /insert into public\.finance_transactions/i);
  assert.match(migration, /on conflict \(project_id\) where source = 'project_close'/i);
  assert.match(migration, /from public\.crm_projects/i);
  assert.match(migration, /after insert or update of status, budget/i);
});
