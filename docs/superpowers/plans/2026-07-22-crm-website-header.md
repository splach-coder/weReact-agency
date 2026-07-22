# CRM Website Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Restyle the private CRM header with the public website's `·wereact·` identity and a professional sign-out action.

**Architecture:** Keep the existing `AdminHeader` and Supabase sign-out flow. Change only their semantic markup and CRM-scoped CSS so no public menu, localization, GSAP, or marketing-site dependencies enter the admin application.

**Tech Stack:** Next.js 16, React 19, TypeScript, Lucide React, CSS.

## Global Constraints

- Preserve the existing authenticated CRM routes and sign-out redirect.
- Use the exact `·wereact·` wordmark treatment.
- Keep the header sticky and responsive.
- Do not add the public full-screen menu overlay.

---

### Task 1: Header Identity And Sign-Out Control

**Files:**
- Modify: `src/app/admin/AdminHeader.tsx`
- Modify: `src/app/admin/SignOutButton.tsx`
- Modify: `src/app/admin/admin.css`
- Create: `src/lib/crm-header.test.ts`

**Interfaces:**
- Consumes: `TeamMember`, existing `/admin` route, and `SignOutButton`.
- Produces: the existing `AdminHeader({ member })` interface with updated markup and styling.

- [x] **Step 1: Write the failing structural test**

Assert that the CRM header contains the `·wereact·` wordmark, removes `crm-brand__mark`, uses a Lucide `LogOut` icon, and retains the authenticated sign-out call.

- [x] **Step 2: Run the focused test and verify it fails**

Run: `tsx --test src/lib/crm-header.test.ts`

Expected: FAIL because the current header still renders the boxed `W` mark and the sign-out button has no icon.

- [x] **Step 3: Implement the header markup**

Replace the boxed mark and subtitle with a single brand wordmark. Keep the dashboard shortcut, member identity, and sign-out action.

- [x] **Step 4: Implement responsive CRM-scoped styling**

Style the wordmark like the public header, keep the glass treatment, and give sign out an icon, visible focus state, and a 44px mobile target.

- [x] **Step 5: Verify the focused test, TypeScript, lint, and browser layout**

Run the focused test, `tsc --noEmit`, ESLint on the changed files, and inspect `/admin` at desktop and phone widths.

- [x] **Step 6: Commit the completed header**

Stage only the header implementation, test, plan, and relevant CSS changes, then create a focused commit.
