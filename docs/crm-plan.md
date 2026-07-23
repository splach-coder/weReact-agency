# WeReact CRM — build plan (custom, on Supabase)

_Owned CRM architecture: Supabase for storage + auth, a Next.js dashboard for the seller, and a focused lead pipeline. Decided 2026-07-20._

## Current flow (what we're replacing)
Contact form → `/api/contact`:
1. Store lead in Supabase `leads` (source of truth — keep).
2. Email owner → **personal Gmail** (fix: route to a pro inbox).
3. Client confirmation email runs after the response (keep).


## Target architecture
```
Contact form ─┐
WhatsApp lead ─┼─► /api/contact ─► Supabase (leads + events)  ◄── source of truth
(future)      ─┘                     │
                                     ├─► Email to PRO inbox  (rich, "Open in CRM" + quick-action links)
                                     └─► Realtime push ─► /admin dashboard (live)

Seller ─► /admin (Supabase Auth login) ─► pipeline, lead detail, notes, status, follow-ups
      └─► or triage straight from the notification email (signed magic-link actions)
```

## Data model (Supabase)
Extend `leads` (keep existing columns): add
- `assigned_to text` · `estimated_value numeric` · `next_follow_up timestamptz` · `last_contacted_at timestamptz`

New table `lead_events` (activity timeline):
- `id uuid pk` · `lead_id uuid fk→leads` · `created_at` · `author text` · `kind text` (created|note|status_change|email_sent|contacted) · `body text` · `meta jsonb`

`team_members` table (access allowlist): `email text pk` · `name` · `role` (owner|seller).

**RLS:** service_role (server) bypasses; `authenticated` users may read/write `leads` + `lead_events` **only if their email is in `team_members`**. Public/anon: none. Trigger keeps `updated_at` fresh + logs a `created` event on insert.

## Auth
Supabase **magic-link** (passwordless), public sign-up disabled. Only emails in `team_members` can get in (enforced by RLS + an app-side check). Add you + your seller.

## Dashboard (`/admin`, outside `[locale]` — internal tool)
- `/admin/login` — magic link.
- `/admin` — leads as a **pipeline board** (New → Contacted → Qualified → Won/Lost) + a filterable table (status, source, date, search).
- `/admin/leads/[id]` — full detail: contact info, the **attribution** (which ad/UTM/click produced the lead — ties back to your Ads spend), message, **notes timeline**, one-click status changes, follow-up date, estimated value.
- **Realtime**: new leads appear live + a toast, no refresh.
- Built with `@supabase/ssr` (cookie sessions; works on both Vercel and Cloudflare Workers).

## Notification reshape (`/api/contact`)
- **Owner email → PRO inbox** (new `LEADS_INBOX` env), richer template with an **"Open in CRM"** button (`/admin/leads/{id}`) and **magic-link quick actions** ("Mark contacted", "Mark qualified") that update status from the inbox with no login — secured by an HMAC-signed token (`/api/leads/[id]/quick`).
- Keep lead storage and notifications inside the owned Supabase CRM.
- Keep the client confirmation email.

## Phases
1. **Foundation** — schema migration + `@supabase/ssr` client + auth + `team_members` allowlist + RLS. Exclude `/admin` from the i18n middleware matcher.
2. **Dashboard** — login, leads list/board, lead detail, status + notes, realtime.
3. **Notifications** — pro-inbox email + CRM link + signed quick-actions.
4. **Polish** — follow-up reminders, saved filters, CSV export, WhatsApp-lead intake.

## Open items
- **Receiving mailbox:** Resend only *sends*. For lead emails to land in a pro inbox the seller opens, `wereact.agency` needs a real mailbox (Google Workspace / Zoho MX) — or notifications go to a Gmail you actually check. Which is it?
- **Pipeline stages:** keeping the existing `new / contacted / qualified / won / lost`. Change if you sell differently.
- **Branch:** build on a `crm-dashboard` branch off `master` (independent of the Cloudflare migration; merges cleanly into both).
