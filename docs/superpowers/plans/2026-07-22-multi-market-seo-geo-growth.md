# WeReact Multi-Market SEO and GEO Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make WeReact discoverable and conversion-ready for Moroccan tourism businesses, Moroccan local businesses, and international clients while correcting bilingual SEO, adding Bing/IndexNow support, and preserving the current visual design.

**Architecture:** Keep one domain and the existing localized App Router shell. Reuse the current tourism page as its audience hub, add two data-driven audience pages through the existing growth route, centralize canonical/redirect logic in pure tested helpers, and keep all lead handling inside the existing contact/CRM boundary.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, next-intl 4, Tailwind CSS 4, Node test runner through `tsx`, Cloudflare/OpenNext, Bing IndexNow.

## Global Constraints

- Preserve the current WeReact colors, Nohemi typography, motion language, homepage hero, and simplified primary navigation.
- Keep `https://www.wereact.agency` as the canonical host and `/en` as `x-default`.
- Keep all public content available in English and French.
- Do not invent client quotations, ratings, rankings, traffic, bookings, revenue, team members, or credentials.
- Keep name and email as the only required contact fields; new qualification fields are optional.
- Add no external runtime dependency.
- Do not modify the unrelated CRM/admin files already dirty in the main workspace.

---

### Task 1: Make canonical locale routing permanent and deterministic

**Files:**
- Create: `src/lib/public-redirects.ts`
- Create: `src/lib/public-redirects.test.ts`
- Modify: `src/i18n/routing.ts`
- Modify: `src/middleware.ts`
- Modify: `src/lib/seo.ts`
- Modify: `src/lib/seo.test.ts`
- Modify: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Produces `getPermanentPublicRedirect(pathname: string): string | undefined`.
- Produces `createLocalizedAlternates(path: string)` for every metadata builder.
- Middleware returns HTTP `308` only for the allowlisted canonical and legacy paths.

- [ ] **Step 1: Write failing redirect and alternate tests**

```ts
// src/lib/public-redirects.test.ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { getPermanentPublicRedirect } from './public-redirects';

test('permanently canonicalizes known unprefixed public routes', () => {
  assert.equal(getPermanentPublicRedirect('/'), '/en');
  assert.equal(getPermanentPublicRedirect('/contact'), '/en/contact');
  assert.equal(getPermanentPublicRedirect('/web-design-marrakech'), '/en/web-design-marrakech');
});

test('recovers the confirmed indexed legacy article', () => {
  assert.equal(
    getPermanentPublicRedirect('/blog/minimalist-design-trends'),
    '/en/blog/website-design-marrakech-business-guide'
  );
});

test('does not turn unknown paths into soft 404s', () => {
  assert.equal(getPermanentPublicRedirect('/not-a-real-page'), undefined);
});
```

Add to `src/lib/seo.test.ts`:

```ts
import { createLocalizedAlternates } from './seo';

test('uses a final English URL as x-default', () => {
  const alternates = createLocalizedAlternates('/blog');
  assert.equal(alternates.en, 'https://www.wereact.agency/en/blog');
  assert.equal(alternates.fr, 'https://www.wereact.agency/fr/blog');
  assert.equal(alternates['x-default'], 'https://www.wereact.agency/en/blog');
});
```

- [ ] **Step 2: Run tests and confirm the missing modules fail**

Run: `npx tsx --test src/lib/public-redirects.test.ts src/lib/seo.test.ts`

Expected: FAIL because `public-redirects.ts` and `createLocalizedAlternates` do not exist.

- [ ] **Step 3: Implement the explicit redirect allowlist**

```ts
// src/lib/public-redirects.ts
const CURRENT_PUBLIC_PATHS = new Set([
  '/contact',
  '/work',
  '/blog',
  '/web-design-marrakech',
  '/tourism-websites-morocco',
  '/seo-landing-pages',
  '/agence-web-marrakech',
  '/website-design-moroccan-businesses',
  '/international-web-design-agency',
]);

const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  '/blog/minimalist-design-trends': '/en/blog/website-design-marrakech-business-guide',
};

export function getPermanentPublicRedirect(pathname: string) {
  if (pathname === '/') return '/en';
  if (LEGACY_REDIRECTS[pathname]) return LEGACY_REDIRECTS[pathname];
  if (CURRENT_PUBLIC_PATHS.has(pathname)) return `/en${pathname}`;
  return undefined;
}
```

Update `src/i18n/routing.ts`:

```ts
export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localeDetection: false,
  alternateLinks: false,
});
```

Update `src/middleware.ts` before the auth and next-intl branches:

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { getPermanentPublicRedirect } from './lib/public-redirects';

const publicRedirect = getPermanentPublicRedirect(request.nextUrl.pathname);
if (publicRedirect) {
  return NextResponse.redirect(new URL(publicRedirect, request.url), 308);
}
```

- [ ] **Step 4: Centralize final localized alternates**

Add to `src/lib/seo.ts` and use it from `createPageMetadata`:

```ts
export function createLocalizedAlternates(path: string) {
  const cleanPath = `/${path.replace(/^\/(en|fr)(?=\/|$)/, '').replace(/^\//, '')}`.replace(/\/$/, '');
  return {
    en: `${siteConfig.url}/en${cleanPath === '/' ? '' : cleanPath}`,
    fr: `${siteConfig.url}/fr${cleanPath === '/' ? '' : cleanPath}`,
    'x-default': `${siteConfig.url}/en${cleanPath === '/' ? '' : cleanPath}`,
  };
}
```

Set `alternates.languages` to `createLocalizedAlternates(normalizedPath)` and keep the current page URL as the canonical. In `src/app/[locale]/layout.tsx`, use `createLocalizedAlternates('/')` for locale-home language alternates so the root metadata follows the same final-URL rule.

- [ ] **Step 5: Run focused tests and commit**

Run: `npx tsx --test src/lib/public-redirects.test.ts src/lib/seo.test.ts src/app/sitemap.test.ts`

Expected: all tests PASS.

```bash
git add src/lib/public-redirects.ts src/lib/public-redirects.test.ts src/i18n/routing.ts src/middleware.ts src/lib/seo.ts src/lib/seo.test.ts src/app/[locale]/layout.tsx
git commit -m "fix: canonicalize public SEO routes"
```

---

### Task 2: Add the three audience acquisition paths without keyword cannibalization

**Files:**
- Create: `src/data/audiences.ts`
- Create: `src/data/audiences.test.ts`
- Modify: `src/app/[locale]/(growth)/[slug]/page.tsx`
- Create: `src/components/sections/home/AudiencePaths.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/sitemap.test.ts`

**Interfaces:**
- Produces `AudienceLandingPage`, `audienceLandingPages`, and `getAudienceLandingPage(slug)`.
- The growth route resolves a service first, then an audience page.
- Tourism continues to use the existing `tourism-websites-morocco` page.

- [ ] **Step 1: Write failing audience-data tests**

```ts
// src/data/audiences.test.ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { audienceLandingPages, getAudienceLandingPage } from './audiences';

test('defines only the two new non-overlapping audience pages', () => {
  assert.deepEqual(
    audienceLandingPages.map((page) => page.slug),
    ['website-design-moroccan-businesses', 'international-web-design-agency']
  );
});

test('provides complete English and French conversion copy', () => {
  for (const page of audienceLandingPages) {
    for (const locale of ['en', 'fr'] as const) {
      assert.ok(page.copy[locale].heading.length > 30);
      assert.equal(page.copy[locale].faqs.length, 3);
      assert.ok(page.relatedServiceSlugs.length >= 2);
    }
  }
  assert.equal(getAudienceLandingPage('missing'), undefined);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx tsx --test src/data/audiences.test.ts`

Expected: FAIL because `audiences.ts` does not exist.

- [ ] **Step 3: Add the localized audience data model**

Create `src/data/audiences.ts` using `ServiceLocaleCopy` from `services.ts`. Add exactly these two records:

```ts
import type { ServiceLocaleCopy } from './services';

export type AudienceLandingPage = {
  slug: 'website-design-moroccan-businesses' | 'international-web-design-agency';
  primaryKeyword: string;
  keywords: readonly string[];
  relatedProjectIds: readonly string[];
  relatedServiceSlugs: readonly string[];
  modifiedAt: string;
  copy: Record<'en' | 'fr', ServiceLocaleCopy>;
};

export const audienceLandingPages: readonly AudienceLandingPage[] = [
  {
    slug: 'website-design-moroccan-businesses',
    primaryKeyword: 'website design for Moroccan businesses',
    keywords: ['business website Morocco', 'website for small business Morocco', 'site web entreprise Maroc'],
    relatedProjectIds: ['yoo-marrakech', 'by-marrakech', 'kasbah-angour'],
    relatedServiceSlugs: ['web-design-marrakech', 'seo-landing-pages', 'agence-web-marrakech'],
    modifiedAt: '2026-07-22',
    copy: {
      en: {
        title: 'Website Design for Moroccan Businesses',
        description: 'Fast bilingual websites for Moroccan businesses that need local visibility, stronger trust, and more calls, WhatsApp conversations, and quote requests.',
        eyebrow: 'For Moroccan businesses',
        heading: 'A clearer website for the customers already looking for your business.',
        lead: 'WeReact helps local services, shops, restaurants, professional firms, and growing Moroccan teams explain their offer and turn visits into real conversations.',
        outcomesTitle: 'Built around local buying decisions',
        outcomes: ['Explain the offer clearly on mobile.', 'Connect local search visibility to calls and WhatsApp.', 'Present services, prices, and proof without confusion.', 'Support French and English customers from one structured site.'],
        proofTitle: 'Local context with modern execution',
        proof: 'Our Marrakech-based studio combines local market understanding with fast, measurable web delivery for businesses across Morocco.',
        cta: 'Plan my business website',
        ctaNote: 'Share your business and goal. We reply within one business day.',
        faqs: [
          { question: 'What Moroccan businesses do you work with?', answer: 'We work with local services, hospitality, tourism, professional firms, retail, restaurants, and small teams that need a credible path from search to contact.' },
          { question: 'Can the website use WhatsApp as the main contact route?', answer: 'Yes. We can make WhatsApp prominent while still keeping forms, email, and phone available for customers who prefer another method.' },
          { question: 'Can you improve an existing business website?', answer: 'Yes. We can review its content, mobile usability, speed, local search signals, and contact journey before proposing the smallest useful improvement or rebuild.' },
        ],
      },
      fr: {
        title: 'Création de site web pour entreprises marocaines',
        description: 'Des sites bilingues et rapides pour les entreprises marocaines qui veulent plus de visibilité locale, de confiance, d’appels, de messages WhatsApp et de demandes de devis.',
        eyebrow: 'Pour les entreprises marocaines',
        heading: 'Un site plus clair pour les clients qui cherchent déjà votre entreprise.',
        lead: 'WeReact aide les services locaux, commerces, restaurants, cabinets et équipes marocaines en croissance à présenter leur offre et transformer les visites en vraies conversations.',
        outcomesTitle: 'Pensé pour les décisions d’achat locales',
        outcomes: ['Présenter clairement l’offre sur mobile.', 'Relier la visibilité locale aux appels et à WhatsApp.', 'Expliquer services, tarifs et preuves sans confusion.', 'Servir les clients francophones et anglophones sur un site structuré.'],
        proofTitle: 'Contexte local, exécution moderne',
        proof: 'Notre studio basé à Marrakech associe connaissance du marché marocain et réalisation web rapide et mesurable.',
        cta: 'Préparer mon site professionnel',
        ctaNote: 'Présentez votre entreprise et votre objectif. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'Avec quelles entreprises marocaines travaillez-vous ?', answer: 'Nous travaillons avec les services locaux, l’hôtellerie, le tourisme, les cabinets, le commerce, la restauration et les petites équipes qui ont besoin d’un parcours crédible entre Google et le contact.' },
          { question: 'WhatsApp peut-il être le contact principal du site ?', answer: 'Oui. Nous pouvons mettre WhatsApp en avant tout en conservant formulaire, e-mail et téléphone pour les clients qui préfèrent un autre canal.' },
          { question: 'Pouvez-vous améliorer un site professionnel existant ?', answer: 'Oui. Nous pouvons analyser son contenu, son expérience mobile, sa vitesse, ses signaux locaux et son parcours de contact avant de proposer une amélioration ciblée ou une refonte.' },
        ],
      },
    },
  },
  {
    slug: 'international-web-design-agency',
    primaryKeyword: 'international web design agency Morocco',
    keywords: ['web development agency Morocco', 'bilingual web agency', 'nearshore web development Morocco'],
    relatedProjectIds: ['your-morocco', 'kasbah-angour', 'flying-tandem'],
    relatedServiceSlugs: ['web-design-marrakech', 'seo-landing-pages'],
    modifiedAt: '2026-07-22',
    copy: {
      en: {
        title: 'International Web Design Agency in Morocco',
        description: 'A Morocco-based web design partner for international founders, agencies, and teams needing clear delivery, bilingual capability, and modern development.',
        eyebrow: 'Marrakech to the world',
        heading: 'A responsive Morocco-based web partner for international teams.',
        lead: 'WeReact works remotely in English and French, from focused landing pages to multilingual websites and custom digital experiences with clear scope and handoff.',
        outcomesTitle: 'A practical remote partnership',
        outcomes: ['Clear scope, timeline, and communication before build.', 'English and French content structures planned together.', 'Modern performance-minded implementation and ownership handoff.', 'Ongoing care available after launch without platform lock-in.'],
        proofTitle: 'Built for international audiences',
        proof: 'Our tourism and hospitality work is designed for visitors comparing Moroccan businesses from abroad, where language, mobile trust, and clarity matter.',
        cta: 'Discuss an international project',
        ctaNote: 'Share the scope, market, and launch goal. We reply within one business day.',
        faqs: [
          { question: 'Can WeReact work fully remotely?', answer: 'Yes. Discovery, review, delivery, and handoff can all run remotely with clear written checkpoints.' },
          { question: 'Which languages do you support?', answer: 'We work in English and French and can structure multilingual sites so each language has its own crawlable pages and metadata.' },
          { question: 'Can you collaborate with an existing agency or team?', answer: 'Yes. We can own a complete website or work within an agreed design, development, content, or landing-page scope.' },
        ],
      },
      fr: {
        title: 'Agence web internationale basée au Maroc',
        description: 'Un partenaire web basé au Maroc pour les fondateurs, agences et équipes internationales qui recherchent une livraison claire, une capacité bilingue et un développement moderne.',
        eyebrow: 'De Marrakech vers le monde',
        heading: 'Un partenaire web réactif au Maroc pour les équipes internationales.',
        lead: 'WeReact travaille à distance en français et en anglais, des landing pages ciblées aux sites multilingues et expériences digitales sur mesure, avec un périmètre et une livraison clairs.',
        outcomesTitle: 'Une collaboration à distance concrète',
        outcomes: ['Périmètre, calendrier et communication définis avant la réalisation.', 'Structures de contenu françaises et anglaises pensées ensemble.', 'Développement moderne orienté performance et transfert de propriété.', 'Maintenance disponible après lancement sans dépendance à une plateforme.'],
        proofTitle: 'Conçu pour des audiences internationales',
        proof: 'Nos projets tourisme et hôtellerie s’adressent à des visiteurs qui comparent des entreprises marocaines depuis l’étranger, où langue, confiance mobile et clarté comptent.',
        cta: 'Discuter d’un projet international',
        ctaNote: 'Partagez le périmètre, le marché et l’objectif de lancement. Nous répondons sous un jour ouvré.',
        faqs: [
          { question: 'WeReact peut-elle travailler entièrement à distance ?', answer: 'Oui. La découverte, les validations, la livraison et le transfert peuvent se dérouler à distance avec des points de contrôle écrits et clairs.' },
          { question: 'Quelles langues prenez-vous en charge ?', answer: 'Nous travaillons en français et en anglais et structurons les sites multilingues avec des pages et métadonnées explorables pour chaque langue.' },
          { question: 'Pouvez-vous collaborer avec une agence ou une équipe existante ?', answer: 'Oui. Nous pouvons prendre en charge tout le site ou intervenir sur un périmètre défini de design, développement, contenu ou landing page.' },
        ],
      },
    },
  },
];

export function getAudienceLandingPage(slug: string) {
  return audienceLandingPages.find((page) => page.slug === slug);
}
```

- [ ] **Step 4: Reuse the growth page shell and add homepage paths**

In the growth route, resolve with:

```ts
const page = getServiceLandingPage(slug) ?? getAudienceLandingPage(slug);
```

Add `AudiencePaths.tsx` as an unframed three-column section with links to:

```ts
const paths = {
  en: [
    ['/tourism-websites-morocco', 'Tourism & hospitality', 'Websites built around discovery, trust, and direct enquiries.'],
    ['/website-design-moroccan-businesses', 'Moroccan businesses', 'Local visibility and clearer paths to calls, WhatsApp, and quotes.'],
    ['/international-web-design-agency', 'International teams', 'Bilingual remote delivery from Marrakech to the world.'],
  ],
  fr: [
    ['/tourism-websites-morocco', 'Tourisme & hôtellerie', 'Des sites pensés pour la découverte, la confiance et les demandes directes.'],
    ['/website-design-moroccan-businesses', 'Entreprises marocaines', 'Visibilité locale et parcours clairs vers appels, WhatsApp et devis.'],
    ['/international-web-design-agency', 'Équipes internationales', 'Une livraison bilingue à distance depuis Marrakech.'],
  ],
} as const;
```

Insert `AudiencePaths` after `Manifesto` in `src/app/[locale]/page.tsx`.

- [ ] **Step 5: Add audience pages to sitemap and verify**

Add `audienceLandingPages` to the sitemap using each page's `modifiedAt`, priority `0.88`, and both locales. Extend the sitemap test to assert the two new English and French URLs.

Run: `npx tsx --test src/data/audiences.test.ts src/app/sitemap.test.ts src/lib/seo.test.ts && npm run build`

Expected: tests PASS and all four new localized routes appear in the build output.

```bash
git add src/data/audiences.ts src/data/audiences.test.ts src/app/[locale]/\(growth\)/[slug]/page.tsx src/components/sections/home/AudiencePaths.tsx src/app/[locale]/page.tsx src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "feat: add multi-market audience paths"
```

---

### Task 3: Fully localize the blog and recover stale search traffic

**Files:**
- Create: `src/data/blog-ui.ts`
- Create: `src/data/blog-ui.test.ts`
- Modify: `src/app/[locale]/blog/page.tsx`
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`
- Modify: `src/data/blog.ts`
- Modify: `messages/en.json`
- Modify: `messages/fr.json`

**Interfaces:**
- Produces `getBlogUi(locale)` with every listing/article interface label.
- Blog metadata is locale-specific.
- Each article exposes `relatedAudienceSlug` and keeps one related service.

- [ ] **Step 1: Write failing localization tests**

```ts
// src/data/blog-ui.test.ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { getBlogUi } from './blog-ui';

test('uses French metadata and action copy on French blog pages', () => {
  const fr = getBlogUi('fr');
  assert.match(fr.indexTitle, /Journal/);
  assert.match(fr.indexDescription, /Marrakech|Maroc/);
  assert.equal(fr.readArticle, 'Lire l’article');
  assert.equal(fr.contact, 'Nous contacter');
});

test('falls back to English for unsupported locales', () => {
  assert.equal(getBlogUi('de').readArticle, 'Read article');
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx tsx --test src/data/blog-ui.test.ts src/data/blog.test.ts`

Expected: FAIL because `blog-ui.ts` does not exist.

- [ ] **Step 3: Add complete UI dictionaries**

```ts
// src/data/blog-ui.ts
const BLOG_UI = {
  en: {
    indexTitle: 'WeReact Journal - Web Design, SEO, and Growth in Morocco',
    indexDescription: 'Practical guidance on web design, local SEO, tourism websites, performance, and conversion from WeReact in Marrakech.',
    journal: 'WeReact Journal',
    hero: 'Ideas for brands that need to be found.',
    heroCopy: 'Practical notes on web design, local SEO, tourism growth, and content structure from our Marrakech studio.',
    featured: 'Featured insight',
    allNotes: 'All notes',
    back: 'Journal index',
    latest: 'Latest briefings',
    nextStep: 'Practical next step',
    exploreService: 'Explore the service',
    readArticle: 'Read article',
    contact: 'Contact us',
    contactTitle: 'Turn useful insight into a stronger website.',
  },
  fr: {
    indexTitle: 'Journal WeReact - Création web, SEO et croissance au Maroc',
    indexDescription: 'Conseils pratiques sur la création web, le SEO local, les sites tourisme, la performance et la conversion par WeReact à Marrakech.',
    journal: 'Journal WeReact',
    hero: 'Des idées pour les marques qui doivent être trouvées.',
    heroCopy: 'Notes pratiques sur la création web, le SEO local, la croissance tourisme et la structure de contenu depuis notre studio à Marrakech.',
    featured: 'Article à la une',
    allNotes: 'Tous les articles',
    back: 'Retour au journal',
    latest: 'Derniers articles',
    nextStep: 'Prochaine étape concrète',
    exploreService: 'Découvrir le service',
    readArticle: 'Lire l’article',
    contact: 'Nous contacter',
    contactTitle: 'Transformez une idée utile en un site plus performant.',
  },
} as const;

export function getBlogUi(locale: string) {
  return BLOG_UI[locale === 'fr' ? 'fr' : 'en'];
}
```

- [ ] **Step 4: Replace every hardcoded article/listing label**

Use `const ui = getBlogUi(locale)` in both routes. Localize index metadata with `ui.indexTitle` and `ui.indexDescription`. Replace `Journal index`, `Practical next step`, `Explore the service`, `Latest Briefings`, `Contact Us`, hero copy, and listing labels with dictionary fields.

Add this field to each blog record:

```ts
relatedAudienceSlug:
  | 'tourism-websites-morocco'
  | 'website-design-moroccan-businesses'
  | 'international-web-design-agency';
```

Assign the pricing, Marrakech design, and AI SEO posts to `website-design-moroccan-businesses`; assign the tourism post to `tourism-websites-morocco`.

- [ ] **Step 5: Run tests and commit**

Run: `npx tsx --test src/data/blog-ui.test.ts src/data/blog.test.ts src/lib/public-redirects.test.ts && npm run build`

Expected: tests PASS; `/fr/blog` metadata and visible labels are French; the old minimalist article returns a 308 to a live relevant article.

```bash
git add src/data/blog-ui.ts src/data/blog-ui.test.ts src/data/blog.ts src/app/[locale]/blog/page.tsx src/app/[locale]/blog/[slug]/page.tsx messages/en.json messages/fr.json
git commit -m "fix: complete bilingual blog SEO"
```

---

### Task 4: Replace testimonial styling with truthful project evidence

**Files:**
- Modify: `src/data/projects.ts`
- Create: `src/data/projects.test.ts`
- Modify: `src/components/sections/home/Testimonials.tsx`
- Modify: `messages/en.json`
- Modify: `messages/fr.json`
- Modify: `src/app/[locale]/work/[id]/page.tsx`
- Modify: `src/app/[locale]/work/[id]/layout.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/sitemap.test.ts`

**Interfaces:**
- Every project exposes `relationship: 'client-work' | 'studio-owned' | 'independent-project'`.
- Home proof cards render project evidence without quotation semantics.
- Project pages expose factual `CreativeWork` JSON-LD.

- [ ] **Step 1: Add a failing project integrity test**

Create `src/data/projects.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { projects } from './projects';

test('labels every project relationship and avoids unsupported metrics', () => {
  for (const project of projects) {
    assert.ok(['client-work', 'studio-owned', 'independent-project'].includes(project.relationship));
    assert.ok(project.caseStudy.challenge.length > 30);
    assert.ok(project.externalUrl.startsWith('https://'));
  }
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx tsx --test src/data/projects.test.ts`

Expected: FAIL because projects do not expose `relationship`.

- [ ] **Step 3: Add factual relationship values**

Use these assignments:

```ts
const relationshipByProject = {
  'flying-tandem': 'client-work',
  'kasbah-angour': 'client-work',
  'your-morocco': 'client-work',
  'by-marrakech': 'independent-project',
  'trust-drivers': 'studio-owned',
  'yoo-marrakech': 'studio-owned',
  'morocco-atlas-guide': 'studio-owned',
} as const;
```

Store the value directly on each project record, add the union to `Project`, and add `modifiedAt: '2026-07-22'` to every project because the public case-study content is updated in this release. Update project sitemap entries to use `new Date(project.modifiedAt)` instead of build time.

- [ ] **Step 4: Remove testimonial semantics**

Rename the component export to `ProjectEvidence`, render `<article>` instead of `<figure>`, render the summary as a normal paragraph, and remove quotation language. Keep the existing sticky-card layout so the visual design stays intact.

Update translation labels:

```json
{
  "eyebrow": "Selected work",
  "title": "What each project was built to solve",
  "proofLabel": "Project evidence"
}
```

French:

```json
{
  "eyebrow": "Projets sélectionnés",
  "title": "Le problème que chaque projet devait résoudre",
  "proofLabel": "Éléments du projet"
}
```

- [ ] **Step 5: Add CreativeWork schema and commit**

Use project title, URL, image, description, dateCreated/year, creator business `@id`, and `inLanguage`; do not add ratings or numeric outcomes.

Run: `npx tsx --test src/data/projects.test.ts src/lib/seo.test.ts && npm run build`

Expected: tests PASS and project pages render factual schema.

```bash
git add src/data/projects.ts src/data/projects.test.ts src/components/sections/home/Testimonials.tsx messages/en.json messages/fr.json src/app/[locale]/work/[id]/page.tsx src/app/[locale]/work/[id]/layout.tsx src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "fix: present project proof truthfully"
```

---

### Task 5: Improve lead qualification without reducing form accessibility

**Files:**
- Modify: `src/lib/contact.ts`
- Modify: `src/lib/contact.test.ts`
- Modify: `src/lib/leads.ts`
- Modify: `src/lib/leads.test.ts`
- Modify: `src/app/[locale]/contact/page.tsx`
- Modify: `src/components/GrowthCtas.tsx`
- Modify: `messages/en.json`
- Modify: `messages/fr.json`

**Interfaces:**
- Adds optional `projectType`, `budget`, and `timeline` to `ContactSubmission`.
- Qualification values are selected from allowlists and folded into the existing stored lead message, avoiding a database migration.
- Adds allowlisted `source_page` attribution from audience and service CTAs so the CRM record preserves the page that initiated contact.
- Analytics receives only booleans/categories, never contact details or free-text content.

- [ ] **Step 1: Write failing validation and lead-format tests**

```ts
test('accepts allowlisted optional qualification values', () => {
  const result = validateContactSubmission({
    name: 'Amina',
    email: 'amina@example.com',
    projectType: 'tourism',
    budget: '5000-10000',
    timeline: 'within-month',
  });
  assert.equal(result.valid, true);
});

test('rejects forged qualification values', () => {
  const result = validateContactSubmission({
    name: 'Amina',
    email: 'amina@example.com',
    projectType: 'forged' as never,
  });
  assert.equal(result.valid, false);
});

test('stores qualification inside the existing lead message', () => {
  const lead = createLeadRecord({
    name: 'Amina',
    email: 'amina@example.com',
    projectType: 'tourism',
    budget: '5000-10000',
    timeline: 'within-month',
    message: 'We need a bilingual booking website.',
  });
  assert.match(lead.message, /Project type: tourism/);
  assert.match(lead.message, /Budget: 5000-10000/);
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx tsx --test src/lib/contact.test.ts src/lib/leads.test.ts`

Expected: FAIL because the fields and validation do not exist.

- [ ] **Step 3: Add typed allowlists and formatting**

```ts
export const PROJECT_TYPES = ['tourism', 'local-business', 'international', 'ecommerce', 'landing-page', 'other'] as const;
export const BUDGET_RANGES = ['under-5000', '5000-10000', '10000-25000', '25000-plus', 'not-sure'] as const;
export const TIMELINES = ['asap', 'within-month', 'one-three-months', 'flexible'] as const;

type ProjectType = (typeof PROJECT_TYPES)[number];
type BudgetRange = (typeof BUDGET_RANGES)[number];
type ProjectTimeline = (typeof TIMELINES)[number];
```

Validate non-empty values with `includes`. In `createLeadRecord`, prepend non-empty qualification lines to the existing message and keep the database record shape unchanged.

- [ ] **Step 4: Add three optional native selects**

Use visible labels, native `<select>` elements, and localized options. Keep `name` and `email` required and all new selects optional. Include `project_type`, `budget_range`, and `timeline` as category-level analytics parameters only. Add `source_page` to the `LeadAttribution` allowlist, make growth-page contact links use `/${locale}/contact?from=${page.slug}`, and copy only an allowlisted `from` value into submission attribution.

- [ ] **Step 5: Run tests and commit**

Run: `npx tsx --test src/lib/contact.test.ts src/lib/leads.test.ts src/lib/analytics.test.ts && npm run build`

Expected: tests PASS and the contact build remains valid.

```bash
git add src/lib/contact.ts src/lib/contact.test.ts src/lib/leads.ts src/lib/leads.test.ts src/app/[locale]/contact/page.tsx src/components/GrowthCtas.tsx messages/en.json messages/fr.json
git commit -m "feat: qualify website project enquiries"
```

---

### Task 6: Tighten entity, article, and project schema for GEO

**Files:**
- Modify: `src/lib/seo.ts`
- Modify: `src/lib/seo.test.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/sections/home/Manifesto.tsx`
- Modify: `messages/en.json`
- Modify: `messages/fr.json`
- Modify: `public/llms.txt`

**Interfaces:**
- Produces stable `createBusinessJsonLd`, `createWebsiteJsonLd`, and `createProjectJsonLd` helpers.
- Organization/local business schema appears once on each localized homepage, not on every page.
- Homepage manifesto includes a visible factual credentials line.

- [ ] **Step 1: Write failing schema placement and identity tests**

```ts
test('uses stable business and website identifiers', () => {
  const business = createBusinessJsonLd();
  const website = createWebsiteJsonLd();
  assert.equal(business['@id'], 'https://www.wereact.agency/#business');
  assert.equal(website.publisher['@id'], business['@id']);
  assert.equal(business.email, 'hello@wereact.agency');
});

test('creates factual CreativeWork schema without ratings', () => {
  const project = projects[0];
  const schema = createProjectJsonLd(project, 'en');
  assert.equal(schema['@type'], 'CreativeWork');
  assert.equal('aggregateRating' in schema, false);
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx tsx --test src/lib/seo.test.ts`

Expected: FAIL because the exported schema helpers do not exist.

- [ ] **Step 3: Move schema objects into tested builders**

Move the current layout constants into `src/lib/seo.ts`, preserve real business facts, and return serializable objects. Remove the business and website scripts from `src/app/[locale]/layout.tsx`; render them in `src/app/[locale]/page.tsx` beside the existing service schema.

- [ ] **Step 4: Add visible credentials and update `llms.txt`**

Add these localized manifesto lines:

```json
"credentials": "Marrakech-based studio · English and French · Business websites, tourism platforms, landing pages, e-commerce, and ongoing care."
```

```json
"credentials": "Studio basé à Marrakech · Français et anglais · Sites professionnels, plateformes tourisme, landing pages, e-commerce et maintenance."
```

Update `llms.txt` to list the tourism, Moroccan-business, and international audience URLs; clarify that 2–3 day delivery applies to defined-scope builds and complex booking/e-commerce work receives a scoped timeline.

- [ ] **Step 5: Verify and commit**

Run: `npx tsx --test src/lib/seo.test.ts src/data/projects.test.ts && npm run build`

Expected: tests PASS; schema is present on home/project pages only where relevant.

```bash
git add src/lib/seo.ts src/lib/seo.test.ts src/app/[locale]/layout.tsx src/app/[locale]/page.tsx src/components/sections/home/Manifesto.tsx messages/en.json messages/fr.json public/llms.txt
git commit -m "feat: strengthen GEO entity signals"
```

---

### Task 7: Add Bing IndexNow support

**Files:**
- Create: `src/lib/indexnow.ts`
- Create: `src/lib/indexnow.test.ts`
- Create: `scripts/submit-indexnow.ts`
- Create: `public/7c48682a-ebbb-4816-83b4-28ae3c0a2cc3.txt`
- Modify: `package.json`
- Create: `docs/seo-growth-operations.md`

**Interfaces:**
- Produces `createIndexNowPayload(urls, key)` and `isAcceptedIndexNowStatus(status)`.
- Adds `npm run seo:indexnow` as an explicit post-deployment command.
- Uses key `7c48682a-ebbb-4816-83b4-28ae3c0a2cc3` and the matching root key file.

- [ ] **Step 1: Write failing payload tests**

```ts
// src/lib/indexnow.test.ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { createIndexNowPayload, isAcceptedIndexNowStatus } from './indexnow';

const key = '7c48682a-ebbb-4816-83b4-28ae3c0a2cc3';

test('submits only canonical public WeReact URLs', () => {
  const payload = createIndexNowPayload([
    'https://www.wereact.agency/en',
    'https://www.wereact.agency/fr/blog',
    'https://www.wereact.agency/admin',
    'https://example.com/en',
  ], key);
  assert.deepEqual(payload.urlList, [
    'https://www.wereact.agency/en',
    'https://www.wereact.agency/fr/blog',
  ]);
  assert.equal(payload.keyLocation, `https://www.wereact.agency/${key}.txt`);
});

test('accepts IndexNow success and pending-validation responses', () => {
  assert.equal(isAcceptedIndexNowStatus(200), true);
  assert.equal(isAcceptedIndexNowStatus(202), true);
  assert.equal(isAcceptedIndexNowStatus(422), false);
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npx tsx --test src/lib/indexnow.test.ts`

Expected: FAIL because `indexnow.ts` does not exist.

- [ ] **Step 3: Implement filtering and payload construction**

```ts
// src/lib/indexnow.ts
import { siteConfig } from '@/config/site';

const PRIVATE_PREFIXES = ['/admin', '/crm', '/api', '/unsubscribe'];

export function createIndexNowPayload(urls: readonly string[], key: string) {
  const canonical = new URL(siteConfig.url);
  const urlList = [...new Set(urls)].filter((value) => {
    const url = new URL(value);
    return url.origin === canonical.origin && !PRIVATE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
  });

  return {
    host: canonical.host,
    key,
    keyLocation: `${canonical.origin}/${key}.txt`,
    urlList,
  };
}

export function isAcceptedIndexNowStatus(status: number) {
  return status === 200 || status === 202;
}
```

- [ ] **Step 4: Add the submission script and key file**

The key file contains exactly:

```text
7c48682a-ebbb-4816-83b4-28ae3c0a2cc3
```

The script imports `sitemap()`, builds the payload, POSTs JSON to `https://api.indexnow.org/indexnow`, times out after 15 seconds, prints the submitted URL count, and exits non-zero for statuses other than `200` or `202`.

```ts
// scripts/submit-indexnow.ts
import sitemap from '../src/app/sitemap';
import { createIndexNowPayload, isAcceptedIndexNowStatus } from '../src/lib/indexnow';

const INDEXNOW_KEY = '7c48682a-ebbb-4816-83b4-28ae3c0a2cc3';
const payload = createIndexNowPayload(
  sitemap().map((entry) => entry.url),
  INDEXNOW_KEY
);

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(15_000),
});

if (!isAcceptedIndexNowStatus(response.status)) {
  const detail = await response.text();
  console.error(`IndexNow rejected ${payload.urlList.length} URLs (${response.status}): ${detail}`);
  process.exitCode = 1;
} else {
  console.log(`IndexNow accepted ${payload.urlList.length} canonical URLs (${response.status}).`);
}
```

Add to `package.json`:

```json
"seo:indexnow": "tsx scripts/submit-indexnow.ts"
```

- [ ] **Step 5: Document account-level Bing work**

`docs/seo-growth-operations.md` must include:

- Import the verified property from Google Search Console into Bing Webmaster Tools.
- Submit `https://www.wereact.agency/sitemap.xml`.
- Run `npm run seo:indexnow` only after deployment and after confirming the key URL returns `200`.
- Inspect audience hubs in Google and Bing.
- Align Google Business Profile details with `siteConfig`.
- Collect approved client reviews and backlinks without bulk-directory or paid-link schemes.
- Review qualified leads, landing pages, non-brand queries, and conversion rate monthly.

- [ ] **Step 6: Test without performing a live submission and commit**

Run: `npx tsx --test src/lib/indexnow.test.ts && npm run build`

Expected: tests PASS and the key file is included in the public build. Do not run `npm run seo:indexnow` before production deployment.

```bash
git add src/lib/indexnow.ts src/lib/indexnow.test.ts scripts/submit-indexnow.ts public/7c48682a-ebbb-4816-83b4-28ae3c0a2cc3.txt package.json docs/seo-growth-operations.md
git commit -m "feat: add Bing IndexNow discovery"
```

---

### Task 8: Run the full SEO, conversion, and production verification gate

**Files:**
- Modify only files required by failures found in this task.

**Interfaces:**
- No new public interface. This task proves the complete implementation against the approved specification.

- [ ] **Step 1: Run all automated tests**

Run: `npm test`

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code `0` with no ESLint errors.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: exit code `0`; both locales, all audience pages, service pages, article pages, and project pages appear in the route output.

- [ ] **Step 4: Inspect generated public endpoints locally**

Start the production server on an unused local port and verify:

```text
/                              -> 308 /en
/en                            -> 200
/fr                            -> 200
/en/website-design-moroccan-businesses -> 200
/fr/website-design-moroccan-businesses -> 200
/en/international-web-design-agency     -> 200
/fr/international-web-design-agency     -> 200
/blog/minimalist-design-trends          -> 308 final article
/not-a-real-page                         -> 404
/robots.txt                              -> 200
/sitemap.xml                             -> 200
/7c48682a-ebbb-4816-83b4-28ae3c0a2cc3.txt -> 200
```

Confirm canonical, `hreflang`, `x-default`, title, description, and JSON-LD on English/French home, audience, blog, article, and project samples.

- [ ] **Step 5: Check public-page layouts at desktop and mobile widths**

Use 1440×900 and 375×812 viewports. Verify no overlap, horizontal overflow, hidden CTA, untranslated French labels, form label problems, or broken images on home, one audience page, French blog, one article, one project, and contact.

- [ ] **Step 6: Review requirements and commit any verification fixes**

Re-read `docs/superpowers/specs/2026-07-22-multi-market-seo-geo-growth-design.md` line by line. Confirm each success criterion with a test, generated endpoint, or visual check.

If verification required fixes, run `git status --short`, inspect every changed path, stage only the exact public-site files changed during this verification task, and commit them with `git commit -m "fix: complete SEO growth verification"`. If verification changes no files, do not create an empty commit.

Do not push or submit IndexNow until the user reviews the final diff and authorizes deployment.

