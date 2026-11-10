# Keyword research — WeReact agency

Researched November 10, 2026 for the Moroccan market (French first, English second). The full table is
[`keyword-research.csv`](keyword-research.csv): 210 keywords, each with its client segment, intent, priority, target page and the
evidence that people actually search it. Raw inputs are in [`data/`](data/).

## Who we are writing for (ideal clients)

| Segment | Who | What they type when they need us |
|---|---|---|
| **Tour and activity operators** (outreach priority) | Excursions, quad and buggy, balloon, paragliding, drivers, inbound travel agencies in Marrakech | "site web agence de voyage", "création site web agence de voyage", "site de réservation excursion", "commission getyourguide", "viator commission" |
| **Riads, hotels, guesthouses** | Owners who sell through Booking.com and Airbnb | "site web riad", "création site web riad marrakech", "site vitrine riad prix maroc", "commission booking maroc", "moteur de réservation hôtel" |
| **Local businesses in Marrakech** | Services, shops, restaurants, clinics, firms | "agence web marrakech", "création site web marrakech", "création site internet marrakech", "développeur web marrakech" |
| **Businesses elsewhere in Morocco** | Same needs, other cities or national | "création site web maroc", "agence web maroc", "création site web casablanca", "agence web rabat", "agence web agadir" |
| **Price-first buyers** (every segment) | Anyone comparing quotes | "prix site web maroc", "création site web maroc prix", "prix de creation site web au maroc", "combien coûte un site web", "devis creation site web maroc" |

## Method

Volumes from paid tools were not available on the day (the OpenSEO account had no credits left, and the Google Ads
Keyword Planner login had expired). Instead, each keyword carries the evidence we could verify for free:

1. **Google Autocomplete, Morocco** (`gl=ma`): 74 seed phrases by segment, then "seed + a…z" on the 11 most commercial
   seeds. A phrase Google suggests to people in Morocco is a phrase people in Morocco type. Tool: [`scripts/seo/autocomplete.mjs`](../../scripts/seo/autocomplete.mjs).
2. **Google Search Console, 16 months** (Jul 2025 – Nov 2026): every query the site has appeared for, with impressions and
   average position. Real searches, but only where the site already shows up.
3. **Live results, Nov 10, 2026** (Morocco, French, top 20, read 3 times): "agence web marrakech", "création site web marrakech",
   "agence seo marrakech". All three show a map pack above the organic results.

Priority rules: **A** = strong fit with what WeReact sells, commercial intent, and at least one piece of demand evidence.
**B** = good fit but supporting/informational, or no evidence yet. **C** = outside the offer, do-it-yourself intent, or no
page in that language.

### Adding real volumes later

`scripts/seo/keyword-planner.mjs` pulls Morocco volumes, competition and cost per click from the Google Ads Keyword Planner
(free with the existing Ads account). It needs a fresh Ads login first (`npm run ads:token`, then put the new token in
`.env.local`). The Google sign-in app is still in "Testing" mode, which makes Google expire the token after 7 days;
publishing the app in Google Cloud Console ("OAuth consent screen" → "Publish app") stops that. Then:

```
node scripts/seo/keyword-planner.mjs metrics --seeds docs/seo/data/candidates.txt --out docs/seo/data/volumes.csv --lang fr
```

and copy the `volume` column into `volume_ma` in the CSV.

## What the research says

1. **The Marrakech head terms belong on one page.** "agence web marrakech", "création site web marrakech" and "création site
   internet marrakech" all have autocomplete demand and the same intent. They now point at `/fr/web-design-marrakech`, and the
   old `/agence-web-marrakech` duplicate redirects there.
2. **National searches had no page.** "création site web maroc", "agence web maroc", "conception site web maroc" and the English
   "website design morocco" family were spread across city pages. `/fr/website-design-moroccan-businesses` was retargeted to
   "Création de site web au Maroc". Its closest English query in Search Console, "website design for local shop morocco", sits at
   position 22.5.
3. **Price is the most common question.** 20 price queries, all with evidence ("prix site web maroc", "création site web maroc
   prix", "avis sur creation site web maroc"…). The pricing guide is the target, and every service page now links to it.
4. **Tour operators search the platforms' economics.** Autocomplete returns many variants of "getyourguide commission" and
   "viator commission" (supplier, percentage, rate). That is the operators' pain point and our sales argument, so it gets its own
   sourced article, linked from the travel agency page.
5. **"Site web agence de voyage" is a real query family with no WeReact page.** Autocomplete returns "site web pour agence de
   voyage", "creation site web agence de voyage", "comment créer un site web d'agence de voyage" and others. New page:
   `/fr/site-web-agence-de-voyage`.
6. **E-commerce had no page** although it is a published offer (from 3,500 MAD). New page: `/fr/creation-site-e-commerce-maroc`.
7. **Google Business Profile searches are informational** ("fiche google my business", "comment etre premier sur google maps")
   and come from the same local businesses we sell to. New guide: `/fr/blog/fiche-google-business-maroc`.
8. **Leave out "agence digitale / marketing digital / communication marrakech".** They have plenty of autocomplete demand, but
   they are not the offer, and the 2026 Ads campaign that bought those searches produced no leads.
9. **Arabic demand exists** ("تصميم مواقع مراكش", "انشاء موقع الكتروني في المغرب"), and at least one competitor ranks with an
   Arabic homepage. There is no Arabic version of the site yet; it is a later phase in the [topical map](topical-map.md).

## Keywords by target page

| Target page | A | B | C | Examples (priority A) |
|---|---|---|---|---|
| /fr/agence-seo-marrakech | 18 | 4 | 0 | agence seo marrakech, seo marrakech, consultant seo marrakech, agence seo maroc |
| /fr/blog/combien-coute-site-web-maroc | 18 | 2 | 0 | prix site web maroc, prix création site web maroc, refonte site web prix |
| /fr/hotel-website-design | 16 | 6 | 0 | agence web hôtel, création site web riad marrakech, création site web riad maroc, site vitrine riad prix maroc |
| /fr/site-web-agence-de-voyage (new) | 15 | 12 | 0 | site web agence de voyage, création site web agence de voyage, site web pour agence de voyage |
| /fr/web-design-marrakech | 15 | 10 | 0 | agence web marrakech, création site web marrakech, création site internet marrakech, web agency marrakech |
| /fr/website-design-moroccan-businesses | 14 | 13 | 4 | création site web maroc, web design morocco, website design morocco, web agency morocco |
| /fr/blog/commission-getyourguide-viator-booking-maroc (new) | 6 | 7 | 0 | commission getyourguide, getyourguide supplier commission, viator commission |
| /fr/creation-site-e-commerce-maroc (new) | 3 | 4 | 0 | création site e-commerce maroc, creation site e commerce maroc, boutique en ligne marrakech |
| /fr/blog/tourism-hospitality-seo-morocco | 1 | 3 | 0 | morocco travel seo |
| /fr/agence-google-ads-maroc | 0 | 7 | 0 | agence google ads maroc, google ads maroc, publicité google maroc |
| /fr/blog/fiche-google-business-maroc (new) | 0 | 6 | 0 | fiche google my business, google business profile, référencement local |
| /fr/web-design-casablanca, -rabat, -agadir | 0 | 11 | 0 | création site web casablanca, agence web rabat, agence web agadir |
| /fr/seo-landing-pages | 0 | 2 | 0 | landing page maroc, création landing page |
| (not targeted) | 0 | 0 | 13 | agence digitale marrakech, agence communication marrakech, Arabic queries |

Each page's French URL is listed; the English version (`/en/…`) targets the English keywords in the same row.
