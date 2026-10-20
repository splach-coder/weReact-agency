# Cold-outreach autopilot

Sends WeReact's first emails and follow-ups to prospects, from
`hello@wereact.agency` via Resend. Lead data lives in `/outreach-data`
(gitignored — this repo is public; never commit it).

## How it runs
- No scheduler: Anas starts each day's run by asking Claude ("start today's outreach").
- Each run: checks bounces → checks the hello@ inbox for replies → sends due
  follow-ups (day 3, day 8) → sends new first emails, up to
  `OUTREACH_DAILY_CAP` (default 10) per day.
- A lead stops getting emails as soon as they reply, bounce or complain.
  After 3 emails with no reply they're closed as `no_reply`.

## Commands
```
node scripts/outreach/send.mjs --dry-run --any-day   # preview, sends nothing
node scripts/outreach/report.mjs                     # scoreboard
```

## Setup (.env.local)
```
OUTREACH_IMAP_PASSWORD=...   # hello@wereact.agency mailbox password (Private Email)
OUTREACH_DAILY_CAP=10        # optional
```
Without the IMAP password, first emails still go out but **follow-ups are
paused**, so nobody who already replied gets chased.

## Lead format (`outreach-data/leads.json`)
`status`: queued → contacted → replied | no_reply | bounced | unsubscribed, then won/lost by hand.
Only `channel: "email"` leads with a hand-written `first_email` are sent — no
generic blasts. WhatsApp leads are for the owner to send from their phone.
