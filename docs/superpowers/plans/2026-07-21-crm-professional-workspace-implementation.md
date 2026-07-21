# Professional CRM Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a professional split sales-and-delivery CRM with a draggable sales board, concise client workspaces, per-project domain data, hidden technical history, and durable newsletter subscriber storage.

**Architecture:** Supabase remains the secure source of truth. Validated security-definer RPCs handle sales-stage and project mutations, client components provide optimistic drag-and-drop and copy/contact actions, and server-rendered pages fetch only the information required by each workspace. Newsletter subscriptions are stored in Supabase first and synchronized to Resend.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase/PostgreSQL/RLS, @dnd-kit/core, Lucide React, Resend, OpenNext Cloudflare.

## Global Constraints

- Keep sales stages separate from project delivery stages.
- Only allowlisted Google OAuth team members may access CRM data.
- Never mutate CRM tables directly from the browser.
- Preserve 44px minimum touch targets and prevent horizontal overflow.
- Use Nohemi and the existing WeReact palette without decorative gradients or nested cards.
- Hide history, attribution, IDs, and raw metadata until explicitly expanded.

---

### Task 1: CRM domain and database migration

**Files:**
- Modify: `src/lib/crm.ts`
- Modify: `src/lib/crm-actions.ts`
- Modify: `src/lib/crm.test.ts`
- Modify: `src/lib/crm-actions.test.ts`
- Modify: `src/lib/crm-security.test.ts`
- Create: `supabase/migrations/20260721_crm_professional_workspace.sql`

**Interfaces:**
- Produces: `CRM_STATUSES` with seven sales-only stages.
- Produces: `PROJECT_STATUSES` with six delivery-only stages.
- Produces: `domain_name` on `CrmProject` and project brief parser output.
- Produces: security-definer `crm_move_lead(p_lead_id uuid, p_status text, p_expected_updated_at timestamptz)`.

- [ ] **Step 1: Write failing tests**

```ts
assert.deepEqual(CRM_STATUSES, [
  'new', 'contacted', 'discovery', 'proposal_sent', 'negotiation', 'won', 'lost',
]);
assert.equal(parseProjectBrief({ ...validBrief, domainName: ' AtlasTours.ma ' }).value.domain_name, 'atlastours.ma');
```

- [ ] **Step 2: Run focused tests and confirm the new stages/domain/RPC are missing**

Run: `npm test`
Expected: failures in CRM domain and migration assertions.

- [ ] **Step 3: Implement the model and migration**

The migration must replace the leads status constraint, map `qualified` to `discovery`, map `building` to the existing project value, add `domain_name text not null default ''`, update both RPC status allowlists, and grant `crm_move_lead` only to `authenticated`.

- [ ] **Step 4: Run focused tests**

Run: `npm test`
Expected: CRM tests pass.

### Task 2: Durable newsletter subscribers

**Files:**
- Create: `src/lib/newsletter-store.ts`
- Create: `src/lib/newsletter-store.test.ts`
- Modify: `src/app/api/subscribe/route.ts`
- Create: `supabase/migrations/20260721_newsletter_subscribers.sql`
- Modify: `src/lib/crm-security.test.ts`

**Interfaces:**
- Produces: `buildSubscriberRecord(email, locale, source, now)`.
- Produces: protected `newsletter_subscribers` table keyed by normalized email.

- [ ] **Step 1: Write failing normalization tests**

```ts
assert.deepEqual(buildSubscriberRecord(' Test@Example.com ', 'fr', 'footer', now), {
  email: 'test@example.com',
  locale: 'fr',
  source: 'footer',
  status: 'subscribed',
  consented_at: now,
});
```

- [ ] **Step 2: Implement the table and server-only upsert**

The route creates a service-role Supabase client, upserts the subscriber, then synchronizes Resend. The table has RLS enabled, no anonymous policies, and grants no public write access.

- [ ] **Step 3: Run newsletter and security tests**

Run: `npm test`
Expected: all tests pass.

### Task 3: Validated drag-and-drop sales board

**Files:**
- Modify: `package.json`
- Modify: `src/app/admin/actions.ts`
- Modify: `src/app/admin/DashboardClient.tsx`
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/admin.css`

**Interfaces:**
- Consumes: `crm_move_lead`.
- Produces: `moveLeadStageAction(leadId, status, expectedUpdatedAt)`.

- [ ] **Step 1: Install the established drag-and-drop engine**

Run: `npm install @dnd-kit/core`
Expected: dependency and lockfile update.

- [ ] **Step 2: Add the validated server action**

The action validates UUID, stage, authorization, and optimistic version before calling the RPC. It revalidates the dashboard and detail route.

- [ ] **Step 3: Build optimistic drag and drop**

Use `DndContext`, `useDraggable`, and `useDroppable`. Pointer and keyboard sensors move cards. On mutation failure, restore the prior lead array and show an inline error. Mobile cards retain an accessible native stage select.

- [ ] **Step 4: Simplify board information**

Keep only client identity, next follow-up, project summary, and direct contact/open actions. Replace decorative metric cards with one compact work-summary row.

### Task 4: Professional client and project workspace

**Files:**
- Create: `src/app/admin/leads/[id]/CopyButton.tsx`
- Modify: `src/app/admin/leads/[id]/LeadEditor.tsx`
- Modify: `src/app/admin/leads/[id]/page.tsx`
- Modify: `src/app/admin/admin.css`

**Interfaces:**
- Consumes: project `domain_name` and the existing save actions.
- Produces: copyable contact rows and tabbed project brief sections.

- [ ] **Step 1: Add contact and copy actions**

Email, phone, and WhatsApp values link to `mailto:`, `tel:`, and `wa.me`. Adjacent icon buttons use `navigator.clipboard.writeText` and an accessible live announcement.

- [ ] **Step 2: Recompose the workspace**

Remove repeated Karim labels. Place sales controls in a compact side panel. Rename the project action to **Add another website** and explain it only in the empty/add state. Add the domain name field.

- [ ] **Step 3: Organize the brief**

Use compact tabs for `Overview`, `Scope`, `Assets`, and `Delivery`. Do not nest cards. Each tab keeps mounted form state and exposes only its relevant fields.

- [ ] **Step 4: Collapse secondary data**

Render `History`, `Acquisition details`, and `Technical details` as closed disclosure panels. Transaction IDs and UUIDs appear only in Technical details.

### Task 5: Responsive design and interaction polish

**Files:**
- Modify: `src/app/admin/admin.css`

- [ ] **Step 1: Apply the operational visual hierarchy**

Flatten nested surfaces, use one border system, reduce radii, keep text at readable operational sizes, and use real Lucide/brand WhatsApp icons.

- [ ] **Step 2: Implement phone behavior**

Disable drag interaction on coarse pointers, show stage select, keep direct contact actions sticky, stack project tabs without overflow, and maintain 44px controls.

- [ ] **Step 3: Honor reduced motion and keyboard focus**

Add visible `:focus-visible` rings and remove drag transition effects under `prefers-reduced-motion`.

### Task 6: Migration, verification, deployment, and push

**Files:**
- Modify: migration files only if live verification exposes SQL incompatibility.

- [ ] **Step 1: Run complete automated verification**

Run: `npm test`, `npx tsc --noEmit`, `npx eslint src`, and `npm run cf:build`.
Expected: tests/type/build pass; lint has no new errors.

- [ ] **Step 2: Apply both Supabase migrations**

Run the reviewed SQL in the authenticated Supabase SQL editor and confirm **Success. No rows returned**.

- [ ] **Step 3: Test the live CRM**

Verify unauthenticated `/crm` redirects to `/crm/login`. Verify authenticated desktop drag and drop, phone stage fallback, project domain save, copy controls, closed technical panels, newsletter insertion, and no horizontal overflow.

- [ ] **Step 4: Deploy and push**

Deploy with `npx opennextjs-cloudflare deploy`, commit the implementation, and push `master`.

