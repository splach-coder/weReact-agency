# CRM Access Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add clear forbidden feedback to CRM login and a usable mobile sign-out control.

**Architecture:** Keep authorization server-side and pass its existing `error=access` result into a client-visible alert. Reuse the existing sign-out component in the mobile header with a compact visual variant so logout behavior has one implementation.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, existing CRM CSS, Lucide React, Node test runner.

## Global Constraints

- Preserve the WeReact green and off-white visual system.
- Do not reveal the allowlisted email addresses.
- Keep controls at least 44px on touch screens.
- Keep desktop navigation behavior unchanged.

---

### Task 1: Access-denied feedback

**Files:**
- Modify: `src/app/admin/login/page.tsx`
- Test: `src/lib/crm-security.test.ts`

**Interfaces:**
- Consumes: `?error=access` from the OAuth callback and middleware.
- Produces: a persistent `role="alert"` denial notice.

- [ ] Add a failing source regression assertion for the alert role, copy, and `error=access` handling.
- [ ] Run `npx tsx --test src/lib/crm-security.test.ts` and confirm failure.
- [ ] Read the query parameter after hydration and render the shield alert above the Google button.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Mobile sign-out

**Files:**
- Modify: `src/app/admin/SignOutButton.tsx`
- Modify: `src/app/admin/AdminShell.tsx`
- Modify: `src/app/admin/operations.css`
- Test: `src/lib/crm-header.test.ts`

**Interfaces:**
- Consumes: existing `SignOutButton` Supabase sign-out behavior.
- Produces: `compact?: boolean` and a mobile header logout control.

- [ ] Add a failing regression assertion for the compact sign-out instance in `AdminShell`.
- [ ] Run `npx tsx --test src/lib/crm-header.test.ts` and confirm failure.
- [ ] Add the compact button variant and place it beside the mobile page label.
- [ ] Add mobile-only 44px button styling and preserve desktop styling.
- [ ] Re-run the focused test and confirm it passes.

### Task 3: Production verification

**Files:**
- Verify only.

**Interfaces:**
- Consumes: completed login and mobile header changes.
- Produces: a deployable Cloudflare build.

- [ ] Run `npm test` and expect all tests to pass.
- [ ] Run `npm run lint` and expect zero errors.
- [ ] Run `npm run cf:build` and expect a successful OpenNext bundle.
- [ ] Verify `/admin/login?error=access` and a phone-width authenticated CRM viewport.
- [ ] Commit, push `master`, deploy with Wrangler, and smoke-test production.
