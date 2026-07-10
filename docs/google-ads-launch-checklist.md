# Google Ads and SEO Launch Checklist

## Required before traffic

1. Set the production domain in Google Search Console and submit `https://www.wereact.agency/sitemap.xml`.
2. Google Analytics is configured with `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0HRPEYEZXY`.
3. Create a Google Ads conversion action for qualified leads and add:
   - `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX`
   - `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=XXXXXXXXXXXX`
   - `NEXT_PUBLIC_GOOGLE_ADS_LEAD_VALUE=1`
   - `NEXT_PUBLIC_GOOGLE_ADS_LEAD_CURRENCY=MAD`
4. Verify the tag with Google Tag Assistant before launching spend.
5. Connect Google Ads and GA4, then import or mark the lead conversion as the primary campaign goal.
6. Add call, WhatsApp, and form-submit conversions in Ads only after confirming they are real lead actions.

## Recommended campaign setup

- Campaign type: Search first, Performance Max later after conversion volume exists.
- Locations: Marrakech first, then Morocco-wide campaigns split by city if budget allows.
- Languages: English and French campaigns separated if ad copy differs.
- Landing page: `/en/contact` for English ads and `/fr/contact` for French ads.
- Ad groups:
  - website design Marrakech
  - web agency Marrakech
  - website designer Morocco
  - tourism website design Morocco
  - landing page design Morocco
- Negative keywords to start:
  - free
  - template
  - job
  - course
  - tutorial
  - wordpress theme
  - cracked

## Tracking QA

Use a test URL such as:
`https://www.wereact.agency/en/contact?utm_source=google&utm_medium=cpc&utm_campaign=test_campaign&utm_term=website%20design%20marrakech&gclid=test`

Then submit the contact form and confirm the email body includes campaign attribution.
