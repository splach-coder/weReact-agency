# Project Close Finance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make closing a fully paid project create exactly one linked paid-income entry and surface that payment across the CRM and Finance.

**Architecture:** Supabase is the transaction boundary. A database trigger validates the confirmed budget and inserts the linked revenue row during the same transaction that moves a project to `launched`; a partial unique index makes retries idempotent. The application adds matching validation, explicit close-payment copy, and finance attribution while existing completed projects are backfilled by the migration.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase/PostgreSQL, Node test runner, Cloudflare OpenNext.

## Global Constraints

- `launched` means delivered and fully paid.
- A project cannot close without a positive confirmed budget.
- One automatic paid-income row may exist per project.
- Closing and revenue creation must be atomic.
- Reopening does not delete received revenue.
- Existing closed projects with positive budgets must be backfilled.

---

### Task 1: Enforce Paid Closure in the Domain Parser

**Files:**
- Modify: `src/lib/crm-actions.test.ts`
- Modify: `src/lib/crm-actions.ts`

**Interfaces:**
- Consumes: `parseProjectBrief(input: unknown)` and the existing `ProjectBriefInput` shape.
- Produces: a validation error when `status === 'launched'` and `budget` is missing, zero, negative, or non-numeric.

- [ ] **Step 1: Write the failing parser test**

Add a test that submits an otherwise valid launched project with an empty budget and expects:

```ts
assert.deepEqual(
  parseProjectBrief({ ...validProject, status: 'launched', budget: '' }),
  { valid: false, error: 'Add the confirmed project amount before closing it.' },
);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/lib/crm-actions.test.ts`

Expected: FAIL because launched projects currently accept a null budget.

- [ ] **Step 3: Add the minimal status-aware validation**

After parsing `budget`, return the specified error when the normalized status is `launched` and the amount is not greater than zero. Preserve optional budgets for every earlier delivery stage.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/lib/crm-actions.test.ts`

Expected: all CRM action parser tests pass.

### Task 2: Create Atomic, Idempotent Project Revenue

**Files:**
- Create: `supabase/migrations/20260722213000_project_close_finance.sql`
- Modify: `src/lib/operations-security.test.ts`

**Interfaces:**
- Consumes: `public.crm_projects`, `public.finance_transactions`, `public.is_team_member()`.
- Produces: `finance_transactions.source`, a unique automatic project-close entry, trigger validation, and existing-project backfill.

- [ ] **Step 1: Write failing migration source assertions**

Read the new migration in `operations-security.test.ts` and assert that it contains:

```ts
assert.match(closeFinanceMigration, /add column if not exists source text/i);
assert.match(closeFinanceMigration, /where source = 'project_close'/i);
assert.match(closeFinanceMigration, /new\.status = 'launched'/i);
assert.match(closeFinanceMigration, /confirmed project amount is required/i);
assert.match(closeFinanceMigration, /insert into public\.finance_transactions/i);
assert.match(closeFinanceMigration, /on conflict \(project_id\) where source = 'project_close'/i);
assert.match(closeFinanceMigration, /from public\.crm_projects/i);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/lib/operations-security.test.ts`

Expected: FAIL because the migration does not exist.

- [ ] **Step 3: Implement the migration**

The migration must:

```sql
alter table public.finance_transactions
  add column if not exists source text not null default 'manual';

alter table public.finance_transactions
  add constraint finance_transactions_source_check
  check (source in ('manual','project_close','adjustment'));

create unique index if not exists finance_transactions_project_close_unique
  on public.finance_transactions (project_id)
  where source = 'project_close';
```

Create a `security definer` trigger function that:

```sql
if old.status = 'launched' and new.budget is distinct from old.budget then
  raise exception 'Closed project amount is locked' using errcode = '22023';
end if;

if new.status = 'launched' and coalesce(new.budget, 0) <= 0 then
  raise exception 'Confirmed project amount is required' using errcode = '22023';
end if;

if new.status = 'launched' and (tg_op = 'INSERT' or old.status is distinct from 'launched') then
  insert into public.finance_transactions (
    occurred_on, type, status, amount, category, description,
    client_id, project_id, source, created_by
  ) values (
    current_date, 'income', 'paid', new.budget, 'Website project',
    new.project_name || ' - final payment', new.client_id, new.id,
    'project_close', lower(coalesce(auth.jwt() ->> 'email', new.created_by, 'system'))
  )
  on conflict (project_id) where source = 'project_close' do nothing;
end if;
```

Use an `after insert or update of status, budget` trigger so the project row exists before its foreign-keyed finance entry is inserted. PostgreSQL still rolls the entire statement back if validation or revenue insertion fails. Backfill missing rows for existing launched projects with positive budgets using `updated_at::date` as `occurred_on` and `on conflict ... do nothing`.

- [ ] **Step 4: Run the focused security test and verify GREEN**

Run: `npm test -- src/lib/operations-security.test.ts`

Expected: all operations security assertions pass.

### Task 3: Make the Close Action Explain the Financial Effect

**Files:**
- Modify: `src/lib/crm.test.ts`
- Modify: `src/lib/crm.ts`
- Modify: `src/app/admin/leads/[id]/LeadEditor.tsx`
- Modify: `src/app/admin/admin.css`

**Interfaces:**
- Consumes: `getProjectLifecycleAction(status)` and the project draft budget.
- Produces: a budget-aware close confirmation, disabled close state without an amount, and completed-payment summary linking to `/admin/finance`.

- [ ] **Step 1: Write failing lifecycle and source tests**

Assert that the review-stage lifecycle label communicates payment:

```ts
assert.deepEqual(getProjectLifecycleAction('review'), {
  nextStatus: 'launched',
  label: 'Close project and record payment',
  confirmation: 'Close this project and record its confirmed amount as paid revenue?',
});
```

Add source assertions confirming the editor checks `draft.budget`, formats the amount in the confirmation, and links completed projects to `/admin/finance`.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm test -- src/lib/crm.test.ts src/lib/crm-dashboard.test.ts`

Expected: FAIL on the previous launch copy and missing finance connection.

- [ ] **Step 3: Implement the connected close experience**

Update the review action label and confirmation. In `LeadEditor`, disable the final close action when `Number(draft.budget) <= 0`, show `Add the confirmed amount before closing`, and confirm with copy equivalent to:

```ts
`Close this project and record ${formatMad(Number(draft.budget))} as paid revenue?`
```

For a launched project, show a compact status row containing `Payment recorded`, the confirmed amount, and a `View in Finance` link. Keep editing available for non-financial project fields but disable the budget input after launch.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm test -- src/lib/crm.test.ts src/lib/crm-dashboard.test.ts`

Expected: all lifecycle and CRM source tests pass.

### Task 4: Attribute Automatic Revenue in Finance

**Files:**
- Modify: `src/lib/operations.ts`
- Modify: `src/lib/operations.test.ts`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/finance/page.tsx`
- Modify: `src/app/admin/finance/FinanceWorkspace.tsx`
- Modify: `src/app/admin/OverviewDashboard.tsx`
- Modify: `src/app/admin/operations.css`

**Interfaces:**
- Consumes: `FinanceTransaction.source` from Task 2.
- Produces: automatic project-payment attribution in Finance and correct paid revenue totals without changing manual transaction behavior.

- [ ] **Step 1: Write failing finance type and presentation tests**

Extend fixtures with `source: 'manual' | 'project_close' | 'adjustment'`. Add assertions that paid `project_close` income contributes to revenue and that `FinanceWorkspace` contains the `Project payment` attribution copy.

- [ ] **Step 2: Run focused finance tests and verify RED**

Run: `npm test -- src/lib/operations.test.ts src/lib/operations-security.test.ts`

Expected: FAIL because `FinanceTransaction` and database selects do not expose `source`.

- [ ] **Step 3: Add source to the finance read model and UI**

Add:

```ts
export type FinanceSource = 'manual' | 'project_close' | 'adjustment';
```

and `source: FinanceSource` to `FinanceTransaction`. Include `source` in both finance selects. Render a restrained `Project payment` badge for `project_close` rows while keeping manual rows unchanged. The existing paid-revenue calculation must count the automatic paid entry normally.

- [ ] **Step 4: Run focused finance tests and verify GREEN**

Run: `npm test -- src/lib/operations.test.ts src/lib/operations-security.test.ts`

Expected: all finance tests pass.

### Task 5: Apply, Verify, Backfill, and Deploy

**Files:**
- No new source files.

**Interfaces:**
- Consumes: Tasks 1-4.
- Produces: migrated production data, verified `2,000 MAD` closed-project revenue, pushed source, and deployed Cloudflare Worker.

- [ ] **Step 1: Run complete local verification**

Run:

```bash
npm test
npm run lint
npm run cf:build
git diff --check
```

Expected: zero test failures, zero lint errors, successful OpenNext build, and no whitespace errors. Existing unrelated lint warnings must be reported rather than silently changed.

- [ ] **Step 2: Apply the Supabase migration**

Run: `npx supabase db push --linked`

Expected: `20260722213000_project_close_finance.sql` is applied successfully.

- [ ] **Step 3: Verify the production backfill**

Query linked project-close entries and confirm the completed `2,000 MAD` project has exactly one row with `type = 'income'`, `status = 'paid'`, `source = 'project_close'`, and the correct `project_id`.

- [ ] **Step 4: Commit and push**

```bash
git add src supabase/migrations/20260722213000_project_close_finance.sql docs/superpowers/plans/2026-07-22-project-close-finance.md
git commit -m "feat: connect project closure to paid revenue"
git push origin master
```

- [ ] **Step 5: Deploy and verify Cloudflare**

Run: `npx wrangler deploy`

Expected: deployment succeeds, `/admin` remains protected, and authenticated CRM/Finance pages load the migrated data.
