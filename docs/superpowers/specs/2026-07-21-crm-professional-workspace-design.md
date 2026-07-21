# WeReact Professional CRM Workspace

## Objective

Turn the current CRM into a fast operational workspace for Karim's sales work and Anas's website delivery work. The interface must keep sales and production separate, prioritize everyday actions, work especially well on phones, and hide technical metadata until requested.

## Product Model

The CRM has three distinct layers:

1. **Sales pipeline** manages the commercial relationship with a lead.
2. **Client workspace** holds contact details and one or more website projects.
3. **Project delivery** tracks what is being built after the sale.

Sales stages and production stages are never mixed.

### Sales Stages

- **new**: New enquiry
- **contacted**: First contact made
- **discovery**: Needs discussed
- **proposal_sent**: Proposal sent
- **negotiation**: Decision pending
- **won**: Client won
- **lost**: Lost

The desktop pipeline supports drag and drop. A drop performs a validated server mutation and rolls the card back if saving fails. Phone users update the same stage through a native select control.

### Project Stages

- **briefing**: Briefing
- **ready_for_dev**: Ready for development
- **building**: Building
- **review**: Client review
- **launched**: Launched
- **paused**: Paused

Each client may own multiple projects. Every project has independent scope, domain, budget, dates, assets, and delivery status.

## Dashboard

The default dashboard is the sales pipeline.

Each lead card shows only:

- client name and company
- sales stage
- next follow-up when relevant
- project count or current project name
- one-click WhatsApp, call, email, and open actions

Assigned-user text is removed because Karim owns sales by policy. Large decorative metrics are reduced to a compact work summary. Cards are draggable on pointer-based desktop devices and keyboard/status-select operable everywhere.

The dashboard may offer a compact list view, but does not expose raw IDs, attribution, project internals, or estimated technical details.

## Client Workspace

The client page opens with:

- client identity and company
- copyable email, phone, and WhatsApp values
- direct Email, Call, and WhatsApp actions
- next sales action and sales stage

Repeated owner labels are removed.

Projects appear as a clean project switcher labelled by real intent. The empty-state action is **Add another website**, with supporting text explaining that each website keeps its own scope and delivery record.

The active project exposes:

- project name and website type
- domain name and domain state
- business goal
- requested pages and features
- languages
- content, brand, hosting, and domain readiness
- reference websites
- confirmed budget and target launch
- notes for development
- production stage

The page uses sections and tabs instead of stacking every field in a continuous form. The main view is **Overview**; **Scope**, **Assets**, and **Delivery** organize the editable brief.

## Secondary Information

Low-frequency information is collapsed by default:

- **History** contains notes and status events.
- **Acquisition details** contains campaign attribution.
- **Technical details** contains lead UUIDs, transaction IDs, source values, timestamps, and raw metadata.

These panels are available for investigation but never compete with the main workflow.

## Contact Actions

Email, phone, and WhatsApp values have two adjacent behaviors:

- clicking the value opens the appropriate destination
- clicking the copy icon copies the exact value and announces success accessibly

WhatsApp uses a recognizable WhatsApp icon and green treatment without turning the entire CRM green.

## Newsletter Storage

Newsletter submission continues to create/update the Resend contact and segment. It also upserts a protected **newsletter_subscribers** row in Supabase with:

- normalized email
- status (**subscribed** or **unsubscribed**)
- locale
- source
- consent timestamp
- created and updated timestamps

The API returns success only when durable Supabase storage succeeds. Resend failures remain observable but do not erase a valid stored subscription; the API reports a temporary delivery-sync failure for retry.

The table uses row-level security with no public read policy. Server-side writes use the service role only.

## Security

- **/crm/login** remains the public entry route.
- Only Google OAuth users in **team_members** are authorized.
- Supabase row-level security and security-definer RPCs remain the mutation boundary.
- Drag-and-drop never writes directly from the browser.
- All stage inputs are allowlisted on the server and in PostgreSQL constraints.
- Technical data and newsletter records are never exposed to anonymous clients.

## Visual System

The CRM follows a restrained operational design:

- flat full-width work areas, not nested decorative cards
- subtle lines and one surface elevation level
- Nohemi typography with compact headings
- WeReact green used for actions and status emphasis
- readable 14-16px operational text
- 44px minimum touch targets
- no horizontal overflow
- limited radius of 4-7px
- no decorative gradients, oversized hero typography, or explanatory feature copy

## Responsive Behavior

Desktop prioritizes the drag-and-drop pipeline and split client workspace. Phone prioritizes:

1. contact actions
2. next sales action
3. current project
4. project brief sections
5. collapsed history and technical panels

Sticky phone controls may be used only for direct client contact and must not cover content.

## Error Handling

- Optimistic stage updates roll back and show a concise inline notice on failure.
- Project and sales saves preserve entered values when a server mutation fails.
- Copy actions announce success or failure.
- Newsletter writes log provider failures without leaking credentials or internal responses.

## Verification

- Unit tests cover stage validation, project domain normalization, and newsletter payloads.
- Security tests cover the new migration, RPC grants, and RLS.
- Production build and TypeScript must pass.
- Browser testing covers desktop drag-and-drop, mobile stage fallback, copy/contact actions, hidden metadata panels, secure redirect, and horizontal overflow.

