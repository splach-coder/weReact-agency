# WeReact Agency Operations Dashboard

## Objective

Turn the private CRM into the daily operating system for WeReact. The dashboard must let the owner and seller see priorities, move leads and website projects, communicate with newsletter subscribers through Resend, and understand company finances without leaving the workspace.

## Information Architecture

The authenticated admin area uses one persistent shell:

- **Overview**: company pulse, immediate actions, sales and delivery summaries, recent finance activity.
- **Pipeline**: the existing sales, website delivery, closed, and lost workflows.
- **Newsletter**: subscriber health, campaign composer, audience list, and send history.
- **Finance**: revenue, expenses, net result, outstanding income, monthly trend, and transaction ledger.

Desktop uses a narrow fixed sidebar inspired by mature operations software. Mobile uses a compact header and bottom navigation so Karim can reach every primary module with one thumb. The public `·wereact·` wordmark and the existing CRM palette remain the visual identity.

## Dashboard Experience

The overview is compact and decision-led. It shows:

1. Revenue, net result, open leads, and active projects.
2. A priority queue for overdue follow-ups, new enquiries, and launches approaching.
3. Sales pipeline distribution and project delivery distribution.
4. A six-month cashflow chart using accessible CSS bars.
5. Recent financial activity and direct links to the relevant module.

No decorative room, generic analytics, or vanity charts are included.

## Newsletter

Subscribers remain stored in Supabase. The admin can search subscribers and compose a plain, branded campaign with subject, preview text, and message content. Sending happens server-side through Resend in bounded batches. Each subscriber receives an individual message with an unsubscribe link; addresses are never exposed to other recipients.

Each campaign stores audience size, sent/failed counts, sender, send time, subject, and content. Sending is restricted to authenticated `team_members`. Subscriber status can be changed between subscribed and unsubscribed from the admin.

## Finance

The finance model stores income and expense transactions in MAD. Entries include amount, category, date, status, optional client/project relation, reference, and a private note. Income can be pending or paid; expenses can be planned or paid.

The overview computes:

- paid revenue
- paid expenses
- net cash result
- pending income
- margin percentage
- six-month income and expense totals

This is operational bookkeeping, not a replacement for legal accounting.

## Security

All admin pages keep the existing Google-authenticated allowlist. New database tables enable RLS, deny anonymous access, and grant authenticated access only through policies that verify membership in `team_members`. Newsletter sending and transaction writes run in server actions after the same authorization check used by the CRM.

Public unsubscribe requests use unguessable UUID tokens and expose no subscriber data.

## Error Handling

- Missing optional tables show a calm setup state instead of breaking the CRM.
- Failed newsletter recipients are counted and the campaign is recorded as partial or failed.
- Finance forms validate amount, date, type, status, and bounded text fields server-side.
- Server errors return actionable messages and never expose provider or database secrets.

## Responsive Design

Desktop is full width with a 232px sidebar and dense content. Tablet uses a narrower icon-forward sidebar. Mobile removes the sidebar, keeps the wordmark in a compact top bar, and exposes the four modules in a fixed bottom navigation. Data tables become stacked rows while keeping primary actions visible.

## Verification

- Unit tests cover dashboard metrics, finance validation, newsletter validation, and security migration guarantees.
- TypeScript, ESLint, and the full test suite must pass.
- Desktop and phone flows are checked in the browser, including authentication, navigation, composer validation, finance entry, and overflow.
