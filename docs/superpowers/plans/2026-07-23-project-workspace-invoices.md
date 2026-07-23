# Project Workspace and Invoices Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a secure, mobile-ready project operations workspace and sequential professional invoice generator to the existing WeReact CRM.

**Architecture:** Extend `crm_projects` with one developer assignment, store milestones/tasks/checks in one normalized work-items table, and store invoice headers and lines with immutable issued snapshots. All writes use validated server actions and team-only security-definer RPCs. The current client project area remains the primary workspace, while issued invoices render through a protected print route.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase/Postgres, lucide-react, existing CRM CSS, Node test runner, Cloudflare OpenNext.

## Global Constraints

- Professional invoices only; do not display or invent ICE, IF, RC, VAT, bank, or tax information.
- Invoice numbers use `WR-YYYY-####`, are allocated only on issue, are unique, and are never reused.
- Issued, paid, and void invoices preserve immutable seller and customer snapshots.
- A project closes only after delivery is complete and full payment is received.
- Existing project-close revenue remains duplicate-safe and linked to Finance.
- Required incomplete launch checks block project closure.
- All new data is team-only and direct authenticated writes are revoked in favor of security-definer RPCs.
- Desktop stays dense and operational; phone controls use at least 44px tap targets and never require dragging.
- Follow existing CRM colors, typography, button patterns, full-width layout, and side-drawer conventions.

---

### Task 1: Domain Types and Validation

**Files:**
- Modify: `src/lib/crm.ts`
- Modify: `src/lib/crm-actions.ts`
- Modify: `src/lib/crm.test.ts`
- Modify: `src/lib/crm-actions.test.ts`
- Modify: `src/lib/operations.ts`
- Modify: `src/lib/operations.test.ts`

**Interfaces:**
- Produces `ProjectWorkItem`, `ProjectWorkItemKind`, `ProjectWorkItemStatus`, `ProjectWorkItemPriority`, `Invoice`, `InvoiceLine`, `InvoiceStatus`.
- Produces `parseProjectWorkItem`, `parseInvoiceDraft`, `calculateInvoiceTotals`, and workspace progress helpers.

- [ ] **Step 1: Write failing work-item validation tests**

Cover trimmed titles/details, valid enum values, optional ISO date, team assignment, required flag, position, completion timestamps, and rejection of malformed project IDs or empty titles.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
npx tsx --test src/lib/crm-actions.test.ts
```

Expected: failures for missing work-item APIs.

- [ ] **Step 3: Implement minimal work-item types and parser**

Use these exact enums:

```ts
export const PROJECT_WORK_ITEM_KINDS = ['milestone', 'task', 'delivery_check'] as const;
export const PROJECT_WORK_ITEM_STATUSES = ['todo', 'in_progress', 'blocked', 'done', 'skipped'] as const;
export const PROJECT_WORK_ITEM_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;
```

Limit titles to 180 characters, details to 2,000, assignment email to 254, and positions to non-negative integers.

- [ ] **Step 4: Write failing invoice validation and total tests**

Cover draft client/project IDs, issued date, due date, notes, non-empty line descriptions, positive quantity, non-negative unit price, two-decimal totals, and rejection of empty invoices.

- [ ] **Step 5: Run invoice tests and verify RED**

Run:

```powershell
npx tsx --test src/lib/operations.test.ts
```

- [ ] **Step 6: Implement invoice types, parser, and total calculation**

Keep currency fixed to `MAD`. Draft parsing must not accept a caller-supplied invoice number or seller snapshot.

- [ ] **Step 7: Run both focused suites**

Expected: all focused tests pass.

- [ ] **Step 8: Commit**

```powershell
git add src/lib/crm.ts src/lib/crm-actions.ts src/lib/crm.test.ts src/lib/crm-actions.test.ts src/lib/operations.ts src/lib/operations.test.ts
git commit -m "feat: define project work and invoice domain"
```

---

### Task 2: Secure Workspace and Invoice Database

**Files:**
- Create: `supabase/migrations/20260723120000_project_workspace_invoices.sql`
- Modify: `src/lib/crm-security.test.ts`
- Modify: `src/lib/operations-security.test.ts`

**Interfaces:**
- Adds `crm_projects.assigned_developer_email`.
- Adds `project_work_items`, `invoices`, `invoice_lines`, and `invoice_sequences`.
- Produces RPCs `crm_save_project_work_item`, `crm_delete_project_work_item`, `crm_create_invoice_draft`, `crm_update_invoice_draft`, `crm_issue_invoice`, and `crm_void_invoice`.

- [ ] **Step 1: Write failing migration contract tests**

Assert exact enums/check constraints, team-only RLS, revoked direct writes, security-definer RPCs, realtime publication, annual sequence locking, snapshot persistence, immutability, default checklist creation/backfill, launch blocking, and project-close invoice payment linkage.

- [ ] **Step 2: Run security tests and verify RED**

Run:

```powershell
npx tsx --test src/lib/crm-security.test.ts src/lib/operations-security.test.ts
```

- [ ] **Step 3: Create the migration**

The migration must:

- Add optional developer assignment referencing `team_members(email)`.
- Create normalized work items with indexes on project, kind/status, and due date.
- Seed the eight approved launch checks for new projects and active existing projects.
- Block `review -> launched` when a required check is not `done` or `skipped`.
- Create invoice tables and a yearly sequence table.
- Allocate `WR-YYYY-####` inside `crm_issue_invoice` using `insert ... on conflict ... do update ... returning`.
- Snapshot verified seller data and current client data at issue.
- Prevent mutation of issued/paid/void invoice content with a trigger.
- Mark the linked issued invoice paid when the project-close Finance transaction is created.
- Allow generation of a paid invoice after project closure by linking the existing transaction.
- Add the new realtime tables idempotently.

- [ ] **Step 4: Run security tests and verify GREEN**

- [ ] **Step 5: Commit**

```powershell
git add supabase/migrations/20260723120000_project_workspace_invoices.sql src/lib/crm-security.test.ts src/lib/operations-security.test.ts
git commit -m "feat: secure project workspace and invoice storage"
```

---

### Task 3: Server Reads and Mutations

**Files:**
- Modify: `src/app/admin/actions.ts`
- Modify: `src/app/admin/operations-actions.ts`
- Modify: `src/app/admin/leads/[id]/page.tsx`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/pipeline/page.tsx`
- Modify: `src/lib/crm-dashboard.test.ts`

**Interfaces:**
- Produces `saveProjectWorkItemAction`, `deleteProjectWorkItemAction`, `createInvoiceDraftAction`, `updateInvoiceDraftAction`, `issueInvoiceAction`, and `voidInvoiceAction`.
- Loads team members, work items, invoices, and lines for the selected client project.

- [ ] **Step 1: Write failing route/action source tests**

Assert authorization, parser use, RPC names, route revalidation, new selects, and realtime tables.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```powershell
npx tsx --test src/lib/crm-dashboard.test.ts src/lib/operations.test.ts
```

- [ ] **Step 3: Implement authorized server actions**

Actions must return stable `{ ok, error, id, updatedAt }` responses, map stale conflicts to refresh guidance, and never expose database internals.

- [ ] **Step 4: Extend server-side project reads**

Fetch work items, invoices, invoice lines, and assignable team members in parallel after resolving the client. Pass only the selected project’s records into the workspace components. Add realtime refresh for all new tables.

- [ ] **Step 5: Extend overview/pipeline project selects**

Include `assigned_developer_email` everywhere a `CrmProject` is loaded.

- [ ] **Step 6: Run focused tests and verify GREEN**

- [ ] **Step 7: Commit**

```powershell
git add src/app/admin/actions.ts src/app/admin/operations-actions.ts src/app/admin/leads/[id]/page.tsx src/app/admin/page.tsx src/app/admin/pipeline/page.tsx src/lib/crm-dashboard.test.ts
git commit -m "feat: connect project operations server flow"
```

---

### Task 4: Project Work and Launch UI

**Files:**
- Create: `src/app/admin/leads/[id]/ProjectWorkspace.tsx`
- Modify: `src/app/admin/leads/[id]/LeadEditor.tsx`
- Modify: `src/app/admin/admin.css`
- Modify: `src/app/admin/operations.css`
- Modify: `src/lib/crm-dashboard.test.ts`

**Interfaces:**
- Consumes selected `CrmProject`, `ProjectWorkItem[]`, and `TeamMember[]`.
- Calls work-item actions and existing project brief/lifecycle actions.

- [ ] **Step 1: Write failing workspace UI tests**

Assert the four views `Brief`, `Work`, `Launch`, `Invoice`; task status controls; milestone progress; developer selector; due dates; required checklist; explicit mobile status controls; and accessible 44px actions.

- [ ] **Step 2: Run UI tests and verify RED**

- [ ] **Step 3: Build the workspace component**

Keep the existing brief fields and project selector. Add:

- Compact developer and deadline summary
- Milestone progress with next milestone highlighted
- Dense task rows with status, priority, owner, deadline, edit, and delete
- Minimal add/edit form in an inline disclosure
- Launch readiness summary and required checklist
- Clear blocking copy before final closure

Do not use nested cards, oversized headings, or drag-only phone controls.

- [ ] **Step 4: Integrate the workspace with the project editor**

The selected project state must remain stable across view changes and refreshes. New projects show the brief first; saved projects expose all four views.

- [ ] **Step 5: Implement responsive CSS**

Desktop remains full-width and information-dense. Under 700px, use a compact project selector, two-by-two view controls, single-column rows, large status selects, and contact-strip spacing above the global nav.

- [ ] **Step 6: Run focused tests and build**

Run:

```powershell
npx tsx --test src/lib/crm-dashboard.test.ts src/lib/crm-actions.test.ts
npm run build
```

- [ ] **Step 7: Commit**

```powershell
git add src/app/admin/leads/[id]/ProjectWorkspace.tsx src/app/admin/leads/[id]/LeadEditor.tsx src/app/admin/admin.css src/app/admin/operations.css src/lib/crm-dashboard.test.ts
git commit -m "feat: add project operations workspace"
```

---

### Task 5: Invoice Draft, Issue, and Print UI

**Files:**
- Create: `src/app/admin/leads/[id]/InvoiceWorkspace.tsx`
- Create: `src/app/admin/invoices/[id]/page.tsx`
- Create: `src/app/admin/invoices/[id]/InvoicePrintActions.tsx`
- Create: `src/app/admin/invoices/invoice.css`
- Modify: `src/app/admin/leads/[id]/ProjectWorkspace.tsx`
- Modify: `src/app/admin/admin.css`
- Modify: `src/lib/operations.test.ts`
- Modify: `src/lib/crm-dashboard.test.ts`

**Interfaces:**
- Consumes project, lead/client, invoices, lines, and invoice actions.
- Protected invoice route renders immutable issued snapshots and draft previews.

- [ ] **Step 1: Write failing invoice UI/route tests**

Assert the empty state, prefilled draft, editable lines, due date, issue confirmation, sequential number display, paid/void status, protected route, verified seller details, no fiscal identifiers, and `window.print()` action.

- [ ] **Step 2: Run focused tests and verify RED**

- [ ] **Step 3: Build invoice workspace**

Allow one active invoice per project in this MVP. Draft line items are editable. Issue requires a positive confirmed total and freezes the document. Paid and void documents are read-only.

- [ ] **Step 4: Build protected invoice document**

Render WeReact wordmark, verified business contact details, customer snapshot, project, number, dates, lines, totals, notes, and status. Use semantic tables and print-safe black/green styling.

- [ ] **Step 5: Add print CSS**

Hide CRM controls during print, use A4-friendly spacing, preserve readable contrast, and avoid page breaks inside totals and line rows.

- [ ] **Step 6: Run focused tests and production build**

- [ ] **Step 7: Commit**

```powershell
git add src/app/admin/leads/[id]/InvoiceWorkspace.tsx src/app/admin/leads/[id]/ProjectWorkspace.tsx src/app/admin/invoices src/app/admin/admin.css src/lib/operations.test.ts src/lib/crm-dashboard.test.ts
git commit -m "feat: generate numbered project invoices"
```

---

### Task 6: Migration, Full Verification, and Deployment

**Files:**
- Modify only if verification exposes a defect.

**Interfaces:**
- Applies migration `20260723120000_project_workspace_invoices.sql`.
- Verifies live Supabase, Cloudflare, authenticated CRM, and protected invoice access.

- [ ] **Step 1: Run the complete local checks**

```powershell
npm test
npm run lint
npm run cf:build
git diff --check
```

Expected: all tests and build pass; lint has no new errors.

- [ ] **Step 2: Apply the Supabase migration**

Use the signed-in Supabase SQL editor if CLI project authentication is unavailable. Confirm the destructive-query dialog only after verifying the pasted SQL exactly matches the migration file.

- [ ] **Step 3: Verify database contracts**

Confirm:

- Eight default launch checks exist for each active project
- No duplicate defaults
- Invoice tables and RPCs exist
- Sequence allocation returns `WR-2026-0001` for the first issued 2026 invoice in a transaction-safe test or real draft
- Existing 2,000 MAD Finance entry remains exactly once

- [ ] **Step 4: Verify desktop and phone in the browser**

Test task creation, status update, checklist completion, developer assignment, invoice draft, issue, print layout, paid linkage, and unauthorized redirects. Check 1440px desktop and 390px phone widths.

- [ ] **Step 5: Push and deploy**

```powershell
git push origin master
npm run cf:deploy
```

- [ ] **Step 6: Verify production**

Confirm public site 200, `/admin` redirects unauthenticated visitors, authenticated workspace loads, invoice route is protected, and Finance still shows the linked project revenue.
