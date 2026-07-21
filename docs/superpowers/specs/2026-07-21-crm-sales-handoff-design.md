# WeReact CRM Sales Handoff Design

## Goal

Give Karim a fast mobile sales workspace and give Anas a complete, structured website brief after qualification.

## Workflow

New lead -> Contacted -> Discovery -> Qualified -> Ready for Anas -> Building -> Delivered.

Karim is the default seller for every website lead. The interface does not expose assignment controls. A client can own multiple projects. Each project keeps its own scope, requirements, budget, dates, and delivery status.

## Data model

- `clients`: normalized client identity and business information.
- `crm_projects`: one project per opportunity, linked to a client and optionally to the originating lead.
- Existing `leads`: sales inbox, contact status, follow-up, source, and campaign attribution.
- Existing `lead_events`: append-only notes and workflow history.

The project brief records project name/type, goals, pages, features, languages, content status, branding status, domain/hosting status, reference websites, budget, target launch date, and a development handoff note.

## Roles and security

- `/crm/login` is the public entry to the private workspace.
- Only Google OAuth identities whose email exists in `team_members` can read or mutate CRM data.
- Karim is `seller`; Anas is `owner`.
- Database RLS and security-definer RPCs remain the authorization boundary. Hidden URLs are never treated as security.
- Seller and owner can complete discovery and project briefs; delivery-only controls can be extended later for the owner.

## Mobile UX

The phone dashboard opens on `My day`: new enquiries, overdue follow-ups, and projects ready for handoff. Lead cards show only client, need, stage, next action, and a 44px one-tap WhatsApp control. Pipeline stages become a horizontally scrollable segmented filter on phones.

The lead detail page uses a sticky bottom contact bar and three compact sections: client request, sales follow-up, and project brief. The brief is a guided form with clear labels and save/handoff feedback. Desktop retains a denser overview without exposing unused assignment fields.

## Acceptance criteria

- New and existing leads default to Karim with no assignment picker.
- One client can have multiple projects.
- Karim can create and update a structured project brief from a phone.
- `Ready for Anas` projects are visible immediately in the dashboard.
- `/crm/login` works while unauthorized users cannot access CRM records.
- No horizontal overflow at 375px; all primary touch targets are at least 44px.
