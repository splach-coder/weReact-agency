# WeReact Local SEO Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn WeReact into a technically sound, locally relevant, conversion-focused website that can earn qualified organic enquiries for Marrakech and Moroccan web design services.

**Architecture:** Keep the existing locale route shell and lead pipeline. Add a data-driven set of service landing pages, generate page-specific metadata and JSON-LD from the same data, and make home/blog/work pages point into those pages with truthful proof and direct CTAs.

**Tech Stack:** Next.js 16 App Router, TypeScript, next-intl, React, Tailwind CSS, Framer Motion, Node test runner via `tsx`.

## Global Constraints

- Keep `/en` and `/fr` route prefixes and preserve the existing simplified top-level menu.
- Use real service claims and project facts only; never fabricate ranking outcomes, reviews, client names, or testimonials.
- Keep all contact conversion paths bound to `trackContactIntent` and `trackLead`.
- Preserve the light green WeReact brand system and existing reduced-motion behaviour.
- Add no external runtime dependencies.

---

### Task 1: Create a reusable service landing-page data model

**Files:**
- Create: `src/data/services.ts`
- Create: `src/data/services.test.ts`

**Interfaces:**
- Produces `ServiceLandingPage`, `serviceLandingPages`, and `getServiceLandingPage(slug)` for routes, sitemap, links, and schema.

- [ ] **Step 1: Write failing route-data tests**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { getServiceLandingPage, serviceLandingPages } from './services';

test('returns an indexable page for each approved commercial intent', () => {
  assert.equal(serviceLandingPages.length, 3);
  assert.equal(getServiceLandingPage('web-design-marrakech')?.primaryKeyword, 'website design Marrakech');
  assert.equal(getServiceLandingPage('missing'), undefined);
});
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `npx tsx --test src/data/services.test.ts`
Expected: FAIL because `services.ts` does not exist.

- [ ] **Step 3: Add the complete data model**

```ts
export type ServiceLandingPage = {
  slug: 'web-design-marrakech' | 'tourism-websites-morocco' | 'seo-landing-pages';
  primaryKeyword: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lead: string;
  outcomes: readonly string[];
  faqs: readonly { question: string; answer: string }[];
};

export const serviceLandingPages: readonly ServiceLandingPage[] = [/* three approved service records */];
export const getServiceLandingPage = (slug: string) => serviceLandingPages.find((service) => service.slug === slug);
```

- [ ] **Step 4: Run test**

Run: `npx tsx --test src/data/services.test.ts`
Expected: PASS.

### Task 2: Add localized, data-driven landing pages and metadata

**Files:**
- Create: `src/app/[locale]/(growth)/[slug]/page.tsx`
- Create: `src/app/[locale]/(growth)/[slug]/not-found.tsx` only if route-level fallback is needed
- Modify: `src/lib/seo.ts`
- Test: `src/lib/seo.test.ts`

**Interfaces:**
- Consumes `getServiceLandingPage(slug)`.
- Produces `createServicePageJsonLd(service, locale)` and `createFaqJsonLd(faqs)`.

- [ ] **Step 1: Write schema tests**

```ts
test('creates a Service schema tied to the canonical localized route', () => {
  const page = getServiceLandingPage('web-design-marrakech')!;
  const schema = createServicePageJsonLd(page, 'fr');
  assert.equal(schema['@type'], 'Service');
  assert.equal(schema.url, 'https://www.wereact.agency/fr/web-design-marrakech');
});
```

- [ ] **Step 2: Implement metadata and JSON-LD builders**

```ts
export function createServicePageJsonLd(page: ServiceLandingPage, locale: string) {
  return { '@context': 'https://schema.org', '@type': 'Service', name: page.title, url: `${siteConfig.url}/${locale}/${page.slug}` };
}

export function createFaqJsonLd(faqs: readonly { question: string; answer: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) };
}
```

- [ ] **Step 3: Implement service page**

```tsx
export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const page = getServiceLandingPage(slug);
  if (!page) notFound();
  return <main><section><p>{page.eyebrow}</p><h1>{page.heading}</h1><p>{page.lead}</p><Link href={`/${locale}/contact`}>Request a project quote</Link></section></main>;
}
```

- [ ] **Step 4: Run focused tests and build**

Run: `npx tsx --test src/data/services.test.ts src/lib/seo.test.ts && npm run build`
Expected: PASS; each `/en/*` and `/fr/*` service route is statically generated or renderable.

### Task 3: Make the home, footer, and case-study journeys support organic conversion

**Files:**
- Modify: `src/components/sections/home/WhatWeDo.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/sections/home/Testimonials.tsx`
- Modify: `src/app/[locale]/work/[id]/page.tsx`
- Test: `src/components/sections/home/WhatWeDo.test.tsx` or pure extracted helper test

**Interfaces:**
- Consumes localized service page links and existing `trackContactIntent`.
- Produces descriptive, keyboard-accessible paths from service/case-study content to contact and WhatsApp.

- [ ] **Step 1: Add truthful service links and concrete CTA copy**

```tsx
<Link href="/web-design-marrakech">Website design in Marrakech</Link>
<Link href="/tourism-websites-morocco">Tourism & hospitality websites</Link>
<Link href="/seo-landing-pages">SEO-ready landing pages</Link>
```

- [ ] **Step 2: Replace named placeholder testimonial attribution**

```tsx
<p className="text-mono">Project feedback · Flying Tandem, Marrakech</p>
```

- [ ] **Step 3: Add contact reassurance beside high-intent CTA**

```tsx
<p className="text-sm">Tell us what you need. We reply within one business day.</p>
```

- [ ] **Step 4: Verify links and no horizontal overflow at 375px**

Run: `npm run lint && npm run build`
Expected: PASS.

### Task 4: Improve content authority, article metadata, and internal linking

**Files:**
- Modify: `src/data/blog.ts`
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`
- Modify: `src/app/[locale]/blog/page.tsx`
- Test: `src/data/blog.test.ts`

**Interfaces:**
- Blog records expose ISO `publishedAt`, `modifiedAt`, `author`, `description`, `keywords`, and `relatedServiceSlug`.
- Article route uses records to render article schema and service CTA.

- [ ] **Step 1: Add content integrity tests**

```ts
test('every post includes a named business author, ISO dates, and a related service', () => {
  for (const post of blogPosts) {
    assert.match(post.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(post.author.name);
    assert.ok(post.relatedServiceSlug);
  }
});
```

- [ ] **Step 2: Upgrade three existing articles, not bulk-generate thin posts**

```ts
author: { name: 'WeReact Editorial Team', url: 'https://www.wereact.agency/en' },
publishedAt: '2026-06-16',
modifiedAt: '2026-07-12',
relatedServiceSlug: 'web-design-marrakech',
```

- [ ] **Step 3: Render Article schema and contextual service CTA**

```tsx
<Link href={`/${locale}/${post.relatedServiceSlug}`}>Explore {relatedService.title}</Link>
```

- [ ] **Step 4: Run content tests**

Run: `npx tsx --test src/data/blog.test.ts && npm run build`
Expected: PASS.

### Task 5: Correct sitemap freshness, audit accessibility, and document external operations

**Files:**
- Modify: `src/app/sitemap.ts`
- Create: `docs/seo-90-day-growth-playbook.md`
- Test: `src/app/sitemap.test.ts`

**Interfaces:**
- Sitemap reads `publishedAt`/`modifiedAt` fields and includes service routes for both locales.
- Playbook is an owner-operated checklist; it never claims external listings have been created.

- [ ] **Step 1: Write sitemap expectations**

```ts
test('includes service routes and does not use build time as post modification time', () => {
  const routes = sitemap();
  assert.ok(routes.some((entry) => entry.url.endsWith('/fr/web-design-marrakech')));
  assert.equal(routes.find((entry) => entry.url.endsWith('/blog/website-design-marrakech'))?.lastModified?.toISOString().slice(0, 10), '2026-07-12');
});
```

- [ ] **Step 2: Implement date-aware route entries and service entries**

```ts
lastModified: new Date(post.modifiedAt),
changeFrequency: 'monthly',
priority: 0.72,
```

- [ ] **Step 3: Document concrete ownership tasks**

The playbook must include Google Search Console, Bing Webmaster Tools, Google Business Profile, trusted Moroccan/local citations, verified client backlink requests, review collection, and monthly reporting KPIs.

- [ ] **Step 4: Full validation**

Run: `npx tsx --test src/data/services.test.ts src/lib/seo.test.ts src/data/blog.test.ts src/app/sitemap.test.ts src/lib/analytics.test.ts && npm run lint && npm run build`
Expected: all tests pass, lint exits 0, build succeeds.

- [ ] **Step 5: Commit implementation**

```bash
git add src docs tests
git commit -m "feat: add local SEO growth foundation"
```
