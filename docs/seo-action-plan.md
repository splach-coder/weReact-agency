# WeReact — SEO / GEO Action Plan

_Last updated: 2026-07-16. Synthesises a 4-dimension audit (Technical · GEO/AI-search · Content · Backlinks) into one prioritised plan. Money keywords: **agence web marrakech**, **création site web maroc**, **création site internet marrakech**, **web agency marrakech**._

## TL;DR — why we're not ranking

Only the **homepage** is indexed. The page built to rank for our top keyword — `/agence-web-marrakech` — had **zero internal links** anywhere on the site, so Google never had a path to it or anchor text for it. On top of that, nothing was edge-cached and the sitemap advertised a single frozen date, so Google saw no "re-crawl me" signal and kept the stale old snapshot. None of this is a penalty — it's a discoverability + freshness problem, and it's fixable. The single biggest lever (internal-linking the money page) is already shipped in this pass.

---

## What was fixed in code this pass (shipped)

| Fix | Files | Why it matters |
|---|---|---|
| **Un-orphaned the money page** — added `/agence-web-marrakech` to the footer service list, wired the pricing blog post to it, and added a homepage service-links row with keyword-rich anchors to all 4 landing pages | `Footer.tsx`, `data/blog.ts`, `WhatWeDo.tsx` | #1 fix. Gives Google a crawl path + exact-match anchor text to every money page. |
| **Crawlable FAQ + FAQPage schema** on the homepage | `sections/home/Faq.tsx` | 5 of 6 answers were JS-gated (not in the DOM for crawlers/AI). Now all answers render + are schema-marked → eligible for rich results + AI citation. |
| **`/llms.txt`** added | `public/llms.txt` | Feeds ChatGPT/Perplexity/Claude a clean brand + pricing + services summary. |
| **Real per-page sitemap `lastmod`** (replaced the frozen constant) | `sitemap.ts`, `data/services.ts` | Restores the "content changed, re-crawl" signal that keeps SERP snippets current. |
| **BreadcrumbList schema** on landing + blog pages; **de-duplicated** the generic Service schema (was on every page → now homepage-only) | `lib/seo.ts`, `layout.tsx`, `page.tsx`, `(growth)/[slug]`, `blog/[slug]` | Cleaner schema graph; breadcrumb rich results. |
| **City-name consistency** (`Marrakesh` → `Marrakech` in business/schema fields) + **explicit AI-crawler allow** (GPTBot, PerplexityBot, ClaudeBot, etc.) | `config/site.ts`, `robots.ts` | Removes an entity-signal inconsistency; confirms AI crawlers are welcome. |
| Fixed nested `<main>` on landing pages | `(growth)/[slug]` | Valid document outline. |

---

## Deferred code items (need care — not shipped this pass)

- **P0-2 — Edge caching.** Every route returns `Cache-Control: private, no-cache` because the next-intl middleware sets the locale cookie on every response, which opts the route out of Vercel's full-route cache. Fixing this means decoupling the cookie from cacheable page responses in `middleware.ts` — delicate, and a wrong move breaks locale detection. Worth doing, but in its own tested pass. **Impact:** faster crawl + faster TTFB, not a ranking blocker for a site this size.
- **P1 — apex→www uses a 307 (temporary) redirect.** Should be a 308/301 (permanent). This is a **Vercel domain setting**, not code — change it in the Vercel dashboard (Domains → set `www` as primary / permanent redirect).
- **P1 — hreflang `Link` header vs `<link>` tag** minor mismatch (middleware). Low priority.
- **P1 — WebGLHero** ships JS cost on mobile; consider lazy-loading below the fold later.

---

## User-side actions (do these — they're what actually triggers indexing)

**This week, in order of impact:**
1. **Google Search Console → submit the sitemap** (`https://www.wereact.agency/sitemap.xml`) if not already, then **URL Inspection → Request Indexing** on each money page:
   - `/fr/agence-web-marrakech`, `/en/agence-web-marrakech`
   - `/fr/web-design-marrakech`, `/fr/tourism-websites-morocco`, `/fr/seo-landing-pages`
   - `/fr/blog/combien-coute-site-web-maroc`
2. **Google Business Profile** — claim + fully verify (Marrakech address, hours, services, 10+ photos, the 2000/3500 DH price list). This is the highest-ROI local ranking asset and feeds the Maps pack. NAP must match `config/site.ts` exactly.
3. **Backlinks / citations** (the race is winnable — competitors are tiny except rhillane.com):
   - Moroccan business directories: `marocannonces`, `telecontact.ma`, `yellowpages.ma`, `mapofmorocco`, local Marrakech chambers.
   - LinkedIn company page + team profiles linking to the site.
   - Portfolio/agency listings (Clutch, DesignRush, Sortlist FR/MA).
   - Ask the 3 portfolio clients (Flying Tandem, Kasbah Angour, Your Morocco) for a "site by WeReact" footer credit link — the single easiest relevant backlinks.
4. Find the **$300 Google Ads promo code** (Promotions page is currently empty — the credit isn't redeemed yet; it's a spend-to-earn code that must be entered).

---

## Content roadmap (next 5–8 pages, priority order)

1. **Rebuild `/agence-web-marrakech` into a real pillar page (1,500–2,000 words).** Currently ~350 words of unique copy vs competitors at 700–5,100. Add: "Qu'est-ce qu'une agence web à Marrakech ?", "Agence web vs freelance", "Comment choisir votre agence", a **visible pricing table** (promote the 2000/3500 DH figures out of the FAQ), an embedded map/NAP block, 2–3 quantified case studies, and a link to the blog. Keep the existing FAQ/Service JSON-LD.
2. **New page `/creation-site-web-maroc`** — national intent is a *different SERP* from the Marrakech-city cluster; stop diluting both on one URL. Pricing-led (transparent pricing is our real differentiator).
3. **"Agence web ou freelance au Maroc ?"** — a proven competitor FAQ pattern we're missing entirely. Run as a section on #1 or a standalone article.
4. **Turn the pricing blog post into a citable comparison asset** — restructure its pricing into a schema-marked table (site vitrine vs e-commerce vs booking); cross-link hard from #1 and #2. Best AI-Overview citation win available (content already exists).
5. **Standalone `/about` (or `/equipe`) page with a named founder** — photo, credentials, "why we started." E-E-A-T signal we currently can't rank or link to (copy already exists in `messages` — reuse it).
6. **City pages** — `/creation-site-web-casablanca`, `/agence-web-rabat`, `/creation-site-web-agadir`. Schema already claims these as `areaServed`; close the claim-vs-content gap. Use disciplined templating (avoid thin duplicates).
7. **1–2 real case studies with metrics** (load time, booking/enquiry lift, before/after) instead of the one-paragraph card reused across every service page.
8. **Resume a real blog cadence** — space posts over weeks, put a **named author with a bio** on each (current "WeReact Editorial Team" byline + single-day batch dates read as low-effort AI content).

### E-E-A-T quick wins baked into the above
- Replace "WeReact Editorial Team" byline with a named person + bio + photo.
- Testimonials are currently project-summary blurbs attributed to the project name — get **real client names/quotes** (even one).
- Add a visible NAP + click-to-call + map block to the money page.

---

## Scoreboard / how we'll know it's working

- **GSC Coverage:** pages indexed should climb from ~1 → all money pages within 2–3 weeks of Request Indexing.
- **GSC Performance:** impressions for non-brand terms ("agence web marrakech", "création site web maroc") should start appearing (today it's brand-only "wereact").
- **SERP snippet:** `site:wereact.agency` should show fresh titles/descriptions (not the stale old-site snippet) once re-crawled.
- **Maps:** GBP appears in the local pack for "agence web marrakech".

_Verify with GSC + free tools; no paid rank tracker (e.g. SEMrush) needed yet — it diagnoses, it doesn't rank._
