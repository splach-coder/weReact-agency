import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const migration = [
  '20260721_crm_security.sql',
  '20260721_crm_security_v2.sql',
  '20260721_crm_security_v3.sql',
  '20260721_crm_project_handoff.sql',
  '20260721_crm_professional_workspace.sql',
].map((file) => readFileSync(
  new URL(`../../supabase/migrations/${file}`, import.meta.url),
  'utf8',
)).join('\n');

test('routes CRM writes through validated security-definer functions', () => {
  assert.match(migration, /create or replace function public\.crm_update_lead|create function public\.crm_update_lead/i);
  assert.match(migration, /create or replace function public\.crm_add_lead_note/i);
  assert.match(migration, /security definer/i);
  assert.match(migration, /revoke update on table public\.leads from authenticated/i);
  assert.match(migration, /revoke insert on table public\.lead_events from authenticated/i);
  assert.match(migration, /grant execute on function public\.crm_update_lead/i);
});

test('requires Google OAuth and validates assignments against the team', () => {
  assert.match(migration, /item\s*->>\s*'method'\s*=\s*'oauth'/i);
  assert.match(migration, /app_metadata'[\s\S]*provider'[\s\S]*=\s*'google'/i);
  assert.match(migration, /from auth\.identities[\s\S]*provider = 'google'/i);
  assert.match(migration, /not exists[\s\S]*from auth\.identities[\s\S]*provider <> 'google'/i);
  assert.match(migration, /from public\.team_members[\s\S]*lower\(tm\.email\) = lower\(p_assigned_to\)/i);
});

test('rejects stale workflow writes before updating the row', () => {
  assert.match(migration, /p_expected_updated_at timestamptz/i);
  assert.match(
    migration,
    /date_trunc\('milliseconds', v_current_updated_at\)[\s\S]*<>[\s\S]*date_trunc\('milliseconds', p_expected_updated_at\)/i,
  );
  assert.match(migration, /errcode\s*=\s*'40001'/i);
});

test('provisions both CRM streams in the realtime publication', () => {
  assert.match(migration, /add table public\.leads/i);
  assert.match(migration, /add table public\.lead_events/i);
});
test('creates a multi-project client model with automatic Karim ownership', () => {
  assert.match(migration, /create table if not exists public\.clients/i);
  assert.match(migration, /create table if not exists public\.crm_projects/i);
  assert.match(migration, /originating_lead_id uuid/i);
  assert.match(migration, /default '70karim\.hida@gmail\.com'/i);
  assert.match(migration, /update public\.leads[\s\S]*assigned_to = '70karim\.hida@gmail\.com'/i);
  assert.match(migration, /create or replace function public\.crm_upsert_project/i);
  assert.match(migration, /if not public\.is_team_member\(\)/i);
  assert.match(migration, /add table public\.crm_projects/i);
});
test('separates sales stages from project delivery and secures drag moves', () => {
  assert.match(migration, /'proposal_sent'[\s\S]*'negotiation'/i);
  assert.match(migration, /'briefing'[\s\S]*'ready_for_dev'[\s\S]*'launched'/i);
  assert.match(migration, /add column if not exists domain_name text/i);
  assert.match(migration, /create or replace function public\.crm_move_lead/i);
  assert.match(migration, /p_expected_updated_at timestamptz/i);
  assert.match(migration, /grant execute on function public\.crm_move_lead/i);
});