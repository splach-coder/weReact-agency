# Topical map — WeReact agency

How the site's pages group into topics, which page leads each topic (the hub), and how they link. Built from the
[keyword research](keyword-research.md) on November 10, 2026. French URLs are shown; each page has an English twin at `/en/…`.

```mermaid
graph LR
  subgraph P1[1 · Website creation]
    WDM[/web-design-marrakech<br/>agence web marrakech/]
    MA[/website-design-moroccan-businesses<br/>création site web maroc/]
    CITIES[/casablanca · rabat · agadir/]
    ECOM[/creation-site-e-commerce-maroc/]
    COST[/blog/combien-coute-site-web-maroc/]
    GUIDE[/blog/website-design-marrakech-business-guide/]
    STUDY[/blog/etude-sites-agences-web-marrakech/]
  end
  subgraph P2[2 · Tourism, tours and activities]
    TOUR[/tourism-websites-morocco/]
    TRAVEL[/site-web-agence-de-voyage/]
    HOTEL[/hotel-website-design/]
    COMM[/blog/commission-getyourguide-viator-booking-maroc/]
    TSEO[/blog/tourism-hospitality-seo-morocco/]
  end
  subgraph P3[3 · Visibility on Google]
    SEO[/agence-seo-marrakech/]
    GBP[/blog/fiche-google-business-maroc/]
    ADS[/agence-google-ads-maroc/]
    LP[/seo-landing-pages/]
    SEOS[/blog/seo-strategies-for-agencies/]
  end
  WDM --- MA & CITIES & ECOM & COST & GUIDE & STUDY
  TOUR --- TRAVEL & HOTEL & TSEO
  TRAVEL --- COMM
  HOTEL --- COMM
  SEO --- GBP & ADS & LP & SEOS
  TRAVEL -.-> GBP
  HOTEL -.-> SEO
  COST -.-> ECOM & HOTEL & TRAVEL
  WDM -.-> TRAVEL & HOTEL & SEO
```

## Pillar 1 — Website creation (Marrakech and Morocco)

| Page | Role | Main query | Status |
|---|---|---|---|
| `/fr/web-design-marrakech` | **Hub** | agence web marrakech · création site web marrakech | Live; absorbed `/agence-web-marrakech` (308) |
| `/fr/website-design-moroccan-businesses` | Spoke | création site web maroc · website design morocco | Live; retargeted to national searches |
| `/fr/web-design-casablanca`, `-rabat`, `-agadir` | Spokes | création site web casablanca / rabat / agadir | Live |
| `/fr/creation-site-e-commerce-maroc` | Spoke (money) | création site e-commerce maroc | **New** |
| `/fr/blog/combien-coute-site-web-maroc` | Spoke (price) | prix site web maroc · combien coûte un site web | Live; links to every offer page |
| `/fr/blog/website-design-marrakech-business-guide` | Spoke (guide) | création site web marrakech (informational) | Live |
| `/fr/blog/etude-sites-agences-web-marrakech` | Spoke (original research) | agence web marrakech (comparison intent) | **New** — study of the agency sites ranking in Marrakech |

## Pillar 2 — Tourism, tours and activities (outreach priority)

| Page | Role | Main query | Status |
|---|---|---|---|
| `/fr/tourism-websites-morocco` | **Hub** | site web tourisme maroc | Live |
| `/fr/site-web-agence-de-voyage` | Spoke (money) | site web agence de voyage · site de réservation excursion | **New** |
| `/fr/hotel-website-design` | Spoke (money), sub-hub for riads | site web riad · création site web riad marrakech | Live |
| `/fr/blog/commission-getyourguide-viator-booking-maroc` | Spoke (information gain) | commission getyourguide · viator commission · commission booking maroc | **New** — sourced commission figures and the direct-booking arithmetic |
| `/fr/blog/tourism-hospitality-seo-morocco` | Spoke (guide) | morocco travel seo · seo tourisme | Live; expanded with the operator checklist |
| Case studies: Flying Tandem, Your Morocco, Kasbah Angour, Trust Drivers, Morocco Atlas Guide | Proof | — | Live |

## Pillar 3 — Visibility on Google

| Page | Role | Main query | Status |
|---|---|---|---|
| `/fr/agence-seo-marrakech` | **Hub** | agence seo marrakech · seo maroc | Live |
| `/fr/blog/fiche-google-business-maroc` | Spoke (guide) | fiche google my business · google maps | **New** |
| `/fr/agence-google-ads-maroc` | Spoke (money) | agence google ads maroc | Live |
| `/fr/seo-landing-pages` | Spoke (money) | landing page maroc | Live |
| `/fr/blog/seo-strategies-for-agencies` | Spoke (guide) | — | Live but thin; rewrite or merge later |

## Pillar 4 — The company (entity and trust)

`/fr/about`, `/fr/work` and the case studies, `/fr/book`, `/fr/contact`, and two new pages for machines and people who want
everything in one place: `/fr/sitemap` (HTML sitemap) and `/fr/ai-info` (fact sheet for AI assistants), plus `/llms.txt`.
The entity graph behind them is documented in [`entity-map.html`](entity-map.html).

## Internal link rules

1. **Every spoke links to its hub early,** in the lead or first paragraph, with the hub's main query as natural anchor text.
2. **Every hub links to all of its spokes**, in the copy where the reader's question leads there, and in the "Explore next" block.
3. **Cross-pillar links only where the reader's next question goes**: an operator reading about bookings next needs the
   Google Business guide; a price reader next needs the e-commerce, hotel or travel agency page.
4. **Descriptive anchors, varied between pages,** never "click here", and never the same exact anchor from every page.
5. **No links to redirected or missing URLs.** In landing copy, the test `src/lib/inline-links.test.ts` fails the build if a link
   points at a page that does not exist, at the other language, or at the page itself. Across the whole site,
   `node scripts/seo/link-audit.mjs <base-url>` reports orphans, redirects and broken links (latest run: [`link-audit.md`](link-audit.md)).
6. **A new article gets at least three contextual links from older pages on the day it is published.**

Landing copy uses `[anchor text](/fr/page)` inside `src/data/services.ts` and `src/data/audiences.ts`; articles use normal
`<a href>` inside `src/data/blog.ts`.

## Phases

**Done on November 10, 2026:** the Marrakech pages merged; the national page retargeted; the travel agency and e-commerce pages
and the Google Business guide published; links woven through the landing pages and the four older articles; HTML sitemap, AI info
page, generated llms.txt and entity graph added; the commission article and the agency study added (see the commit log for
anything that slipped).

**Next, ranked by search demand** (Keyword Planner, Morocco, added November 10, 2026)
- **Give the Casablanca page its own content** ("agence web casablanca" 880/month, "création site web casablanca" 210). It
  currently shares much of its text with the Rabat page.
- **Strengthen the national page** `/fr/website-design-moroccan-businesses` ("création site web maroc" 1,000/month): add depth
  (process, what is included, cities served) and real proof, since it targets the largest commercial query.
- **Add a Tangier page** ("création site web tanger" 260/month, "agence web tanger" 70) on the same model as Rabat and Agadir,
  with Tangier-specific content rather than a city name swapped into shared text.
- Request indexing in Search Console for every new or changed URL; follow positions of the A keywords every two weeks.
- Rewrite or merge `seo-strategies-for-agencies`, which is thin and generic.

**Not worth doing on search demand alone**
- An Arabic version (Arabic website-creation phrases are around 20 searches a month).
- A redesign page ("refonte site web" ~10 a month).
- Pages for specific activity niches: tour operators and riad owners barely search for websites. Reach them through outreach
  with the travel agency, hotel and commission pages as sales material.
- A Google Ads cost guide based on WeReact's own campaign data stays an option, only if the owner agrees to publish the numbers.
