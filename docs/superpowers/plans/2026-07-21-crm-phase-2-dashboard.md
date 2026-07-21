# WeReact CRM Phase 2 Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the authenticated `/admin` shell into a complete lead pipeline that Anas and Karim can use to qualify, follow up, and close website enquiries.

**Architecture:** Keep Supabase as the source of truth and use authenticated `@supabase/ssr` clients so existing RLS policies remain the authorization boundary. Server Components load the initial dashboard and detail records, Server Actions perform mutations, and a small browser client subscribes to Supabase Realtime before refreshing the current route. The CRM remains outside the localized marketing-site layout.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase Auth/PostgREST/Realtime, Tailwind CSS 4, Lucide React.

## Global Constraints

- Do not modify the public marketing pages, cinematic scroll sections, or their navigation.
- Reuse the website's Nohemi font and light brand palette: `#f6f6f2`, `#3a5a40`, `#a3b18a`, and neutral ink.
- Use the existing stages exactly: `new`, `contacted`, `qualified`, `won`, `lost`.
- All CRM reads and writes must use the authenticated Supabase client and existing RLS allowlist.
- Never expose the Supabase service-role key in browser code.
- The dashboard must remain usable at 360px mobile width and must not introduce horizontal page overflow.

---

### Task 1: CRM domain model and query helpers

**Files:**
- Create: `src/lib/crm.ts`
- Test: `src/lib/crm.test.ts`

**Interfaces:**
- Produces `LeadStatus`, `CrmLead`, `LeadEvent`, `CRM_STATUSES`, `filterLeads`, `groupLeadsByStatus`, `formatLeadAge`, and `getLeadContactRoute`.

- [ ] Write focused failing tests for status grouping, text/status filtering, contact-route selection, and lead age formatting.
- [ ] Run `npx tsx --test src/lib/crm.test.ts` and confirm the missing module/functions fail.
- [ ] Implement the typed domain helpers with no Supabase dependency.
- [ ] Run the focused test and the full suite.

### Task 2: Authenticated CRM mutations

**Files:**
- Create: `src/app/admin/actions.ts`
- Create: `src/lib/crm-actions.ts`
- Test: `src/lib/crm-actions.test.ts`

**Interfaces:**
- Produces validation functions for status, notes, money, and follow-up values.
- Produces Server Actions `updateLeadAction` and `addLeadNoteAction`.

- [ ] Write failing tests for mutation payload validation and normalization.
- [ ] Run the focused test and confirm the expected failures.
- [ ] Implement pure validators, then authenticated Server Actions that update `leads`, append `lead_events`, and revalidate affected routes.
- [ ] Run focused and full tests.

### Task 3: Pipeline dashboard

**Files:**
- Replace: `src/app/admin/page.tsx`
- Create: `src/app/admin/DashboardClient.tsx`
- Create: `src/app/admin/RealtimeRefresh.tsx`
- Create: `src/app/admin/AdminHeader.tsx`
- Create: `src/app/admin/admin.css`
- Modify: `src/app/admin/layout.tsx`

**Interfaces:**
- Consumes the Task 1 lead model and grouping/filter helpers.
- Displays summary metrics, stage board, searchable table, overdue follow-ups, contact actions, and realtime refresh.

- [ ] Load authorized member, leads, and team members server-side with explicit error handling.
- [ ] Build URL-free client filters for search, status, and view mode.
- [ ] Build stable pipeline columns and compact lead cards linking to detail pages.
- [ ] Add an accessible desktop table and stacked mobile rows.
- [ ] Subscribe to `leads` changes and refresh without replacing the current page.

### Task 4: Lead detail and activity workflow

**Files:**
- Create: `src/app/admin/leads/[id]/page.tsx`
- Create: `src/app/admin/leads/[id]/LeadEditor.tsx`

**Interfaces:**
- Consumes Task 2 Server Actions.
- Displays contact details, message, attribution, workflow controls, and chronological events.

- [ ] Fetch one RLS-authorized lead, its events, and team members; return 404 for missing records.
- [ ] Add direct email, phone, and WhatsApp actions.
- [ ] Add status, assignment, estimated value, and follow-up controls with pending/success/error states.
- [ ] Add a minimal note composer and activity timeline.
- [ ] Add realtime refresh for lead and event updates.

### Task 5: Verification and production release

**Files:**
- Modify only files required by verified defects.

- [ ] Run `npm test`, `npx tsc --noEmit`, `npx eslint src`, and `npm run build`.
- [ ] Start the local server and inspect `/admin/login`, the OAuth redirect request, desktop dashboard, lead detail, and 360px mobile layouts.
- [ ] Confirm production has both public Supabase auth variables before release.
- [ ] Commit the CRM implementation on `crm-dashboard`.
- [ ] Merge `crm-dashboard` into `master`, push both branches, and verify `https://www.wereact.agency/admin` after deployment.
