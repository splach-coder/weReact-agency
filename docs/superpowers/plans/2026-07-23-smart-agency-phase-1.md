# Smart Agency Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the reliable automation, attention, communication-delivery, and integration-health foundation to the existing WeReact CRM.

**Architecture:** Supabase stores an idempotent event outbox, actionable attention items, normalized communications, provider events, and integration health. Validated security-definer RPCs control team mutations. The Next.js admin renders the daily queue and automation health, while verified Resend webhooks update delivery state without blocking existing client actions.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase PostgreSQL/RLS, Resend/Svix webhooks, Cloudflare OpenNext, Node test runner.

## Global Constraints

- Existing lead, project, invoice, finance, newsletter, auth, and mobile CRM behavior must remain intact.
- Team-only operations require `is_team_member()` and security-definer functions pinned to `search_path = ''`.
- Public webhooks require signature verification, replay-safe provider event ids, and no service credentials in client bundles.
- Missing provider configuration produces visible disabled health, not runtime failure.
- No verification step sends a real email, WhatsApp message, invoice, payment, or proposal.

---

### Task 1: Automation and communication schema

**Files:**
- Create: `supabase/migrations/20260723190000_smart_agency_foundation.sql`
- Modify: `src/lib/crm-security.test.ts`

**Interfaces:**
- Produces tables `automation_events`, `attention_items`, `communications`, `communication_events`, `integration_health`.
- Produces RPCs `crm_refresh_attention_items()`, `crm_complete_attention_item(uuid)`, `crm_snooze_attention_item(uuid,timestamptz)`, `crm_retry_automation_event(uuid)`, and `crm_upsert_integration_health(text,text,text)`.

- [ ] Write migration-security tests that require all five tables, team RLS, revoked direct writes, pinned security-definer functions, unique idempotency keys, unique provider event ids, and realtime publication.
- [ ] Run `npm test -- --test-name-pattern="automation foundation"` and verify the new test fails because the migration does not exist.
- [ ] Create the migration with constrained enums, indexes for due work and processing, team select policies, RPC-only mutations, and a deterministic `crm_refresh_attention_items()` that upserts new-lead, overdue-follow-up, overdue-invoice, blocked-task, and integration-failure items.
- [ ] Run the focused test and verify it passes.
- [ ] Commit with `feat: add smart agency automation foundation`.

### Task 2: Domain types, validation, and deterministic metrics

**Files:**
- Create: `src/lib/automation.ts`
- Create: `src/lib/automation.test.ts`
- Modify: `src/lib/crm.ts`
- Modify: `src/lib/operations.ts`
- Modify: `src/lib/operations.test.ts`

**Interfaces:**
- Produces `AttentionItem`, `AutomationEvent`, `Communication`, `CommunicationEvent`, `IntegrationHealth`.
- Produces `parseAttentionMutation`, `normalizeProviderEventType`, `calculateCommunicationHealth`, and `calculateFunnelMetrics`.

- [ ] Write failing tests for accepted states, invalid UUIDs/dates, provider-event normalization, delivery/bounce rates, response-time SLA, proposal conversion, win rate, and source-to-revenue grouping.
- [ ] Run focused tests and verify missing exports fail.
- [ ] Implement strict parsers and pure metric functions with explicit zero-denominator behavior.
- [ ] Run focused tests and verify they pass.
- [ ] Commit with `feat: add automation and agency intelligence domain`.

### Task 3: Verified Resend webhook ingestion

**Files:**
- Create: `src/lib/resend-webhook.ts`
- Create: `src/lib/resend-webhook.test.ts`
- Create: `src/app/api/webhooks/resend/route.ts`
- Modify: `.env.example`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes `RESEND_WEBHOOK_SECRET`, Supabase service credentials, and Resend `svix-id`, `svix-timestamp`, `svix-signature` headers.
- Produces replay-safe `communication_events`, communication delivery updates, bounce attention items, and Resend integration health.

- [ ] Add `svix` as a production dependency.
- [ ] Write failing unit tests for supported Resend events, malformed payloads, missing headers, event ids, and delivery-state precedence.
- [ ] Implement payload parsing independently from signature verification.
- [ ] Implement the webhook route using raw request text and Svix verification before JSON parsing.
- [ ] Upsert provider events by provider event id, update the matching communication by provider message id, refresh attention items, and return `200` for valid duplicates.
- [ ] Add `RESEND_WEBHOOK_SECRET=` to `.env.example` without a value.
- [ ] Run focused tests and TypeScript.
- [ ] Commit with `feat: track resend delivery events`.

### Task 4: Record outbound invoice and newsletter communication

**Files:**
- Modify: `src/app/admin/operations-actions.ts`
- Modify: `src/app/api/contact/route.ts`
- Modify: `src/lib/crm-dashboard.test.ts`

**Interfaces:**
- Consumes Resend response ids.
- Produces `communications` rows linked to lead/client/project/invoice when a provider accepts an outbound message.

- [ ] Write failing source-level tests requiring provider message id capture and communication insertion for invoice email, newsletter campaign messages, owner enquiry email, and client confirmation email.
- [ ] Refactor the shared Resend sender to return the provider message id without changing visitor success behavior.
- [ ] Record approved outbound content metadata after provider acceptance; communication-log failure must be reported but must not report the email itself as failed.
- [ ] Run focused and full tests.
- [ ] Commit with `feat: record outbound client communications`.

### Task 5: Attention inbox actions and overview UI

**Files:**
- Create: `src/app/admin/attention-actions.ts`
- Create: `src/app/admin/AttentionInbox.tsx`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/OverviewDashboard.tsx`
- Modify: `src/app/admin/operations.css`
- Modify: `src/lib/crm-dashboard.test.ts`

**Interfaces:**
- Consumes `attention_items` and the complete/snooze RPCs.
- Produces a mobile-first daily queue with Open, Complete, and Snooze actions.

- [ ] Write failing tests requiring protected reads, validated RPC actions, priority sorting, source links, empty state, and touch-safe mobile controls.
- [ ] Load attention items and refresh deterministic items before rendering the admin overview.
- [ ] Add server actions that validate UUIDs and future snooze timestamps and revalidate admin routes.
- [ ] Build a compact queue grouped into overdue, today, and upcoming with one primary action per row.
- [ ] Keep financial and funnel summary panels below the attention queue.
- [ ] Run tests, TypeScript, and focused lint.
- [ ] Commit with `feat: add seller attention inbox`.

### Task 6: Automation and integration health workspace

**Files:**
- Create: `src/app/admin/automation/page.tsx`
- Create: `src/app/admin/automation/AutomationWorkspace.tsx`
- Modify: `src/app/admin/AdminShell.tsx`
- Modify: `src/app/admin/operations.css`
- Modify: `src/app/admin/attention-actions.ts`
- Modify: `src/lib/crm-dashboard.test.ts`

**Interfaces:**
- Consumes recent automation events and integration health rows.
- Produces `/admin/automation`, retry actions for failed events, and configured/degraded/disabled provider indicators.

- [ ] Write failing tests for protected route access, navigation, no secret rendering, retry validation, mobile layout, and disabled-provider copy.
- [ ] Add the Automation navigation item and route.
- [ ] Render provider status, last success/failure, pending/processing/failed counts, and a compact recent-runs table.
- [ ] Add retry action through `crm_retry_automation_event` and revalidate the route.
- [ ] Run tests, TypeScript, and lint.
- [ ] Commit with `feat: add automation health workspace`.

### Task 7: Cloudflare recovery processor and release verification

**Files:**
- Create: `src/lib/automation-processor.ts`
- Create: `src/lib/automation-processor.test.ts`
- Create: `src/app/api/internal/automation/route.ts`
- Modify: `.env.example`
- Modify: `wrangler.jsonc`
- Modify: `src/lib/crm-security.test.ts`

**Interfaces:**
- Consumes `AUTOMATION_INTERNAL_SECRET` and bounded pending-event batches.
- Produces an authenticated recovery processor suitable for Cloudflare Cron/Workflow triggering and local operations.

- [ ] Write failing tests for bearer authentication, batch bounds, event claiming, idempotency, retry scheduling, and permanent dead-letter behavior.
- [ ] Implement a pure event dispatcher for Phase 1 event types and a service-role batch processor.
- [ ] Implement the authenticated internal POST route with a maximum batch of 25.
- [ ] Add the secret name to `.env.example` and document the endpoint in the automation workspace without revealing it.
- [ ] Run `npm test`, `npx tsc --noEmit`, `npm run lint`, `git diff --check`, and `npm run cf:build`.
- [ ] Inspect desktop and mobile admin pages in a real browser without executing external sends.
- [ ] Apply the Supabase migration, commit remaining release changes, push `master`, deploy Cloudflare, and verify public/admin routes.