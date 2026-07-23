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

test('stores secure immutable numbered invoices and links project-close finance revenue', () => {
  const migrationUrl = new URL('../../supabase/migrations/20260723120000_project_workspace_invoices.sql', import.meta.url);
  assert.equal(existsSync(migrationUrl), true, 'workspace and invoice migration must exist');
  const migration = existsSync(migrationUrl) ? readFileSync(migrationUrl, 'utf8') : '';

  assert.match(migration, /create table if not exists public\.invoices/i);
  assert.match(migration, /check \(status in \('draft', 'issued', 'paid', 'void'\)\)/i);
  assert.match(migration, /currency text not null default 'MAD' check \(currency = 'MAD'\)/i);
  assert.match(migration, /create table if not exists public\.invoice_lines/i);
  assert.match(migration, /create table if not exists public\.invoice_sequences/i);
  assert.match(migration, /alter table public\.invoices enable row level security/i);
  assert.match(migration, /alter table public\.invoice_lines enable row level security/i);
  assert.match(migration, /revoke all on table public\.invoices from anon, authenticated/i);
  assert.match(migration, /revoke all on table public\.invoice_lines from anon, authenticated/i);
  for (const rpc of ['crm_create_invoice_draft', 'crm_update_invoice_draft', 'crm_issue_invoice', 'crm_void_invoice']) {
    assert.match(migration, new RegExp(`create or replace function public\\.${rpc}`, 'i'));
    assert.match(migration, new RegExp(`${rpc}[\\s\\S]*security definer`, 'i'));
    assert.match(migration, new RegExp(`grant execute on function public\\.${rpc}`, 'i'));
  }
  assert.match(migration, /insert into public\.invoice_sequences[\s\S]*on conflict \(year\) do update[\s\S]*returning last_number/i);
  assert.match(migration, /'WR-' \|\| v_year::text \|\| '-' \|\| lpad\(v_sequence::text, 4, '0'\)/i);
  assert.match(migration, /seller_snapshot/i);
  assert.match(migration, /customer_snapshot/i);
  assert.match(migration, /jsonb_build_object\('name', 'WeReact agency'/i);
  assert.equal(migration.includes("!~ '^\\d+(\\.\\d{1,2})?$'"), true, 'invoice line decimals use PostgreSQL digit regexes');
  const immutableFunction = migration.slice(
    migration.indexOf('create or replace function public.invoices_prevent_immutable_changes'),
    migration.indexOf('drop trigger if exists invoices_prevent_immutable_changes'),
  );
  assert.match(migration, /create or replace function public\.invoices_prevent_immutable_changes/i);
  assert.match(migration, /old\.status in \('issued', 'paid', 'void'\)/i);
  assert.match(immutableFunction, /if tg_op = 'DELETE' then[\s\S]*issued invoices are immutable/i);
  assert.match(migration, /issued invoices are immutable/i);
  assert.match(migration, /create or replace function public\.invoice_lines_require_draft/i);
  assert.match(migration, /create or replace function public\.crm_record_project_close_revenue/i);
  assert.match(migration, /update public\.invoices[\s\S]*finance_transaction_id = v_finance_transaction_id[\s\S]*status = 'paid'/i);
  assert.match(migration, /from public\.finance_transactions[\s\S]*source = 'project_close'/i);
  assert.match(migration, /status = case when v_finance_transaction_id is not null then 'paid' else 'issued' end/i);
});
