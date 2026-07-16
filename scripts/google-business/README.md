# Google Business Profile automation

Lets Claude update the GBP profile programmatically (description, website,
categories) and publish update posts — the same OAuth pattern as `google-ads/`,
reusing that Desktop-app OAuth client.

## ⚠️ Read first — what the API can and can't do
- **Can:** description, website, categories, hours, phone, service area; create
  **posts**; upload **photos**.
- **Cannot:** the **services-with-prices list** — Google keeps that UI-only.
  Add those 7 services by hand once (see `docs/outreach/gbp-kit.md`).
- **Access is gated:** you must request access and Google approves it (days).

## One-time setup

### 1. Enable the APIs (same Google Cloud project as Ads)
In console.cloud.google.com → APIs & Services → Enable, turn on **all** of:
- My Business Account Management API
- My Business Business Information API
- Google My Business API (this is the v4 API — needed for posts/photos)

### 2. Request access (the gated step)
Fill the access form: https://support.google.com/business/contact/api_default
Use your project number + the email that manages the profile. Say you're the
business owner automating your own single profile. Approval usually lands in a
few days. Until then, the scripts return an "API not enabled / not approved"
error — that's expected.

### 3. Mint a refresh token (once approved)
```
npm run gbp:token
```
Consent in the browser (use the Google account that manages WeReact agency),
then paste the printed line into `.env.local`:
```
GOOGLE_BUSINESS_REFRESH_TOKEN=1//...
```

### 4. Get your account + location IDs
```
npm run gbp:pull
```
Add the two names it prints to `.env.local`:
```
GOOGLE_BUSINESS_ACCOUNT_ID=accounts/1234567890
GOOGLE_BUSINESS_LOCATION_ID=locations/0987654321
```

### 5. Confirm the category resource names
```
npm run gbp:pull -- --categories web
npm run gbp:pull -- --categories marketing
```
If the `categories/gcid:*` names differ from those in `profile.json`, fix them there.

## Usage
```
npm run gbp:apply             # DRY RUN — prints the diff, writes nothing
npm run gbp:apply -- --apply  # write description + website + categories
npm run gbp:post -- "Devis gratuit le jour même 🚀 Site vitrine dès 2 000 MAD."
```

## Files
- `get-refresh-token.mjs` — OAuth loopback, business.manage scope
- `pull-account.mjs` — list accounts/locations; `--categories <word>` lookup
- `profile.json` — desired description/website/categories (edit this)
- `apply-profile.mjs` — patch the location (dry-run unless `--apply`)
- `create-post.mjs` — publish an update post
- `_lib.mjs` — shared env loader + token exchange + fetch helper
