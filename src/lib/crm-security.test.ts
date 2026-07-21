import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migration = readFileSync(
  new URL('../../supabase/migrations/20260721_crm_security.sql', import.meta.url),
  'utf8',
);

test('routes CRM writes through validated security-definer functions', () => {
  assert.match(migration, /create or replace function public\.crm_update_lead/i);
  assert.match(migration, /create or replace function public\.crm_add_lead_note/i);
  assert.match(migration, /security definer/i);
  assert.match(migration, /revoke update on table public\.leads from authenticated/i);
  assert.match(migration, /revoke insert on table public\.lead_events from authenticated/i);
  assert.match(migration, /grant execute on function public\.crm_update_lead/i);
});

test('requires an OAuth-authenticated team member and validates assignments', () => {
  assert.match(migration, /item\s*->>\s*'method'\s*=\s*'oauth'/i);
  assert.match(migration, /from public\.team_members[\s\S]*lower\(tm\.email\) = lower\(p_assigned_to\)/i);
});

test('provisions both CRM streams in the realtime publication', () => {
  assert.match(migration, /add table public\.leads/i);
  assert.match(migration, /add table public\.lead_events/i);
});