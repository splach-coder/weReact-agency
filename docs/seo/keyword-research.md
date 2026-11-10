# Keyword research — WeReact agency

Researched November 10, 2026 for the Moroccan market (French first, English second). The full table is
[`keyword-research.csv`](keyword-research.csv): 210 keywords, each with its client segment, intent, priority, target page, the
evidence that people search it, and its **monthly search volume in Morocco** (`volume_ma`, Google Ads Keyword Planner,
average of the last 12 months). Raw inputs are in [`data/`](data/).

## Who we are writing for (ideal clients)

| Segment | Who | What they type when they need us |
|---|---|---|
| **Tour and activity operators** (outreach priority) | Excursions, quad and buggy, balloon, paragliding, drivers, inbound travel agencies in Marrakech | "site web agence de voyage", "site de réservation excursion", "getyourguide maroc", "commission airbnb maroc" |
| **Riads, hotels, guesthouses** | Owners who sell through Booking.com and Airbnb | "site web riad", "création site web riad marrakech", "site vitrine riad prix maroc", "commission booking maroc" |
| **Local businesses in Marrakech** | Services, shops, restaurants, clinics, firms | "création site web marrakech", "agence web marrakech", "création site internet marrakech" |
| **Businesses elsewhere in Morocco** | Same needs, other cities or national | "création site web maroc", "agence web maroc", "agence web casablanca", "agence web rabat", "création site web tanger" |
| **Price-first buyers** (every segment) | Anyone comparing quotes | "prix site web maroc", "création site web maroc prix", "combien coûte un site web" |

## Method

1. **Google Autocomplete, Morocco** (`gl=ma`): 74 seed phrases by segment, then "seed + a…z" on the 11 most commercial
   seeds. Tool: [`scripts/seo/autocomplete.mjs`](../../scripts/seo/autocomplete.mjs).
2. **Google Search Console, 16 months** (Jul 2025 – Nov 2026): every query the site has appeared for.
3. **Live results, Nov 10, 2026** (Morocco, French, top 20, read 3 times): "agence web marrakech", "création site web marrakech",
   "agence seo marrakech". All three show a map pack above the organic results.
4. **Google Ads Keyword Planner, Morocco**: average monthly searches, competition and top-of-page bid range for all 191
   candidates. Tool: [`scripts/seo/keyword-planner.mjs`](../../scripts/seo/keyword-planner.mjs); raw output in
   [`data/volumes-fr.csv`](data/volumes-fr.csv). French and English language settings return the same figures for Morocco.

Priority rules: **A** = fits the offer and ≥ 100 searches a month. **B** = fits and 30–90 a month, or a tour-operator / riad
keyword kept because it supports outreach even with little search volume. **C** = under 30 a month, outside the offer,
do-it-yourself intent, or no page in that language.

To refresh the volumes: `npm run ads:token -- --save` (approve with the Ads account), then
`node scripts/seo/keyword-planner.mjs metrics --seeds docs/seo/data/candidates.txt --out docs/seo/data/volumes-fr.csv --lang fr`.
The Google sign-in app is in "Testing" mode, so the token expires after 7 days; publishing the app in Google Cloud Console
("OAuth consent screen" → "Publish app") stops that.

## What the research says

1. **The biggest commercial search is national: "création site web maroc", 1,000 a month**, plus "agence web maroc" (480) and
   "création de site web maroc" (110). `/fr/website-design-moroccan-businesses` was retargeted to it on November 10.
2. **Casablanca is the second-largest opportunity: "agence web casablanca", 880 a month**, plus "création site web casablanca"
   (210). The Casablanca page exists but shares much of its text with the Rabat page. It deserves its own content next.
3. **SEO searches are national too: "agence seo maroc" 720, "seo maroc" 390, "agence seo marrakech" 320.** The SEO page title
   already covers "Marrakech et au Maroc".
4. **Marrakech website searches add up to about 1,240 a month** ("création site web marrakech" 590, "agence web marrakech" 390,
   "création site internet marrakech" 170, "site web marrakech" 90), all pointing at `/fr/web-design-marrakech`, which now
   absorbs the old `/agence-web-marrakech` duplicate.
5. **Tangier has demand and no page: "création site web tanger" 260, "agence web tanger" 70.** Rabat (260 + 110) and Agadir
   (110 + 70) have pages.
6. **"google business profile" is searched 4,400 times a month in Morocco**, mostly by owners managing their listing. The new guide
   targets the French phrasing ("fiche google my business", 140) and is the natural entry point for local businesses.
7. **Tour operators and riad owners rarely search for a website.** Their phrases sit around 10 searches a month ("site web
   agence de voyage", "site web riad"), and platform questions are similar ("getyourguide maroc" 30, "commission airbnb maroc" 20).
   The travel agency, hotel and commission pages are therefore **sales material for outreach**, not traffic drivers: send them
   to prospects rather than waiting for Google to bring them.
8. **Price phrases are small** ("prix site web maroc" 20, most others 10). The pricing guide is still worth keeping because every
   service page links to it and it answers the first sales question.
9. **Leave out "agence digitale / marketing digital / communication".** They total about 800 searches a month but are not the
   offer, and the 2026 Ads campaign that bought those searches produced no leads.
10. **Arabic demand is small** ("تصميم موقع الكتروني" 20). An Arabic version is not a priority on search volume alone.
11. **Cost per click is low** for the core phrases (top-of-page bids roughly 5–18 MAD for "création site web maroc/marrakech"),
    useful if Google Ads is restarted on exact phrases only.

## Demand by target page (monthly searches in Morocco)

| Target page | Searches / month | Main keywords |
|---|---|---|
| /fr/blog/fiche-google-business-maroc | 4,580 | google business profile (4,400), fiche google my business (140) |
| /fr/website-design-moroccan-businesses | 3,580 | création site web maroc (1,000), agence web maroc (480), création de site web maroc (110) |
| /fr/agence-seo-marrakech | 2,030 | agence seo maroc (720), seo maroc (390), agence seo marrakech (320), expert seo marrakech (140) |
| /fr/web-design-marrakech | 2,010 | création site web marrakech (590), agence web marrakech (390), création site internet marrakech (170) |
| /fr/web-design-casablanca | 1,140 | agence web casablanca (880), création site web casablanca (210) |
| /fr/web-design-rabat | 370 | agence web rabat (260), création site web rabat (110) |
| *(no page)* Tangier | 330 | création site web tanger (260), agence web tanger (70) |
| /fr/agence-google-ads-maroc | 230 | agence google ads maroc (140), google ads maroc (50) |
| /fr/web-design-agadir | 190 | agence web agadir (110), création site web agadir (70) |
| /fr/site-web-agence-de-voyage | ~130 | many phrases at ~10 each |
| /fr/blog/combien-coute-site-web-maroc | ~120 | prix site web maroc (20), many at 10 |
| /fr/blog/commission-getyourguide-viator-booking-maroc | ~90 | getyourguide maroc (30), commission airbnb maroc (20) |
| /fr/hotel-website-design | ~70 | many phrases at ~10 each |
| /fr/creation-site-e-commerce-maroc | ~40 | creation site e commerce maroc (20) |
| *(not targeted)* | ~800 | agence digitale maroc (320), agence marketing digital marrakech (210) |

Totals add close variants (for example "création" and "creation") that Google may count together, so treat them as an upper bound.
