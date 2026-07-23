import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const migrationUrl = new URL(
  '../../supabase/migrations/20260723233000_project_lifecycle_controls.sql',
  import.meta.url,
);

test('adds archive metadata and secure reversible project lifecycle RPCs', () => {
  assert.equal(existsSync(migrationUrl), true, 'project lifecycle migration must exist');
  const migration = existsSync(migrationUrl) ? readFileSync(migrationUrl, 'utf8') : '';

  assert.match(migration, /add column if not exists deleted_at timestamptz/i);
  assert.match(migration, /add column if not exists deleted_by text/i);

  for (const rpc of ['crm_reopen_project', 'crm_archive_project']) {
    assert.match(migration, new RegExp(`create or replace function public\\.${rpc}`, 'i'));
    assert.match(migration, new RegExp(`${rpc}[\\s\\S]*security definer`, 'i'));
    assert.match(migration, new RegExp(`grant execute on function public\\.${rpc}`, 'i'));
  }

  assert.match(migration, /if not public\.is_team_member\(\)/i);
  assert.match(migration, /for update/i);
  assert.match(migration, /project changed in another session/i);
});

test('reopening a project reverses only automatic close revenue and invoice payment', () => {
  const migration = existsSync(migrationUrl) ? readFileSync(migrationUrl, 'utf8') : '';
  const reopen = migration.slice(
    migration.indexOf('create or replace function public.crm_reopen_project'),
    migration.indexOf('create or replace function public.crm_archive_project'),
  );

  assert.match(reopen, /v_project\.status <> 'launched'/i);
  assert.match(
    reopen,
    /update public\.invoices[\s\S]*status = 'issued'[\s\S]*finance_transaction_id = null[\s\S]*paid_on = null/i,
  );
  assert.match(
    reopen,
    /delete from public\.finance_transactions[\s\S]*project_id = p_project_id[\s\S]*source = 'project_close'/i,
  );
  assert.match(reopen, /update public\.crm_projects[\s\S]*status = 'review'/i);
  assert.match(reopen, /insert into public\.lead_events/i);
});

test('archiving a project removes close revenue but preserves audit records', () => {
  const migration = existsSync(migrationUrl) ? readFileSync(migrationUrl, 'utf8') : '';
  const archive = migration.slice(
    migration.indexOf('create or replace function public.crm_archive_project'),
    migration.indexOf('revoke all on function public.crm_reopen_project'),
  );

  assert.match(
    archive,
    /update public\.invoices[\s\S]*status = 'void'[\s\S]*finance_transaction_id = null[\s\S]*paid_on = null/i,
  );
  assert.match(
    archive,
    /delete from public\.finance_transactions[\s\S]*project_id = p_project_id[\s\S]*source = 'project_close'/i,
  );
  assert.match(archive, /update public\.project_work_items[\s\S]*status = 'skipped'/i);
  assert.match(archive, /update public\.crm_projects[\s\S]*deleted_at = now\(\)[\s\S]*deleted_by = v_actor/i);
  assert.doesNotMatch(archive, /delete from public\.crm_projects/i);
  assert.match(archive, /insert into public\.lead_events/i);
});