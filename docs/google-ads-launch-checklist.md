# Google Ads Launch Checklist (rebuilt — $300 credit, ~18/07)

The importable campaign lives in `docs/google-ads-import/` (CSVs for Ads
Editor + `campaign.json` as the source of truth). Strategy background:
`docs/google-ads-rebuild-plan.md`.

## 1. Conversion actions (do FIRST — in Google Ads UI)

1. **Form lead (primary).** Conversions → Summary: confirm the existing
   conversion action for tag `AW-18245192967`, label `C9w5CPvkkc4cEIea_vtD`.
   Set: **Primary** goal · Counting: **One per click** · Value 1 MAD.
   The site now sends a `transaction_id` with every fire, so duplicates
   self-dedupe.
2. **WhatsApp click (new).** Create a conversion action: Website → name
   `WhatsApp click` · Category: Contact · Counting **One per click** ·
   **Secondary** goal (observe first; promote to Primary once real WhatsApp
   conversations correlate). Copy its **label** and set it in Vercel as
   `NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL`, then redeploy. The code
   (`trackWhatsAppLead`) starts firing it automatically.
3. **Enhanced Conversions.** On the form-lead action: Settings → turn ON
   **Enhanced conversions** → method **Google tag**. The site already sends
   hashed email/phone via `gtag('set','user_data',…)`.
4. **Calls.** Add a **call asset** to the campaign (+212 602-258009) with a
   "Calls" conversion action (Google forwarding numbers aren't available in
   Morocco, so call assets + the site's tel: link with GA4 intent events are
   the measurable path).

⚠️ **Env-var rule:** production works via in-code defaults
(`AW-18245192967` / `C9w5CPvkkc4cEIea_vtD`). NEVER set the
`NEXT_PUBLIC_GOOGLE_ADS_*` vars to placeholder text; set real values or leave
them unset. (The code now tolerates empty strings, but placeholders like
`AW-XXXXXXXXXX` would still break tracking.)

## 2. GA4 hygiene

1. Link GA4 (`G-0HRPEYEZXY`) ↔ Google Ads.
2. Mark **only `generate_lead`** as a GA4 key event. Do NOT import it into
   Ads as a conversion — the native AW tag is the single source of truth
   (importing both double-counts).
3. GA4 Admin → Data Streams → web stream → Enhanced measurement → gear →
   **disable "Page changes based on browser history events"** (the site sends
   its own SPA page_view; leaving both on double-counts page views).

## 3. Campaign import (Ads Editor)

1. Open Google Ads Editor → Account → Import → from the four CSVs in
   `docs/google-ads-import/` (in numbered order).
2. Set manually in the campaign settings (not importable via CSV):
   - Type: **Search** · Networks: UNCHECK "Search partners" AND "Display"
   - Locations: **Morocco** (country) · Location options: **Presence only**
   - Languages: **English, French, Arabic** (Arabic-UI users type FR keywords)
   - Bidding: **Maximize clicks, max CPC limit 5 MAD** · Budget **100 MAD/day**
   - AI Max: OFF · Broad match campaign setting: OFF
   - Auto-applied recommendations (account level): **OFF**
3. Extensions (campaign level, from `campaign.json` → extensions): callouts,
   structured snippet (Services — note: SEO deliberately removed), 4
   sitelinks, call asset. For FR ad groups, attach **FR sitelink variants**
   pointing at `/fr/...` URLs at ad-group level.
4. Ad-group max CPC starts at 5 MAD. If impression share is near zero after
   week 1, raise toward 7–10 MAD — do NOT loosen match types instead.

## 4. Tracking QA (must ALL pass before enabling the campaign)

1. Visit
   `https://www.wereact.agency/fr/contact?utm_source=google&utm_medium=cpc&utm_campaign=qa&gclid=QA_TEST_1`
   in a fresh private window: the preloader curtain must **skip** (paid-click
   bypass) and the page must be **fully French** (headline, form, buttons).
2. Submit the form with your real email. Verify:
   - Success modal appears (French) with a WhatsApp follow-up button.
   - Owner email arrives WITH the "Campaign attribution" block (utm/gclid/
     transaction_id).
   - Confirmation email arrives in **French**.
3. Tag Assistant (tagassistant.google.com) on the contact page: one
   page_view, `generate_lead` + `conversion` fire on submit with
   `transaction_id`, WhatsApp button fires `contact_intent` (+ `conversion`
   once the WhatsApp label env is set).
4. THE REAL TEST after enabling: click your own live ad once (search
   "création site web marrakech"), submit a test lead, then check Google Ads →
   Conversions shows it within ~3h. `gclid=QA_TEST_1` alone does NOT register
   in Ads — only a real ad click validates end-to-end.

## 5. First weeks

- Week 1: don't touch. Watch Search terms daily; add negatives (phrase) for
  any marketing/DIY/competitor junk that slips through.
- Send the Search terms report to Claude weekly → negative list + bid tuning.
- After ~15–30 conversions: switch bidding to Maximize Conversions, then tCPA.
- Qualified-lead upload: leads in Supabase store `gclid` + `transaction_id` —
  when a lead becomes a real client, upload it as an offline conversion
  (script planned in `scripts/google-ads/` once API Basic access is approved).
