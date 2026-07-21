# WeReact CRM Sales Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a secure, mobile-first sales-to-development CRM handoff with automatic Karim ownership and structured multi-project briefs.

**Architecture:** Extend Supabase with normalized clients and projects, expose mutations through validated security-definer RPCs, and reshape the existing Next.js admin dashboard around seller actions and developer handoff. Preserve Google-only allowlist authentication and existing lead/event history.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase Auth/Postgres/RLS, Lucide, CSS, OpenNext Cloudflare.

## Global Constraints

- Keep the existing WeReact light palette and Nohemi typography.
- Karim is the automatic seller; do not expose manual assignment.
- `/crm/login` is only an entry route; Google OAuth, allowlist checks, RLS, and RPC authorization enforce access.
- Build mobile-first for 375px with 44px touch targets and no horizontal page overflow.
- Follow TDD for parsers, grouping, and mutation contracts.

---

### Task 1: Project brief domain and validation

**Files:**
- Modify: `src/lib/crm.ts`
- Modify: `src/lib/crm-actions.ts`
- Test: `src/lib/crm.test.ts`
- Test: `src/lib/crm-actions.test.ts`

- [ ] Add failing tests for project statuses, brief defaults, readiness, and validation.
- [ ] Run the focused tests and confirm feature-level failures.
- [ ] Add `CrmClient`, `CrmProject`, project status metadata, and `parseProjectBrief`.
- [ ] Run focused tests to green.

### Task 2: Secure Supabase project workflow

**Files:**
- Create: `supabase/migrations/20260721_crm_project_handoff.sql`
- Modify: `src/app/admin/actions.ts`
- Test: `src/lib/crm-security.test.ts`

- [ ] Add a failing source-contract test for RLS, Google-only membership, automatic seller ownership, and atomic project upsert.
- [ ] Add `clients` and `crm_projects`, indexes, RLS, realtime, Karim backfill/default, and `crm_upsert_project`.
- [ ] Add a validated `saveProjectBriefAction` server action.
- [ ] Run security and action tests to green.

### Task 3: Mobile seller dashboard

**Files:**
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/DashboardClient.tsx`
- Modify: `src/app/admin/admin.css`

- [ ] Fetch related project summaries with leads.
- [ ] Replace assignment/value-heavy cards with need, next action, and handoff readiness.
- [ ] Add mobile `My day` filters and large direct-contact actions.
- [ ] Keep desktop pipeline available and remove the unused Assigned column.

### Task 4: Guided project brief and handoff

**Files:**
- Modify: `src/app/admin/leads/[id]/page.tsx`
- Modify: `src/app/admin/leads/[id]/LeadEditor.tsx`
- Modify: `src/app/admin/admin.css`

- [ ] Load the client and all projects for the lead email.
- [ ] Replace assignment with status/follow-up and add the structured project brief editor.
- [ ] Add project switcher/new project support and `Ready for Anas` handoff.
- [ ] Add a sticky mobile WhatsApp/call/email action bar.

### Task 5: Secure CRM entry route

**Files:**
- Create: `src/app/crm/page.tsx`
- Create: `src/app/crm/login/page.tsx`
- Modify: `src/lib/supabase/middleware.ts`
- Modify: `src/middleware.ts`

- [ ] Add `/crm/login` as an auth route and `/crm` as the authenticated entry.
- [ ] Preserve Google-only allowlist authorization and redirect unauthorized sessions.
- [ ] Verify direct access, sign-out, and callback behavior.

### Task 6: Verification and Cloudflare deployment

- [ ] Apply the migration to the live Supabase project.
- [ ] Run `npm test`, `npx tsc --noEmit`, and `npx eslint src`.
- [ ] Run `npm run cf:build`.
- [ ] Verify dashboard at 375px and desktop using browser screenshots.
- [ ] Deploy the Worker, push `master`, and test authenticated CRM reads/writes.
