# WeReact Local SEO Growth Design

## Objective

Increase qualified project enquiries from Moroccan and international businesses searching for website design, conversion-focused landing pages, and SEO-ready web development in Marrakech and Morocco.

## Audience and Positioning

WeReact is a Marrakech-based web studio for hospitality, tourism, local services, and ambitious small businesses. The site will lead with outcomes: a fast, credible website that earns project enquiries, bookings, and WhatsApp conversations. It will not claim rankings, results, clients, reviews, or awards that cannot be verified.

## Scope

### Technical SEO and entity signals

- Preserve the existing locale routing (`/en`, `/fr`) and add accurate canonical, alternates, robots, sitemap freshness, and structured data.
- Split structured data into stable, valid entities: Organization/ProfessionalService, WebSite, Service, FAQPage, BlogPosting, and CreativeWork/CaseStudy where relevant.
- Make sitemap `lastModified` values reflect page or post dates rather than the current build date.
- Add redirects only for routes that are confirmed in the deployment history; do not create empty pages for removed navigation.
- Retain Google consent mode and lead-event behaviour while validating the deployed build contains the tracking implementation.

### Search landing pages

- Add focused English and French pages for website design in Marrakech, tourism/hospitality web design in Morocco, and SEO-ready landing pages.
- Keep the simplified primary navigation. Discoverability comes through homepage service links, case studies, blog links, footer links, and contextual CTAs.
- Each page must use one intent-led H1, logical H2 sections, concise practical copy, real project references, FAQ content, and two conversion paths: project form and WhatsApp.

### Conversion and UX

- Replace generic or weak CTA labels with specific project-start language.
- Use clear response-time expectation: reply within one business day.
- Remove placeholder testimonial names until the client has approved attribution. Retain only truthful, unambiguous quotation copy or present it as project feedback without attributed names.
- Keep the existing light brand palette, Nohemi typography, and cinematic motion; no decorative gradients, rounded-card stacks, or intrusive overlays.
- Ensure CTAs retain visible keyboard focus and form controls expose proper labels, success states, and errors.

### Content and GEO

- Expand the blog into a tight cluster: Marrakech web design, bilingual websites, tourism/hospitality websites, landing-page conversion, technical SEO, and Google Ads landing pages.
- Publish only substantive content with a named WeReact byline, explicit last-updated date, internal references to services/case studies, and source-ready claims.
- Provide a 90-day editorial and off-page operating checklist. External citations, business profiles, customer reviews, and backlinks are operational work; the site must never fabricate them.

## Information Architecture

Routes:

- `/[locale]/web-design-marrakech`
- `/[locale]/tourism-websites-morocco`
- `/[locale]/seo-landing-pages`
- Existing `/[locale]/work`, `/[locale]/blog`, `/[locale]/contact`

The home page stays the brand and conversion hub. Service pages are not required in the overlay menu; they are linked from the relevant services section, footer, case studies, and articles.

## Data and Component Boundaries

- `src/data/services.ts`: locale-aware service-page copy, FAQs, keywords, project references, and CTA labels.
- `src/app/[locale]/(growth)/[slug]/page.tsx`: a reusable metadata and page shell, driven by an allowlisted service slug.
- `src/lib/seo.ts`: metadata and serializable JSON-LD builders.
- `src/data/blog.ts`: published and modified ISO dates, named author objects, article descriptions, and related service links.
- Existing contact and analytics utilities remain the only lead submission and conversion-tracking boundary.

## Validation

- Tests cover service-route resolution, generated metadata canonical/alternate URLs, JSON-LD structure, sitemap dates, and CTA analytics payloads.
- `npm run lint`, focused `tsx --test` tests, and `npm run build` must pass.
- Check generated metadata, JSON-LD, robots, sitemap, service pages, contact CTA, desktop and 375px mobile layouts locally.

## Operational Dependencies

- Deploy the current source to replace the live stale navigation before requesting re-indexing.
- Verify Resend before enabling production contact confirmations.
- In Search Console: submit the sitemap, inspect each new route, and request indexing only after production deployment.
- In Google Business Profile: match business name, phone, address/service area, website, category, hours, photos, and service description to the site.
- Obtain explicit written permission for any named testimonials, client logo use, and case-study outcome claims.
