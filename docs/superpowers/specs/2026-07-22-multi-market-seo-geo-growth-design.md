# WeReact Multi-Market SEO and GEO Growth Design

## Objective

Increase qualified enquiries for WeReact across three commercial audiences without splitting brand authority:

1. Tourism and hospitality businesses in Morocco.
2. Moroccan local businesses and growing SMEs.
3. International clients seeking a Morocco-based web partner.

The work will improve organic discovery, AI-answer visibility, Bing discovery, trust, and conversion quality while preserving the current visual design, colors, typography, motion language, and primary navigation.

## Current-State Findings

The site already has useful foundations: localized English and French routes, service landing pages, a sitemap, crawler rules, structured data, project pages, a contact pipeline, analytics events, and substantive blog content.

The audit found the following gaps:

- The root and unprefixed routes use temporary locale redirects, which weakens canonical consistency.
- `x-default` alternates point to unprefixed URLs that redirect instead of a final indexable URL.
- At least one previously indexed 2024 article now resolves to a localized 404 instead of a relevant replacement or permanent redirect.
- The French blog index and several article interface labels still use English metadata or English conversion copy.
- The home page tries to address all audiences with one broad message instead of giving each audience a clear path.
- Project summaries are presented in a testimonial-style section without verified client quotations.
- Existing case studies describe deliverables but provide limited verifiable evidence, process detail, or outcomes.
- Pricing and two-to-three-day delivery claims can attract low-fit enquiries unless scope and qualification are made explicit.
- Bing discovery is not actively supported through IndexNow.
- The site has entity and service schema, but entity ownership, page-specific schema, author identity, and citation-ready facts need tighter consistency.

## Positioning Architecture

WeReact remains one brand and one domain. The home page remains the brand hub, while three audience hubs provide specific promises, proof, FAQs, and conversion routes.

### Audience hubs

- `/[locale]/tourism-websites-morocco` (expand the existing page; do not create a competing tourism route)
  - Hotels, riads, tour operators, private transport, guides, and travel brands.
  - Primary outcomes: direct enquiries, bookings, destination discovery, multilingual trust, and mobile usability.

- `/[locale]/website-design-moroccan-businesses`
  - Local services, retailers, professional firms, trades, restaurants, and Moroccan SMEs.
  - Primary outcomes: local visibility, credibility, calls, WhatsApp conversations, quote requests, and online sales.

- `/[locale]/international-web-design-agency`
  - International founders, agencies, and small teams needing a bilingual or nearshore web partner.
  - Primary outcomes: clear delivery, responsive collaboration, modern engineering, English/French capability, and international launch support.

Existing pages such as `/web-design-marrakech`, `/agence-web-marrakech`, and `/seo-landing-pages` remain focused commercial service pages. The existing `/tourism-websites-morocco` page becomes the tourism audience hub because its current intent already covers that market. The two new audience hubs organize services around buyer needs without duplicating commercial search intent.

## Homepage Changes

The homepage will keep its current layout and visual system. Content changes will:

- Preserve the broad brand-level hero.
- Add a compact, crawlable audience-path section linking to the three hubs.
- Replace ambiguous testimonial framing with a truthful selected-project or project-outcome label.
- Strengthen project cards with factual sector, location, scope, and live-site evidence.
- Keep a single primary project-start action, with WhatsApp as the direct secondary path.
- Clarify that rapid delivery applies to defined-scope launches, while complex projects receive a scoped timeline.

No new marketing-style hero, visual redesign, or top-level navigation expansion is included.

## Technical SEO Design

### Canonical host and locale behavior

- Keep `https://www.wereact.agency` as the canonical host.
- Make `/` permanently redirect to `/en`.
- Make supported unprefixed legacy routes permanently redirect to their final English equivalents.
- Keep locale switching explicit; do not redirect crawlers based on inferred language.
- Point `x-default` directly to the final English URL for each page.
- Ensure every canonical and alternate URL returns `200` without another redirect.

### Legacy recovery

- Add a finite allowlist of confirmed old article and route redirects.
- Redirect an old article only when a substantively relevant current page exists.
- Return a genuine localized `404` for unknown routes rather than redirecting all missing pages.
- Add tests for the known indexed article `/blog/minimalist-design-trends` and other confirmed historical routes.

### Metadata and language

- Generate localized titles, descriptions, Open Graph fields, and interface copy for English and French blog indexes and articles.
- Keep one descriptive H1 per indexable page.
- Remove mojibake from French metadata and configuration source.
- Use page-specific descriptions written for clicks, not keyword lists.
- Keep meta keywords only if already consumed internally; do not treat them as a ranking mechanism.

### Sitemap and robots

- Include all indexable audience hubs, services, articles, and case studies in both locales.
- Use content-owned modification dates rather than deployment time.
- Exclude admin, CRM, APIs, auth callbacks, unsubscribe handlers, and internal utility routes.
- Allow major search and answer-engine crawlers while preserving the existing private-route exclusions.

### Structured data

- Emit the primary organization/local business entity once on the localized home layout or home page, not redundantly across every route.
- Keep stable `@id` references for the business, website, services, authors, and case studies.
- Use `Service` on service and audience pages, `BlogPosting` on articles, `BreadcrumbList` on nested pages, and `FAQPage` only where the visible FAQ content matches the markup.
- Use `CreativeWork` or `CaseStudy` semantics for project pages without inventing ratings or quantified results.
- Include only public, verifiable business facts and profile URLs.

## Bing and IndexNow

The repository will include a manual IndexNow integration with no new runtime dependency:

- Generate one valid IndexNow key and host its matching UTF-8 text file at the site root.
- Add a script that reads the application sitemap and submits final canonical URLs in one batch to the IndexNow endpoint.
- Submit English and French URLs separately within the same batch.
- Treat `200` and `202` as accepted outcomes and surface other responses clearly.
- Never submit admin, CRM, API, redirect, or non-canonical URLs.
- Document the command for deployment use after content changes.

Bing Webmaster Tools ownership remains an account-level operation. The operational checklist will use Bing's Google Search Console import when available, then verify the sitemap and IndexNow activity. No fake verification token will be placed in the site.

## GEO and Answer-Engine Design

GEO means making WeReact easy to understand, extract, compare, and cite. It does not mean generating keyword-heavy text for bots.

### Entity clarity

- Use one consistent business name, location, phone, email, services, languages, and canonical URL across visible content, structured data, `llms.txt`, social profiles, Google Business Profile, and Bing Webmaster Tools.
- Add a concise credentials block within the existing homepage manifesto area using truthful ownership and expertise information.
- Identify article authors as WeReact or a named, approved team member; never invent people or credentials.

### Citation-ready content

- Start key sections with direct answers before supporting explanation.
- Use factual tables or lists for services, process, timelines, scope, and starting prices where the facts are stable.
- Show published and updated dates on articles.
- Link claims to primary sources when discussing search platforms, standards, or market statistics.
- Connect each article to one audience hub, one service page, and one relevant case study where available.

### Topic clusters

Content will support the three audiences through focused clusters:

- Tourism: direct-booking websites, multilingual travel SEO, riad and hotel conversion, tour-operator landing pages, and mobile booking trust.
- Moroccan business: website costs, local SEO, Google Business Profile, WhatsApp conversion, e-commerce, and bilingual sites.
- International: working with a Morocco-based agency, bilingual launches, handoff and maintenance, performance, and nearshore collaboration.

Existing strong articles will be upgraded before new articles are added. Thin, repetitive, or mass-generated pages are excluded.

## Conversion and Lead Quality

- Keep contact form, WhatsApp, and email as the three conversion methods.
- Add optional project-type, budget range, and desired launch-window fields to improve qualification.
- Keep name and email required; avoid making the form feel like an application.
- Change audience-page CTAs to reflect the visitor's intent while sending all submissions through the existing CRM and analytics boundary.
- Preserve one-business-day response expectations.
- Explain starting-price scope so low prices do not imply unlimited custom work.
- Track audience hub, service page, project page, and article origin in lead attribution.

## Trust and Proof Rules

- Do not use quotation marks, star ratings, or testimonial labels without approved client statements.
- Client and project names already published may remain, but ownership, studio concept, client work, and independent project status must stay explicit.
- Do not publish ranking, traffic, booking, revenue, or conversion claims without source evidence.
- Show live project links, screenshots, responsibilities, constraints, and observable deliverables.
- Add Google reviews only after they exist and attribution is permitted.

## Data and Component Boundaries

- `src/data/audiences.ts`: audience-hub slugs, localized copy, related services, proof, FAQs, and CTA labels.
- `src/data/services.ts`: service-level copy and relationships; no duplicated audience-page prose.
- `src/data/blog.ts`: article authority fields, dates, related audience, related service, and related project.
- `src/data/projects.ts`: truthful project status, relationship, scope, and evidence fields.
- `src/lib/seo.ts`: canonical, alternate, and JSON-LD builders.
- `src/lib/indexnow.ts`: URL filtering, payload construction, and response classification.
- `scripts/submit-indexnow.mjs` or a TypeScript equivalent: explicit post-deployment submission command.
- `src/middleware.ts` and routing configuration: permanent canonical and legacy redirects.
- Existing contact, CRM, and analytics utilities remain the only lead submission and conversion boundaries.

## Testing and Verification

Automated coverage will verify:

- Audience data completeness in both locales.
- Canonical and alternate URLs resolve to final localized URLs.
- `x-default` never points to a redirecting URL.
- Known legacy routes permanently redirect to the correct replacement.
- Unknown routes remain genuine 404 responses.
- French blog metadata and visible interface copy are French.
- Sitemap entries include all public canonical routes and exclude private routes.
- Structured data uses stable IDs and visible factual content.
- IndexNow accepts only same-host canonical URLs and builds the documented payload.
- Contact attribution records audience and source page without exposing sensitive form values to analytics.

Final verification will run the complete test suite, lint, production build, a generated-route audit, and focused desktop/mobile checks of changed public pages. Live IndexNow submission will occur only after the changes are deployed and the key file is publicly reachable.

## Operational Work After Deployment

- Import the verified Google Search Console property into Bing Webmaster Tools and submit the sitemap.
- Inspect the three audience hubs and principal service pages in Google Search Console and Bing Webmaster Tools.
- Request removal or recrawl of confirmed stale URLs only after permanent redirects are live.
- Align Google Business Profile and public social profiles with the same business facts.
- Collect approved client statements and review links through a repeatable post-launch request.
- Pursue relevant citations and backlinks from client sites, tourism partners, Moroccan business directories, and professional profiles without paid-link or bulk-directory schemes.
- Review qualified leads, organic landing pages, non-brand queries, conversion rate, and assisted conversions monthly.

## Success Criteria

The implementation is successful when:

- All public canonical and alternate URLs resolve directly and correctly.
- Confirmed stale indexed URLs recover through relevant permanent redirects.
- English and French commercial experiences are fully localized.
- All three audiences have dedicated, internally linked discovery paths.
- Bing can verify the IndexNow key and accept the canonical sitemap URL set.
- Structured data validates without fabricated or hidden claims.
- Lead attribution identifies which audience and page produced an enquiry.
- The existing visual design remains recognizably unchanged.

