# GreenOps Full-Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the full WeReact agency site into a cohesive GreenOps Studio experience with generated bitmap assets, richer project showcase content, local SEO/GEO improvements, and new search-friendly blog posts.

**Architecture:** Build a small shared GreenOps layer for content, SEO helpers, generated visuals, and reusable UI primitives, then refactor homepage sections and inner pages to consume that language. Keep the app as a Next.js App Router site with existing Tailwind, Framer Motion, lucide-react, next-intl, and local Nohemi font patterns.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4 tokens, Framer Motion, lucide-react, next-intl, Sharp for generated bitmap/WebP assets.

## Global Constraints

- Font: keep Nohemi as the site font for display, body, buttons, labels, and metadata.
- Colors: keep the existing WeReact palette only: primary green `#3A5A40`, dark green `#2e4833`, warm off-white `#F6F6F2`, white, near-black, muted gray, warm light accent `#E3E3DC`, and sage `#A3B18A`.
- Do not use the Vertex neon lime or black palette directly.
- Keep sharp UI geometry: cards and controls at 8px radius or less, with strong rectangular composition.
- Save all project-bound generated assets inside `public/images/` and reference them from the app.
- Include these requested showcase domains: `www.trustdrivers.tours`, `www.yoomarrakech.com`, `www.moroccoatlasguide.com`.
- Blog content should read like professional guidance, not keyword stuffing.
- Preserve existing uncommitted user changes unless a task explicitly modifies the same file for the redesign.

---

## File Structure

- Create `src/data/projects.ts`: single source of truth for all showcase entries and case-study details.
- Create `src/lib/seo.ts`: metadata and JSON-LD helpers for page and article SEO/GEO.
- Create `src/components/greenops/OpsBadge.tsx`: compact status/category badge.
- Create `src/components/greenops/OpsPanel.tsx`: reusable bordered operational panel.
- Create `src/components/greenops/SectionHeader.tsx`: shared section heading and label treatment.
- Create `src/components/greenops/ProjectVisual.tsx`: image/card visual for real projects and generated domain cards.
- Create `scripts/generate-greenops-assets.mjs`: Sharp-based asset generator.
- Create generated assets under `public/images/greenops/`.
- Modify `src/app/globals.css`: add GreenOps texture, focus, utility classes, and selection styling using current tokens.
- Modify `src/components/Button.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`: shared chrome redesign.
- Modify homepage sections in `src/components/sections/*.tsx`: GreenOps homepage redesign.
- Modify inner pages in `src/app/[locale]/**/page.tsx`: GreenOps route-level redesign and metadata.
- Modify `src/data/blog.ts`: add 1-2 SEO/GEO-friendly blog posts.
- Modify `src/app/sitemap.ts`: ensure new blog posts and work pages are included.

---

### Task 1: Add Shared Project Data And Content Verification

**Files:**
- Create: `src/data/projects.ts`
- Create: `scripts/verify-greenops-content.ts`

**Interfaces:**
- Produces: `projects: Project[]`, `featuredProjects: Project[]`, `getProjectById(id: string): Project | undefined`
- Produces: `Project` type with `id`, `title`, `domain`, `category`, `summary`, `image`, `imageFull`, `status`, `metrics`, `services`, `caseStudy`, and `externalUrl`
- Consumes: `siteConfig.business.services` and existing project images

- [ ] **Step 1: Write the failing content verification script**

Create `scripts/verify-greenops-content.ts`:

```ts
import { blogPosts } from '../src/data/blog';
import { projects } from '../src/data/projects';
import { siteConfig } from '../src/config/site';

const requiredDomains = [
  'www.trustdrivers.tours',
  'www.yoomarrakech.com',
  'www.moroccoatlasguide.com',
];

const missingDomains = requiredDomains.filter(
  (domain) => !projects.some((project) => project.domain === domain)
);

if (missingDomains.length > 0) {
  throw new Error(`Missing showcase domains: ${missingDomains.join(', ')}`);
}

if (!projects.every((project) => project.metrics.length >= 2)) {
  throw new Error('Every project needs at least two metrics.');
}

if (!siteConfig.business.areaServed.includes('Marrakech')) {
  throw new Error('Marrakech must remain in areaServed for local SEO.');
}

const geoPosts = blogPosts.filter((post) =>
  `${post.title} ${post.excerpt} ${post.metaDescription ?? ''} ${post.tags.join(' ')}`
    .toLowerCase()
    .includes('marrakech')
);

if (geoPosts.length < 2) {
  throw new Error('At least two blog posts must target Marrakech/local search intent.');
}

console.log(`GreenOps content verified: ${projects.length} projects, ${blogPosts.length} posts.`);
```

- [ ] **Step 2: Run the verification script to confirm it fails**

Run: `npx tsx scripts/verify-greenops-content.ts`

Expected: FAIL with `Cannot find module '../src/data/projects'`.

- [ ] **Step 3: Implement project data**

Create `src/data/projects.ts` with this structure and content:

```ts
export type ProjectMetric = {
  label: string;
  value: string;
  detail: string;
};

export type Project = {
  id: string;
  title: string;
  domain: string;
  externalUrl: string;
  category: string;
  summary: string;
  year: string;
  status: 'live' | 'featured' | 'indexed';
  image: string;
  imageFull?: string;
  services: string[];
  metrics: ProjectMetric[];
  caseStudy: {
    challenge: string;
    response: string;
    outcome: string[];
  };
};

export const projects: Project[] = [
  {
    id: 'flying-tandem',
    title: 'Flying Tandem',
    domain: 'flyingtandem.com',
    externalUrl: 'https://www.flyingtandem.com/',
    category: 'Adventure Tourism Website',
    summary: 'A high-trust adventure tourism website for paragliding bookings, safety content, and mobile-first discovery.',
    year: '2025',
    status: 'featured',
    image: '/images/projects/flying-tandem.webp',
    imageFull: '/images/projects/flying-tandem-full.webp',
    services: ['Booking flow', 'Performance', 'Mobile UX'],
    metrics: [
      { label: 'Mobile ready', value: '100%', detail: 'Built for visitors booking while traveling.' },
      { label: 'Sector', value: 'Tourism', detail: 'Adventure experience positioning.' },
    ],
    caseStudy: {
      challenge: 'Turn a high-adrenaline local activity into a trustworthy online booking experience.',
      response: 'WeReact structured the website around safety, clarity, visual confidence, and fast mobile paths.',
      outcome: ['Clear experience pages', 'Direct inquiry flow', 'Performance-minded build'],
    },
  },
  {
    id: 'kasbah-angour',
    title: 'Kasbah Angour',
    domain: 'kasbahangour.com',
    externalUrl: 'https://www.kasbahangour.com/en',
    category: 'Hospitality Website',
    summary: 'A hospitality website built to communicate Moroccan character, direct booking confidence, and premium place discovery.',
    year: '2025',
    status: 'featured',
    image: '/images/projects/kasbah-angour.webp',
    imageFull: '/images/projects/kasbah-angour-full.webp',
    services: ['Hospitality UX', 'SEO structure', 'Direct inquiries'],
    metrics: [
      { label: 'Intent', value: 'Stay', detail: 'Rooms, location, and booking content aligned.' },
      { label: 'Market', value: 'Travel', detail: 'Built for international hospitality search.' },
    ],
    caseStudy: {
      challenge: 'Present a real place with enough detail and trust for travelers to inquire directly.',
      response: 'WeReact organized the experience around visual inspection, room discovery, and clear contact routes.',
      outcome: ['Place-led storytelling', 'Mobile-friendly browsing', 'Search-ready content structure'],
    },
  },
  {
    id: 'your-morocco',
    title: 'Your Morocco',
    domain: 'your-morocco.com',
    externalUrl: 'https://your-morocco.com/en',
    category: 'Travel Platform',
    summary: 'A Morocco travel platform for curated tours, local experiences, and multilingual destination discovery.',
    year: '2025',
    status: 'featured',
    image: '/images/projects/your-morocco.webp',
    imageFull: '/images/projects/your-morocco-full.webp',
    services: ['Travel UX', 'Multilingual structure', 'Tour discovery'],
    metrics: [
      { label: 'Content depth', value: 'Tour-led', detail: 'Experience pages designed for comparison.' },
      { label: 'Reach', value: 'Global', detail: 'Built for Morocco travel audiences.' },
    ],
    caseStudy: {
      challenge: 'Make Moroccan travel offers easy to scan, compare, and trust.',
      response: 'WeReact focused on structured tour discovery, readable content, and strong mobile performance.',
      outcome: ['Tour catalogue structure', 'Destination-led SEO', 'Clear inquiry routes'],
    },
  },
  {
    id: 'by-marrakech',
    title: 'By Marrakech',
    domain: 'by-marrakech.vercel.app',
    externalUrl: 'https://by-marrakech.vercel.app/en',
    category: 'City Guide',
    summary: 'A modern Marrakech guide experience for places, culture, and destination content.',
    year: '2025',
    status: 'featured',
    image: '/images/projects/by-marrakech.webp',
    imageFull: '/images/projects/by-marrakech-full.webp',
    services: ['City guide UX', 'i18n', 'Content systems'],
    metrics: [
      { label: 'Location', value: 'Marrakech', detail: 'Built around city discovery.' },
      { label: 'Format', value: 'Guide', detail: 'Designed for browsing and exploration.' },
    ],
    caseStudy: {
      challenge: 'Create a digital guide that feels fast, local, and useful on the move.',
      response: 'WeReact designed a clean content system with strong categories and mobile-first reading.',
      outcome: ['Guide-style browsing', 'Marrakech location signals', 'Reusable content sections'],
    },
  },
  {
    id: 'trust-drivers',
    title: 'Trust Drivers Tours',
    domain: 'www.trustdrivers.tours',
    externalUrl: 'https://www.trustdrivers.tours/',
    category: 'Private Transport And Tours',
    summary: 'A trust-forward tour and driver website concept for visitors comparing transport options in Morocco.',
    year: '2026',
    status: 'indexed',
    image: '/images/greenops/showcase-trustdrivers.webp',
    services: ['Tour SEO', 'Conversion flow', 'Trust signals'],
    metrics: [
      { label: 'Search intent', value: 'Tours', detail: 'Built for private driver and tour discovery.' },
      { label: 'Priority', value: 'Trust', detail: 'Contact, credibility, and service clarity first.' },
    ],
    caseStudy: {
      challenge: 'Help travelers quickly understand routes, trust, and inquiry options.',
      response: 'Use service panels, local landing content, and clear WhatsApp conversion paths.',
      outcome: ['Tour-service hierarchy', 'Local SEO signals', 'Fast contact path'],
    },
  },
  {
    id: 'yoo-marrakech',
    title: 'Yoo Marrakech',
    domain: 'www.yoomarrakech.com',
    externalUrl: 'https://www.yoomarrakech.com/',
    category: 'Marrakech Local Brand',
    summary: 'A local Marrakech brand presence designed for city visibility, service discovery, and polished mobile browsing.',
    year: '2026',
    status: 'indexed',
    image: '/images/greenops/showcase-yoomarrakech.webp',
    services: ['Local SEO', 'Brand website', 'Mobile UX'],
    metrics: [
      { label: 'Geo target', value: 'Marrakech', detail: 'Location-first content structure.' },
      { label: 'Experience', value: 'Mobile', detail: 'Designed for quick local discovery.' },
    ],
    caseStudy: {
      challenge: 'Create a professional local web presence that can compete in Marrakech search results.',
      response: 'Structure services, location signals, and clear brand messaging in a premium interface.',
      outcome: ['Local brand positioning', 'Search-friendly pages', 'Clear action paths'],
    },
  },
  {
    id: 'morocco-atlas-guide',
    title: 'Morocco Atlas Guide',
    domain: 'www.moroccoatlasguide.com',
    externalUrl: 'https://www.moroccoatlasguide.com/',
    category: 'Atlas Travel Guide',
    summary: 'A destination guide and travel service presence for Atlas mountain trips, tours, and Moroccan itinerary discovery.',
    year: '2026',
    status: 'indexed',
    image: '/images/greenops/showcase-atlasguide.webp',
    services: ['Destination SEO', 'Guide content', 'Travel UX'],
    metrics: [
      { label: 'Destination', value: 'Atlas', detail: 'Built around itinerary and guide intent.' },
      { label: 'Market', value: 'Travel', detail: 'Supports international trip planning.' },
    ],
    caseStudy: {
      challenge: 'Turn destination knowledge into an organized web experience for travelers.',
      response: 'Use guide-style content blocks, route cards, and local expertise signals.',
      outcome: ['Destination content model', 'Travel inquiry UX', 'Geo-rich page structure'],
    },
  },
];

export const featuredProjects = projects.filter((project) => project.status === 'featured');

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}
```

- [ ] **Step 4: Run verification and confirm the expected next failure**

Run: `npx tsx scripts/verify-greenops-content.ts`

Expected: FAIL with `At least two blog posts must target Marrakech/local search intent.` until Task 7 adds blog posts.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/data/projects.ts scripts/verify-greenops-content.ts
git commit -m "feat: add GreenOps project data"
```

---

### Task 2: Generate Project-Bound GreenOps Bitmap Assets

**Files:**
- Create: `scripts/generate-greenops-assets.mjs`
- Create: `public/images/greenops/hero-command.webp`
- Create: `public/images/greenops/system-map.webp`
- Create: `public/images/greenops/showcase-trustdrivers.webp`
- Create: `public/images/greenops/showcase-yoomarrakech.webp`
- Create: `public/images/greenops/showcase-atlasguide.webp`
- Create: `public/images/blog/marrakech-web-design.png`
- Create: `public/images/blog/morocco-tourism-seo.png`

**Interfaces:**
- Consumes: Sharp from `package.json`
- Produces: stable image paths used by project data, homepage hero, and new blog posts

- [ ] **Step 1: Write the asset generator**

Create `scripts/generate-greenops-assets.mjs`:

```js
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const outDir = path.join(process.cwd(), 'public', 'images', 'greenops');
const blogDir = path.join(process.cwd(), 'public', 'images', 'blog');

await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(blogDir, { recursive: true });

const colors = {
  primary: '#3A5A40',
  dark: '#2e4833',
  bg: '#F6F6F2',
  light: '#E3E3DC',
  sage: '#A3B18A',
  ink: '#1A1A1A',
  muted: '#5F5F5F',
  white: '#FFFFFF',
};

function panel({ title, label, domain, metricA, metricB, variant = 'grid' }) {
  const hatch = variant === 'map'
    ? `<path d="M120 420 C280 260 470 490 660 250 S970 160 1080 340" fill="none" stroke="${colors.sage}" stroke-width="18" stroke-linecap="round" opacity=".32"/>
       <path d="M170 500 C360 350 510 600 780 360 S940 300 1040 450" fill="none" stroke="${colors.primary}" stroke-width="4" stroke-dasharray="10 14" opacity=".7"/>`
    : `<g opacity=".12">${Array.from({ length: 26 }, (_, i) => `<path d="M${i * 54} 0L${i * 54 - 240} 720" stroke="${colors.primary}" stroke-width="1"/>`).join('')}</g>`;

  return `<svg width="1200" height="720" viewBox="0 0 1200 720" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="720" fill="${colors.bg}"/>
    ${hatch}
    <rect x="48" y="48" width="1104" height="624" rx="8" fill="${colors.white}" stroke="${colors.primary}" stroke-opacity=".22"/>
    <rect x="82" y="82" width="1036" height="60" rx="6" fill="${colors.primary}"/>
    <text x="112" y="121" fill="${colors.bg}" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="4">${label}</text>
    <circle cx="1050" cy="112" r="8" fill="${colors.sage}"/>
    <circle cx="1078" cy="112" r="8" fill="${colors.light}"/>
    <circle cx="1106" cy="112" r="8" fill="${colors.bg}"/>
    <text x="84" y="255" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="74" font-weight="900" letter-spacing="-3">${title}</text>
    <text x="88" y="305" fill="${colors.muted}" font-family="Arial, sans-serif" font-size="25">${domain}</text>
    <rect x="88" y="382" width="300" height="170" rx="8" fill="${colors.bg}" stroke="${colors.primary}" stroke-opacity=".18"/>
    <text x="116" y="435" fill="${colors.muted}" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="3">SIGNAL 01</text>
    <text x="116" y="498" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="56" font-weight="900">${metricA}</text>
    <rect x="422" y="382" width="300" height="170" rx="8" fill="${colors.bg}" stroke="${colors.primary}" stroke-opacity=".18"/>
    <text x="450" y="435" fill="${colors.muted}" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="3">SIGNAL 02</text>
    <text x="450" y="498" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="56" font-weight="900">${metricB}</text>
    <rect x="780" y="210" width="290" height="370" rx="8" fill="${colors.dark}"/>
    <rect x="812" y="244" width="226" height="18" rx="4" fill="${colors.light}" opacity=".9"/>
    <rect x="812" y="292" width="164" height="18" rx="4" fill="${colors.sage}" opacity=".65"/>
    <rect x="812" y="358" width="210" height="78" rx="6" fill="${colors.bg}" opacity=".92"/>
    <rect x="812" y="462" width="126" height="78" rx="6" fill="${colors.bg}" opacity=".72"/>
    <rect x="960" y="462" width="78" height="78" rx="6" fill="${colors.sage}" opacity=".85"/>
  </svg>`;
}

const assets = [
  ['hero-command.webp', panel({ title: 'WeReact Ops', label: 'GREENOPS COMMAND CENTER', domain: 'Marrakech / Morocco / Global', metricA: '15+', metricB: '24H', variant: 'map' })],
  ['system-map.webp', panel({ title: 'Launch Map', label: 'WEBSITE DELIVERY SYSTEM', domain: 'Strategy -> Design -> Build -> SEO', metricA: 'SEO', metricB: 'UX', variant: 'map' })],
  ['showcase-trustdrivers.webp', panel({ title: 'Trust Drivers', label: 'SHOWCASE NODE', domain: 'www.trustdrivers.tours', metricA: 'TOUR', metricB: 'TRUST' })],
  ['showcase-yoomarrakech.webp', panel({ title: 'Yoo Marrakech', label: 'SHOWCASE NODE', domain: 'www.yoomarrakech.com', metricA: 'LOCAL', metricB: 'CITY' })],
  ['showcase-atlasguide.webp', panel({ title: 'Atlas Guide', label: 'SHOWCASE NODE', domain: 'www.moroccoatlasguide.com', metricA: 'ATLAS', metricB: 'GEO' })],
];

for (const [name, svg] of assets) {
  await sharp(Buffer.from(svg)).webp({ quality: 92 }).toFile(path.join(outDir, name));
}

await sharp(Buffer.from(panel({
  title: 'Web Design Marrakech',
  label: 'SEO BRIEFING',
  domain: 'Business websites built for local visibility',
  metricA: 'GEO',
  metricB: 'LEADS',
  variant: 'map',
}))).png({ quality: 92 }).toFile(path.join(blogDir, 'marrakech-web-design.png'));

await sharp(Buffer.from(panel({
  title: 'Tourism SEO Morocco',
  label: 'GEO SEARCH BRIEFING',
  domain: 'Hospitality, tours, travel and local discovery',
  metricA: 'SEO',
  metricB: 'BOOK',
  variant: 'map',
}))).png({ quality: 92 }).toFile(path.join(blogDir, 'morocco-tourism-seo.png'));

console.log('Generated GreenOps assets.');
```

- [ ] **Step 2: Run the generator**

Run: `node scripts/generate-greenops-assets.mjs`

Expected: PASS with `Generated GreenOps assets.`

- [ ] **Step 3: Verify files exist**

Run: `Get-ChildItem public\\images\\greenops, public\\images\\blog | Select-Object Name,Length`

Expected: output includes all seven generated image filenames and non-zero lengths.

- [ ] **Step 4: Commit**

Run:

```bash
git add scripts/generate-greenops-assets.mjs public/images/greenops public/images/blog/marrakech-web-design.png public/images/blog/morocco-tourism-seo.png
git commit -m "feat: generate GreenOps visual assets"
```

---

### Task 3: Add GreenOps UI Primitives And Global Styling

**Files:**
- Create: `src/components/greenops/OpsBadge.tsx`
- Create: `src/components/greenops/OpsPanel.tsx`
- Create: `src/components/greenops/SectionHeader.tsx`
- Create: `src/components/greenops/ProjectVisual.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/Button.tsx`

**Interfaces:**
- Produces: `OpsBadge({ children, tone })`
- Produces: `OpsPanel({ children, className, dark })`
- Produces: `SectionHeader({ eyebrow, title, copy, align })`
- Produces: `ProjectVisual({ project, priority })`

- [ ] **Step 1: Create component files**

Implement the primitives with typed React props, Tailwind classes using existing CSS tokens, and no new runtime dependencies.

- [ ] **Step 2: Update global CSS**

Add body background texture, focus-visible outline, `::selection`, `.greenops-grid`, and `.greenops-scanline` utilities using the approved palette.

- [ ] **Step 3: Update Button**

Change `Button` to support icon-friendly layout while preserving `variant="primary" | "secondary"`, existing consumers, and accessible focus states.

- [ ] **Step 4: Run compile check**

Run: `npm run build`

Expected: PASS or fail only on files not yet migrated in later tasks. Type errors in the new primitives must be fixed in this task.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/components/greenops src/app/globals.css src/components/Button.tsx
git commit -m "feat: add GreenOps design primitives"
```

---

### Task 4: Redesign Header And Footer

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `siteConfig`, `OpsBadge`, `OpsPanel`
- Produces: site-wide GreenOps command-bar header and footer operations panel

- [ ] **Step 1: Redesign header**

Replace the split old agency nav treatment with a compact operational command bar:

- brand signal `-WeReact-`
- nav links About, Services, Work, Blog
- CTA "Start project"
- mobile menu remains available through `StaggeredMenu`
- scrolled header uses the same visual language as the default header

- [ ] **Step 2: Redesign footer**

Create a footer with:

- service/navigation columns
- WhatsApp, email, phone, location, hours
- compact newsletter/transmission panel
- large background WeReact type
- LocalBusiness-friendly contact links

- [ ] **Step 3: Run compile check**

Run: `npm run build`

Expected: PASS or fail only on later unmigrated page issues. Header/Footer TypeScript errors must be fixed now.

- [ ] **Step 4: Commit**

Run:

```bash
git add src/components/Header.tsx src/components/Footer.tsx
git commit -m "feat: redesign site chrome for GreenOps"
```

---

### Task 5: Redesign Homepage Sections

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/sections/Problem.tsx`
- Modify: `src/components/sections/Solution.tsx`
- Modify: `src/components/sections/Services.tsx`
- Modify: `src/components/sections/HowItWorks.tsx`
- Modify: `src/components/sections/Work.tsx`
- Modify: `src/components/sections/About.tsx`
- Modify: `src/components/sections/BlogLatest.tsx`
- Modify: `src/components/sections/Contact.tsx`

**Interfaces:**
- Consumes: GreenOps primitives, `projects`, `blogPosts`, generated assets, `siteConfig`
- Produces: a cohesive homepage where every section uses the same operational visual system

- [ ] **Step 1: Replace hero**

Build a first-screen command center with:

- generated `hero-command.webp`
- H1 around digital launch/performance
- metrics for projects, local coverage, availability
- CTA to WhatsApp/contact and secondary CTA to work
- compact service nodes

- [ ] **Step 2: Redesign Problem, Solution, Services, Process**

Use diagnostic alerts, response panels, bento service cards, and launch protocol steps. Keep motion restrained through Framer Motion.

- [ ] **Step 3: Redesign Work, About, BlogLatest, Contact**

Use `projects` for the showcase, include all seven showcase entries, and expose the three requested domains in visible cards. Restyle blog feed and final CTA as operational panels.

- [ ] **Step 4: Run build**

Run: `npm run build`

Expected: PASS or TypeScript errors limited to inner pages that will be migrated in Task 6.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/components/sections
git commit -m "feat: redesign homepage with GreenOps system"
```

---

### Task 6: Redesign Inner Pages And Work Case Studies

**Files:**
- Modify: `src/app/[locale]/about/page.tsx`
- Modify: `src/app/[locale]/services/page.tsx`
- Modify: `src/app/[locale]/work/page.tsx`
- Modify: `src/app/[locale]/work/[id]/page.tsx`
- Modify: `src/app/[locale]/contact/page.tsx`

**Interfaces:**
- Consumes: `projects`, `getProjectById`, GreenOps primitives, `siteConfig`
- Produces: all core inner pages visibly matching the redesign

- [ ] **Step 1: Redesign About page**

Use an operations-profile hero, proof metrics, principles, partnership model, and contact CTA.

- [ ] **Step 2: Redesign Services page**

Use an interactive service matrix and local/business website service copy for Morocco, Marrakech, tourism, hospitality, and small-business websites.

- [ ] **Step 3: Redesign Work index**

Use `projects` for all showcase items. Real projects use existing images; new domains use generated GreenOps visuals.

- [ ] **Step 4: Redesign Work detail**

Use `getProjectById(params.id)`, replace the local duplicated project map, and render a consistent case-study page for every project. For requested domains without full screenshots, render generated visual cards rather than fake full screenshots.

- [ ] **Step 5: Redesign Contact page**

Use a final deploy console with WhatsApp-first CTA, contact form, email, phone, location, hours, and map/contact links.

- [ ] **Step 6: Run build**

Run: `npm run build`

Expected: PASS or fail only on blog/SEO work reserved for Task 7.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/app/[locale]/about/page.tsx src/app/[locale]/services/page.tsx src/app/[locale]/work/page.tsx src/app/[locale]/work/[id]/page.tsx src/app/[locale]/contact/page.tsx
git commit -m "feat: redesign inner pages for GreenOps"
```

---

### Task 7: Add SEO/GEO Blog Posts And Metadata Helpers

**Files:**
- Create: `src/lib/seo.ts`
- Modify: `src/data/blog.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/blog/page.tsx`
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Produces: `createPageMetadata(options)`
- Produces: richer blog data with new Marrakech/Morocco posts
- Consumes: `siteConfig`, `blogPosts`, `projects`

- [ ] **Step 1: Add SEO helper**

Create `src/lib/seo.ts` with helpers for page title, description, Open Graph, Twitter, and alternates using `siteConfig.url`.

- [ ] **Step 2: Add two blog posts**

Append two posts to `src/data/blog.ts`:

- slug `website-design-marrakech-business-guide`
- title `Website Design in Marrakech: How Local Businesses Can Turn Search Traffic Into Clients`
- image `/images/blog/marrakech-web-design.png`
- tags `['Marrakech', 'Website Design', 'Local SEO', 'Business Websites']`

and:

- slug `tourism-hospitality-seo-morocco`
- title `SEO for Tourism and Hospitality Websites in Morocco: A Practical Growth Guide`
- image `/images/blog/morocco-tourism-seo.png`
- tags `['Morocco', 'Tourism SEO', 'Hospitality Websites', 'Marrakech']`

Each article must include practical sections on search intent, local trust, page speed, mobile UX, conversion paths, and GEO/location signals.

- [ ] **Step 3: Improve metadata**

Use `createPageMetadata` for blog listing and blog detail where practical, and improve layout metadata with local service intent for Marrakech and Morocco.

- [ ] **Step 4: Improve sitemap**

Add work detail routes from `projects` to `src/app/sitemap.ts`, keeping all static pages and all blog posts.

- [ ] **Step 5: Run content verification**

Run: `npx tsx scripts/verify-greenops-content.ts`

Expected: PASS with `GreenOps content verified`.

- [ ] **Step 6: Run build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/lib/seo.ts src/data/blog.ts src/app/[locale]/layout.tsx src/app/[locale]/blog/page.tsx src/app/[locale]/blog/[slug]/page.tsx src/app/sitemap.ts
git commit -m "feat: improve SEO GEO content and metadata"
```

---

### Task 8: Visual QA, Responsive Polish, And Final Verification

**Files:**
- Modify only files needed to fix visual bugs found during QA.

**Interfaces:**
- Consumes: finished site from Tasks 1-7
- Produces: verified build and responsive browser inspection notes

- [ ] **Step 1: Run final build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 2: Start dev server**

Run: `npm run dev`

Expected: local Next server prints a localhost URL.

- [ ] **Step 3: Inspect browser views**

Use the Browser plugin for:

- desktop homepage
- mobile homepage
- work page
- one generated-domain work detail page
- blog listing
- one new blog post
- contact page

Check no text overlaps, no blank image areas, no broken icons, no unreadable contrast, and no CTA hidden behind the header.

- [ ] **Step 4: Fix visual defects**

Patch the exact files causing defects, then rerun `npm run build`.

- [ ] **Step 5: Final content verification**

Run:

```bash
npx tsx scripts/verify-greenops-content.ts
npm run build
```

Expected: both commands PASS.

- [ ] **Step 6: Commit final polish**

Run:

```bash
git add .
git commit -m "chore: polish GreenOps redesign"
```

---

## Self-Review

- Spec coverage: full-site redesign, generated assets, requested showcase domains, homepage, inner pages, blog posts, SEO/GEO metadata, sitemap, and verification are covered by Tasks 1-8.
- Placeholder scan: no task relies on unnamed future decisions.
- Type consistency: `Project`, `projects`, `featuredProjects`, and `getProjectById` are defined in Task 1 and consumed consistently by later tasks.
- Risk: the session does not expose the built-in AI image generator. The plan uses Sharp-generated bitmap assets saved in the workspace so the implementation still produces real project-bound images.
