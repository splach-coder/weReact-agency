# Project Lifecycle Controls Design

## Goal

Let an authorized team member correct an accidentally closed project or remove an unwanted project without leaving false revenue in Finance.

## Behavior

### Reopen a closed project

- Available only when the project status is `launched`.
- Return the project to `review`.
- Delete the unique automatic `finance_transactions` row whose source is `project_close`.
- If an invoice was marked paid by that transaction, clear the finance link, paid date, and return it to `issued`.
- Keep the client, lead, project work, invoice number, notes, and history.

### Archive a project

- Presented in the UI as **Delete project**.
- Set `deleted_at` and `deleted_by` instead of physically deleting accounting records.
- Remove the automatic `project_close` finance transaction.
- Void a non-draft invoice and clear its payment link. Preserve the invoice and number for audit history.
- Hide archived projects from the dashboard, project selector, finance project selector, overview metrics, and normal lead workspace.
- Keep the client, lead, notes, and activity history.

## Interface

- Closed-project cards expose a compact actions menu.
- **Reopen in Review** requires confirmation and immediately moves the project to Website Delivery.
- **Delete project** uses destructive styling and a stronger confirmation explaining that automatic revenue will be removed.
- Controls work identically on desktop and phone.
- Success and error feedback is announced and the dashboard updates immediately.

## Data Safety

- Both operations are PostgreSQL security-definer RPCs restricted to authenticated team members.
- Each operation locks the project row before changing related records.
- Finance reversal, invoice correction, project status/archive state, and activity logging happen in one transaction.
- Repeated calls are safe and do not create duplicate finance changes.
- Existing manual finance transactions are never touched.
