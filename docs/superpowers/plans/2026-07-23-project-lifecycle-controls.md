# Project Lifecycle Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add safe reopen and delete controls for closed projects while keeping Finance and invoices synchronized.

**Architecture:** A Supabase migration adds archive metadata and two transactional RPCs. Next.js server actions validate requests and call those RPCs, while the existing closed-project cards expose responsive lifecycle controls and update local state after success.

**Tech Stack:** PostgreSQL/Supabase RPCs, Next.js 16 server actions, React 19, TypeScript, Lucide icons, Node test runner.

## Global Constraints

- Preserve client, lead, activity, project-work, and invoice audit history.
- Reverse only `finance_transactions.source = 'project_close'`.
- Restrict lifecycle mutations to authenticated `team_members`.
- Keep desktop and phone controls usable.

---

### Task 1: Transactional Project Lifecycle

**Files:**
- Create: `supabase/migrations/20260723233000_project_lifecycle_controls.sql`
- Test: `src/lib/project-lifecycle.test.ts`

**Interfaces:**
- Produces: `crm_reopen_project(uuid, timestamptz) -> timestamptz`
- Produces: `crm_archive_project(uuid, timestamptz) -> void`
- Produces: `crm_projects.deleted_at timestamptz`, `crm_projects.deleted_by text`

- [ ] **Step 1: Write failing migration contract tests**

Assert team authorization, row locking, optimistic concurrency, project-close finance deletion, invoice correction, activity logging, and execute grants.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npx tsx --test src/lib/project-lifecycle.test.ts`

Expected: FAIL because the lifecycle migration does not exist.

- [ ] **Step 3: Implement the migration**

Add archive columns, RPCs, grants, and archive-aware project movement/upsert guards.

- [ ] **Step 4: Run the focused test**

Run: `npx tsx --test src/lib/project-lifecycle.test.ts`

Expected: PASS.

### Task 2: Server Actions and Query Visibility

**Files:**
- Modify: `src/app/admin/actions.ts`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/pipeline/page.tsx`
- Modify: `src/app/admin/leads/[id]/page.tsx`
- Modify: `src/app/admin/finance/page.tsx`
- Modify: `src/lib/crm.ts`
- Test: `src/lib/crm-dashboard.test.ts`

**Interfaces:**
- Produces: `reopenProjectAction(projectId, expectedUpdatedAt)`
- Produces: `archiveProjectAction(projectId, expectedUpdatedAt)`

- [ ] **Step 1: Extend failing action/query tests**

Assert UUID/version validation, correct RPC calls, path revalidation, and `deleted_at` filtering on every normal project query.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npx tsx --test src/lib/crm-dashboard.test.ts`

Expected: FAIL until actions and filters exist.

- [ ] **Step 3: Implement actions, type metadata, and filters**

Return consistent `CrmActionResult` messages and keep archived projects out of active CRM views.

- [ ] **Step 4: Run focused tests**

Run: `npx tsx --test src/lib/crm-dashboard.test.ts`

Expected: PASS.

### Task 3: Responsive Closed-Project Controls

**Files:**
- Modify: `src/app/admin/DashboardClient.tsx`
- Modify: `src/app/admin/admin.css`
- Test: `src/lib/crm-dashboard.test.ts`

**Interfaces:**
- Consumes: `reopenProjectAction`, `archiveProjectAction`
- Produces: accessible closed-project action menu and immediate board updates

- [ ] **Step 1: Add failing UI contract tests**

Assert the menu labels, confirmation copy, server action use, pending state, error feedback, and no drag behavior on closed cards.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npx tsx --test src/lib/crm-dashboard.test.ts`

Expected: FAIL until lifecycle controls exist.

- [ ] **Step 3: Implement UI and responsive styling**

Use a compact Lucide `MoreVertical` menu, secondary reopen command, destructive delete command, and mobile-safe full-width menu placement.

- [ ] **Step 4: Run focused and full verification**

Run: `npm test`

Expected: all tests pass.

Run: `npm run lint`

Expected: exit code 0.

Run: `npm run build`

Expected: production build succeeds.

### Task 4: Release

**Files:**
- Modify: Supabase production schema through the SQL migration

**Interfaces:**
- Deploys the tested lifecycle controls and database functions.

- [ ] **Step 1: Apply the migration to Supabase**

Expected: SQL editor reports success.

- [ ] **Step 2: Commit and push**

Run: `git add ...`, `git commit -m "feat: add reversible project lifecycle"`, and push `master`.

- [ ] **Step 3: Deploy Cloudflare and smoke test**

Verify `/admin/pipeline`, reopen, delete, Finance reconciliation, and mobile controls against production.
