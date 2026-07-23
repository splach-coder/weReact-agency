# WeReact Smart Agency Platform Design

**Date:** 2026-07-23
**Status:** Approved direction, implementation specification

## Goal

Turn the existing WeReact operations dashboard into a connected agency operating system that moves an enquiry through qualification, proposal, approval, delivery, invoicing, payment, reporting, and follow-up while keeping consequential actions under human control.

## Existing Foundation

The implementation extends the current production system instead of replacing it:

- Supabase remains the source of truth for team auth, leads, clients, projects, work items, invoices, finance, and newsletter data.
- Cloudflare remains the application and automation runtime.
- Resend remains the transactional and newsletter email provider.
- The existing responsive admin shell, CRM pipeline, project workspace, invoice document, and finance dashboard remain the primary internal interfaces.
- The existing project and invoice integrity constraints remain authoritative.

## Product Principles

1. Automation proposes and coordinates; a team member approves prices, proposals, contracts, outbound client messages, payments, and irreversible lifecycle changes.
2. Every automated action is idempotent, retryable, attributable, and visible in an audit history.
3. The CRM remains useful when OpenAI, WhatsApp, Resend, or another external provider is unavailable.
4. Mobile use is first-class for the seller; dense configuration belongs in drawers or detail views, not the daily queue.
5. No unofficial WhatsApp browser automation is used. The integration targets the official WhatsApp Business Cloud API.
6. External integrations are activated only when their server-side credentials are configured. Missing credentials produce a clear admin status, never a broken workflow.
7. Personal data is minimized and retained for a defined business purpose. Client-facing links are scoped, expiring, revocable, and stored as digests rather than plaintext tokens.

## Architecture

### Event and Automation Core

Business mutations emit typed domain events such as `lead.created`, `lead.follow_up_due`, `proposal.approved`, `invoice.issued`, `email.delivered`, `project.blocked`, and `project.completed` into a Supabase outbox. Each event has a deterministic idempotency key, status, attempt count, next-attempt time, structured payload, and audit timestamps.

A dedicated Cloudflare automation Worker consumes pending events and starts durable Cloudflare Workflows. Workflow steps may sleep until a deadline, retry transient failures, wait for approval or webhook events, and write results back to Supabase. The Next.js application can also process a bounded batch through an authenticated internal endpoint for local development and operational recovery.

### Attention Inbox

The overview becomes a seller work queue, not only a metrics page. Attention items are generated from deterministic rules:

- New lead without first contact.
- Follow-up due or overdue.
- Proposal awaiting internal approval.
- Sent proposal without client response.
- Invoice due or overdue.
- Email bounced.
- Project milestone late, task blocked, or launch target at risk.
- External integration failure requiring action.

Items support priority, owner, due time, snooze, completion, source record, and one primary action. Completing the underlying work closes the attention item automatically.

### Communication Timeline

All client communication is normalized into one `communications` stream with channel, direction, provider id, delivery state, sender, recipient, subject, body summary, related lead/client/project/invoice/proposal, consent basis, and timestamps.

Resend webhook events update sent email records to delivered, opened, clicked, bounced, complained, or failed. Webhook signatures are verified and event processing is idempotent. Replies remain visible through manually logged activity until an inbound mailbox provider is configured.

The WhatsApp adapter supports official inbound webhooks, approved outbound templates, session messages, delivery receipts, opt-in state, and human handoff. Without Meta credentials, WhatsApp controls remain disabled with setup guidance while click-to-chat continues working.

### Proposal and Approval Flow

A proposal belongs to a lead and client and may reference a project. It contains a stable proposal number, status, currency, expiry date, scope, assumptions, timeline, line items, subtotal, discount, total, internal notes, and immutable seller/client snapshots once issued.

Statuses are `draft`, `internal_review`, `sent`, `viewed`, `accepted`, `declined`, and `expired`. Drafts are editable. Issued content is immutable; revisions create a new version. Sending requires a valid client email and explicit team confirmation. Acceptance records the client decision, timestamp, IP-derived audit metadata, and accepted version. Acceptance never marks money as paid.

An accepted proposal can create or connect a project, seed the project scope and milestones, and create a draft invoice using the accepted commercial snapshot. Existing project-launch and paid-revenue integrity rules remain unchanged.

### Client Portal

The portal is a focused client workspace available through a revocable, expiring access link. It provides:

- Proposal viewing and acceptance or decline.
- Website brief and missing requirements.
- Secure asset and document upload metadata, with files stored in a private Supabase Storage bucket.
- Milestone progress and target dates.
- Design, content, and delivery approvals.
- Issued invoices and payment state.
- Change requests and client comments.

Portal access never exposes another client, internal notes, finance margins, seller queues, or admin actions. Every write is validated server-side against the token scope and logged.

### AI Copilots

AI is implemented as three bounded copilots using the OpenAI Responses API with strict structured outputs:

- **Sales Copilot:** summarizes an enquiry, extracts requirements, scores completeness and fit, identifies risk, drafts a reply, and recommends one next action.
- **Project Copilot:** converts an approved brief into proposed tasks and milestones, detects missing assets, and drafts a client-safe progress update.
- **Growth Copilot:** summarizes channel and funnel performance, identifies conversion leaks, and produces SEO/content briefs grounded in the agency's stored data.

Copilot runs store model, prompt version, structured input hash, structured output, token/cost metadata, reviewer, approval state, and error state. Outputs never execute tools directly. A user reviews and applies a proposed action through existing validated server actions.

### Agency Intelligence

The dashboard calculates source-to-revenue performance from first-party records:

- Lead volume and response-time SLA.
- Qualification, proposal, acceptance, win, and loss rates.
- Average and median project value.
- Pipeline value and forecast by stage.
- Collected revenue, pending invoices, expenses, and cashflow.
- Delivery cycle time, overdue tasks, blocked projects, and launch reliability.
- Email delivery and engagement health.
- Revenue and win rate by source, service, and campaign attribution.

Metrics use explicit date ranges and definitions. No AI-generated number is presented as a financial metric.

## Data Model

New tables are protected with row-level security and team-member policies:

- `automation_events`: durable outbox and processing state.
- `attention_items`: actionable seller and delivery queue.
- `communications`: normalized outbound and inbound channel history.
- `communication_events`: provider delivery and engagement events.
- `proposals`, `proposal_versions`, and `proposal_lines`: commercial documents and immutable issued versions.
- `client_portal_links`: hashed scoped access links.
- `client_requests`: requirements, approvals, comments, and change requests.
- `client_assets`: private-storage object metadata.
- `copilot_runs`: structured AI suggestions, review, and cost metadata.
- `integration_health`: last success, failure, and configuration state for each provider.

Security-definer functions validate membership, state transitions, idempotency keys, immutable snapshots, and portal scopes. Direct writes to protected lifecycle tables are revoked from ordinary clients.

## Routes and Interfaces

- `/admin`: intelligence summary and attention inbox.
- `/admin/pipeline`: existing sales Kanban with automation and communication signals.
- `/admin/leads/[id]`: unified client timeline, proposal workspace, and copilot suggestions.
- `/admin/communications`: delivery health and conversations needing attention.
- `/admin/automation`: workflow runs, failures, retry controls, and integration status.
- `/admin/finance`: current finance plus receivables and proposal forecast.
- `/portal/[token]`: scoped client workspace.
- `/api/webhooks/resend`: verified Resend event ingestion.
- `/api/webhooks/whatsapp`: Meta challenge and verified message ingestion.
- `/api/internal/automation`: authenticated recovery processor.
- `/api/portal/[token]/*`: validated client portal actions.

Desktop keeps the current quiet, full-width operational design. Mobile uses a prioritized list with large primary actions rather than reproducing desktop tables or Kanban interactions.

## Reliability and Failure Handling

- Event producers and webhook handlers acknowledge only after durable persistence.
- Duplicate provider events and repeated workflow runs are harmless.
- Transient failures retry with capped exponential backoff; permanent validation failures move to a visible dead-letter state.
- External timeouts do not roll back the source CRM mutation.
- All outbound communication stores the exact approved content before provider submission.
- Integration health shows configuration, last success, last failure, and recommended action without exposing secrets.
- Daily database backup and restore verification remain infrastructure responsibilities and are surfaced as an operational check.

## Delivery Phases

### Phase 1: Operational Automation

Create the outbox, attention inbox, follow-up rules, integration health, and Resend delivery tracking. This phase makes the existing CRM proactively useful without requiring new vendor credentials.

### Phase 2: Commercial Workflow

Add proposals, immutable versions, internal approval, client sending, acceptance, project seeding, and draft invoice creation.

### Phase 3: Client Experience

Add scoped portal access, brief completion, approvals, requests, private asset metadata, milestones, and invoices.

### Phase 4: Intelligence and Channels

Add the three reviewed AI copilots, official WhatsApp adapter, automation observability, and complete source-to-revenue reporting. Provider-dependent controls remain configuration-gated.

## Testing and Acceptance

- Unit tests cover parsers, state machines, metric definitions, idempotency, token hashing, and AI structured-output validation.
- Migration tests assert RLS, revocation, search-path pinning, immutable snapshots, and authorized RPCs.
- Route tests cover webhook signatures, replay protection, portal isolation, and missing-provider configuration.
- Browser tests verify the seller's mobile attention flow, proposal send confirmation, portal proposal acceptance, and admin/client access separation.
- Production build must pass for OpenNext Cloudflare.
- No test sends a real client message, accepts a live proposal, or records production payment.

## Activation Requirements

The platform can deploy with provider features disabled. Activation later requires only server-side configuration:

- OpenAI API key and model/cost limits for copilots.
- Meta WhatsApp Business account, phone-number id, permanent token, app secret, webhook verify token, approved templates, and documented opt-in.
- Resend webhook signing secret.
- A payment-provider choice and credentials if online collection is added; until then, finance continues to record confirmed payments manually.