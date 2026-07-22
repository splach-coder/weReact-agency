# WeReact SEO Growth Operations

This checklist turns the site's technical SEO foundation into a repeatable publishing and measurement process. Account access, reviews, and backlinks must use verified information and approved sources only.

## Search engine setup

1. Verify `https://www.wereact.agency` in Google Search Console.
2. Import the verified Google Search Console property into Bing Webmaster Tools.
3. Submit `https://www.wereact.agency/sitemap.xml` in both tools.
4. Inspect the English and French homepages, the tourism hub, the Moroccan-business hub, and the international-client hub in Google and Bing.
5. Request indexing only after the deployed page returns `200`, has its final canonical URL, and appears in the sitemap.

## IndexNow after deployment

1. Confirm `https://www.wereact.agency/7c48682a-ebbb-4816-83b4-28ae3c0a2cc3.txt` returns `200` and contains only the IndexNow key.
2. Deploy and confirm the sitemap contains the intended public URLs.
3. Run `npm run seo:indexnow` from the deployed revision.
4. Treat a `200` or `202` response as accepted. Investigate any other status before retrying.

Do not run the command during local builds or before production deployment. IndexNow helps discovery; it does not guarantee indexing or ranking.

## Local business consistency

Keep the Google Business Profile name, category, phone, email, Marrakech location, service area, opening hours, and social links aligned with `src/config/site.ts`. Update the site and business profiles together whenever real contact details change.

## Authority work

- Ask real clients for approved reviews after successful delivery.
- Pursue relevant editorial links, partner references, tourism associations, local business features, and genuine project mentions.
- Avoid bulk-directory submissions, paid-link schemes, fabricated reviews, and unverified performance claims.
- Add measurable case-study outcomes only when the client has approved the numbers and the evidence can be retained.

## Monthly review

Review qualified leads by project type, budget range, timeline, source page, and conversion method. Compare landing-page performance, non-brand search queries, locale, audience hub, and conversion rate. Use the findings to improve weak pages and publish content that answers recurring qualified-client questions.