import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const migration = [
  '20260721090000_crm_security.sql',
  '20260721090100_crm_security_v2.sql',
  '20260721090200_crm_security_v3.sql',
  '20260721090300_crm_project_handoff.sql',
  '20260721210000_crm_professional_workspace.sql',
  '20260721210100_newsletter_subscribers.sql',
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

test('rejects non-team Google sessions before serving the CRM', () => {
  const middleware = readFileSync(
    new URL('./supabase/middleware.ts', import.meta.url),
    'utf8',
  );
  const callback = readFileSync(
    new URL('../app/admin/auth/callback/route.ts', import.meta.url),
    'utf8',
  );
  const pageGuard = readFileSync(
    new URL('./admin-auth.ts', import.meta.url),
    'utf8',
  );

  assert.match(middleware, /rpc\(['"]is_team_member['"]\)/i);
  assert.match(middleware, /auth\.signOut\(\)/i);
  assert.match(callback, /rpc\(['"]is_team_member['"]\)/i);
  assert.match(callback, /auth\.signOut\(\)/i);
  assert.match(pageGuard, /rpc\(['"]is_team_member['"]\)/i);
});

test('explains an access-denied login without exposing the allowlist', () => {
  const loginPage = readFileSync(
    new URL('../app/admin/login/page.tsx', import.meta.url),
    'utf8',
  );
  const loginClient = readFileSync(
    new URL('../app/admin/login/AdminLoginClient.tsx', import.meta.url),
    'utf8',
  );
  const login = `${loginPage}\n${loginClient}`;

  assert.match(loginPage, /searchParams/i);
  assert.match(login, /reason\s*===\s*['"]access['"]/i);
  assert.match(login, /role=['"]alert['"]/i);
  assert.match(login, /Access denied/i);
  assert.match(login, /not approved for the WeReact workspace/i);
  assert.doesNotMatch(login, /anasbenbow123|70karim\.hida/i);
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
  assert.match(migration, /create or replace function public\.crm_update_sales/i);
  assert.match(migration, /drop function if exists public\.crm_update_lead/i);
  assert.match(migration, /Project changed in another session/i);
  assert.match(migration, /regexp_replace[\s\S]*lower\(trim\(coalesce\(p_brief ->> 'domain_name'/i);
});
test('stores newsletter subscribers behind row-level security', () => {
  assert.match(migration, /create table if not exists public\.newsletter_subscribers/i);
  assert.match(migration, /alter table public\.newsletter_subscribers enable row level security/i);
  assert.match(migration, /revoke all on table public\.newsletter_subscribers from anon, authenticated/i);
});

test('secures manual lead creation and supports phone-only client identity', () => {
  const manualMigration = readFileSync(
    new URL('../../supabase/migrations/20260722090000_crm_manual_leads.sql', import.meta.url),
    'utf8',
  );
  assert.match(manualMigration, /add column if not exists client_id uuid/i);
  assert.match(manualMigration, /alter column email drop not null/i);
  assert.match(manualMigration, /create or replace function public\.crm_create_manual_lead/i);
  assert.match(manualMigration, /if not public\.is_team_member\(\)/i);
  assert.match(manualMigration, /assigned_to[\s\S]*70karim\.hida@gmail\.com/i);
  assert.match(manualMigration, /grant execute on function public\.crm_create_manual_lead\(jsonb\) to authenticated/i);
  assert.doesNotMatch(manualMigration, /grant execute[\s\S]*crm_create_manual_lead[\s\S]*to anon/i);
});

test('secures project work items, default launch checks, and realtime publication', () => {
  const migrationUrl = new URL('../../supabase/migrations/20260723120000_project_workspace_invoices.sql', import.meta.url);
  assert.equal(existsSync(migrationUrl), true, 'workspace and invoice migration must exist');
  const workspaceMigration = existsSync(migrationUrl) ? readFileSync(migrationUrl, 'utf8') : '';

  assert.match(workspaceMigration, /add column if not exists assigned_developer_email text references public\.team_members\(email\)/i);
  assert.match(workspaceMigration, /create table if not exists public\.project_work_items/i);
  assert.match(workspaceMigration, /check \(kind in \('milestone', 'task', 'delivery_check'\)\)/i);
  assert.match(workspaceMigration, /check \(status in \('todo', 'in_progress', 'blocked', 'done', 'skipped'\)\)/i);
  assert.match(workspaceMigration, /check \(priority in \('low', 'normal', 'high', 'urgent'\)\)/i);
  assert.match(workspaceMigration, /alter table public\.project_work_items enable row level security/i);
  assert.match(workspaceMigration, /for select to authenticated using \(public\.is_team_member\(\)\)/i);
  assert.match(workspaceMigration, /revoke all on table public\.project_work_items from anon, authenticated/i);
  assert.match(workspaceMigration, /create or replace function public\.crm_save_project_work_item/i);
  assert.match(workspaceMigration, /create or replace function public\.crm_delete_project_work_item/i);
  assert.match(workspaceMigration, /crm_save_project_work_item[\s\S]*security definer/i);
  assert.match(workspaceMigration, /grant execute on function public\.crm_save_project_work_item/i);
  assert.match(workspaceMigration, /grant execute on function public\.crm_delete_project_work_item/i);

  for (const title of ['Client approved the final website', 'Responsive layouts checked', 'Forms and conversion actions tested', 'Domain connected', 'Production hosting verified', 'Analytics and conversion tracking verified', 'SEO titles, descriptions, sitemap, and robots checked', 'Final backup and handover completed']) {
    assert.match(workspaceMigration, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
  assert.match(workspaceMigration, /create or replace function public\.crm_seed_project_launch_checks/i);
  assert.match(workspaceMigration, /after insert on public\.crm_projects/i);
  assert.match(workspaceMigration, /where project\.status <> 'launched'/i);
  assert.match(workspaceMigration, /create or replace function public\.crm_block_incomplete_launch/i);
  assert.match(workspaceMigration, /new\.status = 'launched'[\s\S]*old\.status is distinct from 'launched'/i);
  assert.match(workspaceMigration, /kind = 'delivery_check'[\s\S]*required = true/i);
  assert.match(workspaceMigration, /status not in \('done', 'skipped'\)/i);
  assert.match(workspaceMigration, /count\(\*\) filter \(where item\.status in \('done', 'skipped'\)\)/i);
  assert.match(workspaceMigration, /required launch checks are incomplete/i);
  assert.match(workspaceMigration, /pg_publication_tables/i);
  assert.match(workspaceMigration, /add table public\.project_work_items/i);
  assert.match(workspaceMigration, /add table public\.invoices/i);
  assert.match(workspaceMigration, /add table public\.invoice_lines/i);
});

test('guards every transition into launched and secures developer assignment', () => {
  const workspaceMigration = readFileSync(
    new URL('../../supabase/migrations/20260723120000_project_workspace_invoices.sql', import.meta.url),
    'utf8',
  );
  const launchGuard = workspaceMigration.slice(
    workspaceMigration.indexOf('create or replace function public.crm_block_incomplete_launch'),
    workspaceMigration.indexOf('drop trigger if exists crm_block_incomplete_launch'),
  );

  assert.match(
    launchGuard,
    /new\.status = 'launched'[\s\S]*tg_op = 'INSERT'[\s\S]*old\.status is distinct from 'launched'/i,
  );
  assert.match(
    workspaceMigration,
    /create trigger crm_block_incomplete_launch[\s\S]*before insert or update of status on public\.crm_projects/i,
  );
  assert.match(workspaceMigration, /v_check_count < 8/i);
  assert.match(workspaceMigration, /Default launch checks cannot be renamed, retyped, made optional, or reordered/i);
  assert.match(workspaceMigration, /Default launch checks cannot be deleted/i);

  const assignmentFunction = workspaceMigration.slice(
    workspaceMigration.indexOf('create or replace function public.crm_assign_project_developer'),
    workspaceMigration.indexOf('revoke all on function public.crm_assign_project_developer'),
  );
  assert.match(
    assignmentFunction,
    /crm_assign_project_developer\(\s*p_project_id uuid,\s*p_developer_email text\s*\)/i,
  );
  assert.match(assignmentFunction, /security definer[\s\S]*set search_path = ''/i);
  assert.match(assignmentFunction, /if not public\.is_team_member\(\)/i);
  assert.match(
    assignmentFunction,
    /from public\.team_members[\s\S]*lower\(email\) = lower\(trim\(p_developer_email\)\)/i,
  );
  assert.match(
    assignmentFunction,
    /nullif\(trim\(coalesce\(p_developer_email, ''\)\), ''\)/i,
  );
  assert.match(
    assignmentFunction,
    /update public\.crm_projects[\s\S]*assigned_developer_email = v_developer_email[\s\S]*where id = p_project_id/i,
  );
  assert.match(
    workspaceMigration,
    /revoke all on function public\.crm_assign_project_developer\(uuid, text\) from public, anon/i,
  );
  assert.match(
    workspaceMigration,
    /grant execute on function public\.crm_assign_project_developer\(uuid, text\) to authenticated/i,
  );
});

test('pins every workspace security-definer function to an empty search path', () => {
  const workspaceMigration = readFileSync(
    new URL('../../supabase/migrations/20260723120000_project_workspace_invoices.sql', import.meta.url),
    'utf8',
  );
  const functions = [
    ...workspaceMigration.matchAll(
      /create or replace function public\.(\w+)[\s\S]*?\n\$\$;/gi,
    ),
  ];
  const securityDefiners = functions.filter((match) => /security definer/i.test(match[0]));

  assert.ok(securityDefiners.length > 0, 'workspace migration must define security-definer functions');
  for (const definition of securityDefiners) {
    assert.match(
      definition[0],
      /security definer[\s\S]*set search_path = ''/i,
      `${definition[1]} must set an empty search path`,
    );
  }
});
