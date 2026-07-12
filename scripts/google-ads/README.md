# Google Ads API connection

Read-only-first tooling to let us pull the WeReact Google Ads account data
(campaigns, spend, clicks, conversions, **search terms**, geo, keywords) and
diagnose where budget is going. Everything here is **zero-dependency** — it
uses the Google Ads REST API over native `fetch`, so there is nothing to
install.

> ⚠️ **Timeline:** getting a Developer Token approved by Google usually takes
> **1+ business days**. If you need answers today, export the data manually
> instead (see [FAST PATH](#fast-path-no-api-needed-5-minutes) at the bottom) —
> it contains the same numbers.

---

## What you need to collect (one-time)

You need **five** values. Put them in `.env.local` at the repo root (never
commit them — `.env.local` is git-ignored).

| Env var | Where it comes from |
|---|---|
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Google Ads Manager (MCC) → Tools → **API Center** |
| `GOOGLE_ADS_OAUTH_CLIENT_ID` | Google Cloud Console → Credentials → OAuth client |
| `GOOGLE_ADS_OAUTH_CLIENT_SECRET` | same OAuth client |
| `GOOGLE_ADS_REFRESH_TOKEN` | minted by `get-refresh-token.mjs` (step 3) |
| `GOOGLE_ADS_CUSTOMER_ID` | your Ads account number, the `123-456-7890` at the top-right of Google Ads (digits only) |

Optional:

| Env var | When needed |
|---|---|
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | if you access the account **through a Manager/MCC** — set it to the MCC's ID (digits only) |
| `GOOGLE_ADS_API_VERSION` | defaults to `v18`. **Check the [release notes](https://developers.google.com/google-ads/api/docs/release-notes) and set the current version** (Google ships ~3/year, so this changes). |
| `GOOGLE_ADS_START_DATE` / `GOOGLE_ADS_END_DATE` | `YYYY-MM-DD` window covering your campaign. If unset, defaults to `LAST_30_DAYS`. |

---

## Step 1 — Developer Token (the slow part, start this first)

1. You need a **Google Ads Manager account (MCC)**. If you don't have one, create
   one at <https://ads.google.com/home/tools/manager-accounts/> (free) and link
   your existing ad account to it.
2. In the **Manager** account: **Tools & Settings → Setup → API Center**.
3. Accept the terms and copy the **Developer token**.
4. It starts with **Test access** (can only hit test accounts). Click **Apply
   for Basic Access** and fill the short form. Approval typically lands in a day
   or a few. You cannot pull the real account until Basic Access is granted.

## Step 2 — OAuth client (Google Cloud, ~10 min)

1. Go to <https://console.cloud.google.com/> → create a project (e.g.
   `wereact-ads`).
2. **APIs & Services → Library** → search **Google Ads API** → **Enable**.
3. **APIs & Services → OAuth consent screen**: choose **External**, fill app
   name + your email, add your Google account under **Test users** (so you can
   authorize while the app is in "Testing"). Add the scope
   `https://www.googleapis.com/auth/adwords`.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
   Choose application type **Desktop app**. Create it.
5. Copy the **Client ID** and **Client secret** into `.env.local`:
   ```
   GOOGLE_ADS_OAUTH_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
   GOOGLE_ADS_OAUTH_CLIENT_SECRET=xxxxxxxx
   ```

## Step 3 — Mint the refresh token

From the repo root:

```bash
npm run ads:token
```

It opens a Google consent screen in your browser (and also prints the URL if it
can't open one). Sign in with the account that has access to the ad account,
approve, and it prints your **refresh token**. Paste it into `.env.local`:

```
GOOGLE_ADS_REFRESH_TOKEN=1//0g....
```

## Step 4 — Confirm the connection & find your account ID

```bash
npm run ads:list
```

This lists every ad account your login can reach (their customer IDs). Put the
one you advertised with into `.env.local` as `GOOGLE_ADS_CUSTOMER_ID` (digits
only, no dashes). If it only shows a Manager account, set
`GOOGLE_ADS_LOGIN_CUSTOMER_ID` to that MCC and `GOOGLE_ADS_CUSTOMER_ID` to the
child account you ran ads on.

## Step 5 — Pull the diagnostic report

```bash
npm run ads:pull
```

Writes JSON to `google-ads-report/` (git-ignored) and prints a summary to the
terminal: total spend, clicks, conversions, **campaign type**, the network
split (Search vs Search Partners vs Display/YouTube — this is usually where
wasted money hides), the **top search terms by spend**, geo, and keywords.
**Paste that terminal summary back to Claude** and we'll diagnose the 3000 DH.

---

## FAST PATH (no API needed, ~5 minutes)

If you don't want to wait for token approval, this gets Claude the same data
today. In Google Ads (<https://ads.google.com>):

1. **Campaign type & spend:** Campaigns view → set the date range to cover your
   campaign → screenshot the table (make sure the "Campaign type" column is
   shown). Add columns for Cost, Clicks, Impr., Conversions if missing.
2. **Search terms (most important):** left menu → **Insights & reports →
   Search terms** (or under the Keywords section) → set the date range →
   **Download → CSV**. This shows the *actual* Google searches you paid for.
3. **Where clicks came from:** **Insights & reports → When and where ads
   showed → User locations** (or "Locations") → download CSV.
4. **Networks:** in the Campaigns table, segment by **Network (with search
   partners)** → screenshot.

Send those to Claude and we can find the leak without waiting on the API.
