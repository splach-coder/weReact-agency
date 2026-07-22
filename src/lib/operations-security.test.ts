import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
