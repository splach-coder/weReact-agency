# Project Workspace and Professional Invoices

## Objective

Extend the existing WeReact CRM so every website project has one operational
workspace for requirements, assigned development work, milestones, deadlines,
domain and hosting readiness, launch checks, and professional invoices.

The feature must build on the current client, project, delivery, and finance
models. It must not create a second disconnected project system.

## Product Boundaries

- This version generates professional WeReact invoices, not Moroccan fiscal
  invoices.
- It uses only verified business details already stored in `siteConfig`.
- It does not display or invent ICE, IF, RC, VAT, bank, or tax information.
- Each invoice belongs to one website project and one client.
- The existing business rule remains: a project is closed only after delivery
  is complete and full payment has been received.
- Deposits, partial payments, credit notes, and multi-project invoices remain
  outside this version.

## Architecture

### Existing Project Record

`crm_projects` remains the source of truth for:

- Client and originating lead
- Project name and website type
- Goals, pages, features, languages, and references
- Confirmed project amount
- Target launch date
- Domain name and domain readiness
- Content, brand, and hosting readiness
- Delivery status
- Developer notes

Add `assigned_developer_email`, linked to an authorized `team_members` record.
The value is optional so a project can remain unassigned during briefing.

### Project Work Items

Add `project_work_items`, a normalized table used for milestones, tasks, and
launch checks:

- `id`
- `project_id`
- `kind`: `milestone`, `task`, or `delivery_check`
- `title`
- `details`
- `status`: `todo`, `in_progress`, `blocked`, `done`, or `skipped`
- `priority`: `low`, `normal`, `high`, or `urgent`
- `due_on`
- `assigned_to`
- `required`
- `position`
- `completed_at`
- `created_at`
- `updated_at`

The shared table keeps ordering, deadlines, completion, realtime updates, and
reporting consistent without maintaining three parallel systems.

New projects receive a practical default launch checklist:

- Client approved the final website
- Responsive layouts checked
- Forms and conversion actions tested
- Domain connected
- Production hosting verified
- Analytics and conversion tracking verified
- SEO titles, descriptions, sitemap, and robots checked
- Final backup and handover completed

Existing active projects receive missing default checks during migration.
Closed projects are not modified.

### Invoices

Add `invoices` with immutable issued snapshots:

- `id`
- `project_id`
- `client_id`
- `finance_transaction_id`
- `number`
- `status`: `draft`, `issued`, `paid`, or `void`
- `issued_on`
- `due_on`
- `paid_on`
- `currency`, fixed to `MAD`
- `subtotal`
- `total`
- `notes`
- `seller_snapshot`
- `customer_snapshot`
- `created_by`
- `created_at`
- `updated_at`

Add `invoice_lines`:

- `id`
- `invoice_id`
- `description`
- `quantity`
- `unit_price`
- `line_total`
- `position`

A draft is prefilled with one line for the website project and the confirmed
project amount, but the team can edit line descriptions and amounts before
issue.

Add an annual `invoice_sequences` counter. Invoice numbers are allocated only
when the team issues a draft, using a locked database function. The format is
`WR-YYYY-####`. Number allocation must be concurrency-safe, numbers must be
unique, and issued or voided numbers must never be reused.

Draft invoices are editable. Issued, paid, and void invoices are immutable
except for explicit status transitions. Voiding preserves the number and
snapshot.

When a project closes:

- The existing project-close trigger records one paid Finance transaction.
- Any issued invoice linked to that project becomes paid and links to that
  Finance transaction.
- If no invoice exists, the user can generate a paid invoice from the closed
  project afterward.

## Security and Data Integrity

- All new tables use row-level security.
- Authorized team members may read workspace and invoice data.
- Direct writes from authenticated clients are revoked.
- Mutations run through `security definer` RPC functions that verify
  `is_team_member()`.
- Work-item mutations validate project ownership, allowed statuses, dates,
  assignment, and string lengths.
- Invoice issue uses a database transaction and a locked annual sequence row.
- Issued invoice seller and customer details are stored as immutable snapshots
  so later contact changes cannot rewrite historical documents.
- Project closure is rejected when required launch checks exist and any remain
  incomplete.
- Existing optimistic concurrency on `crm_projects.updated_at` remains in
  place.

## User Experience

### Project Workspace

The existing project area inside the client page remains the entry point. It
uses four focused views:

1. **Brief**: overview, goals, pages, features, languages, references, and
   client assets.
2. **Work**: assigned developer, project deadline, milestone progress, and
   actionable tasks.
3. **Launch**: domain and hosting details, launch readiness, and the required
   delivery checklist.
4. **Invoice**: draft, issue, payment status, and printable documents for the
   selected project.

The selected client project remains visible while switching views. Each
project card in the delivery pipeline continues to open the correct project.

### Desktop

- Preserve the existing full-width CRM shell and brand colors.
- Keep client context concise above the workspace.
- Use a compact project selector and a restrained tab bar.
- Show milestones as a progress rail and tasks as dense rows, not decorative
  cards.
- Each row exposes status, owner, due date, priority, edit, and completion
  without opening multiple dialogs.
- Keep historical and technical client details in the existing side drawers.

### Phone

- Use a compact selected-project control.
- Use large tap targets of at least 44 pixels.
- Replace drag-only interactions with explicit status menus.
- Stack task details and place the primary action within thumb reach.
- Keep the global mobile navigation and sign-out accessible.
- Avoid horizontal scrolling.

### Invoices

- The Invoice view shows one clear empty state before a draft exists.
- Creating a draft preloads client, project, amount, and one line item.
- Issuing displays a confirmation that the number and document become locked.
- The invoice document uses a dedicated protected route:
  `/admin/invoices/[id]`.
- The document includes WeReact branding, seller and customer details, invoice
  number, dates, project, line items, totals, notes, and status.
- A `Print / Save as PDF` action uses browser print CSS. No server-side PDF
  dependency is required for Cloudflare.

## Error Handling

- Validation errors appear next to the affected workspace or invoice action.
- Stale project edits ask the user to refresh instead of overwriting changes.
- Duplicate issue attempts return the existing invoice number.
- Invoice issue failures never consume or expose an uncommitted number.
- Closing with incomplete required launch checks names the remaining checks.
- Missing confirmed amount prevents invoice issue and project closure.
- Database migration errors remain distinguishable from ordinary save errors.

## Realtime and Refresh

Add `project_work_items`, `invoices`, and `invoice_lines` to the realtime
publication. The client detail route refreshes when any selected project work
or invoice data changes.

## Testing

Automated tests must cover:

- Work-item parsing, statuses, priorities, dates, and assignments
- Default launch checklist migration
- Required checklist enforcement before closure
- Invoice draft validation and totals
- Sequential annual invoice numbering
- Unique numbers under repeated issue requests
- Immutable issued invoices
- Project-close invoice payment linkage
- Team-only policies and RPC write boundaries
- Client detail queries and realtime subscriptions
- Desktop and mobile workspace controls
- Protected invoice route and printable document content

Browser verification must cover:

- Adding and completing tasks on desktop
- Updating a task and checklist item on phone
- Creating and issuing a draft invoice
- Printing the invoice layout
- Closing a fully checked project and seeing both the paid invoice and Finance
  transaction
- Confirming an unauthenticated visitor cannot access workspace or invoices

## Success Criteria

- The team can operate a project from briefing through paid delivery without
  using an external task tracker.
- Karim can inspect progress and update tasks from a phone.
- The developer has one clear source for requirements, deadlines, domain,
  hosting, and launch checks.
- Every issued invoice receives a safe sequential number and remains
  historically accurate.
- Closing a project keeps delivery, invoices, and Finance synchronized without
  duplicate revenue.
