# Frontend Audit & Fix List — WeReact Agency

**Date:** 2026-06-19 · **Completed:** 2026-06-20
**Stack:** Next.js 16.0.7 (App Router, Turbopack) · React 19 · Tailwind v4 · next-intl · framer-motion + gsap

Status: **all items resolved.** Build, type-check, and lint are green.

---

## 🔴 Build Blockers — DONE

- [x] **1. Deleted dead `WebGLHero.tsx`** that broke `next build`.
- [x] **2. Fixed lint** — `package.json` now runs `eslint .`; `eslint.config.mjs` uses Next 16's native flat config (removed the `FlatCompat` circular-structure crash).
- [x] **3. Re-enabled meaningful ESLint rules** — removed the all-off override; Next's defaults (no-explicit-any, no-unused-vars, exhaustive-deps, jsx-a11y) now apply. 0 errors; 3 non-blocking warnings remain in the gsap nav components (intentional timeline-ref deps).
- [x] **4. Build + type-check pass** — `next build` ✓, `tsc --noEmit` ✓.

---

## 🟠 Functional / Structural — DONE

- [x] **5. Contact form works** — replaced the `console.log` no-op with a real `mailto:` submission + success state. (Cal.com booking is the primary path on the homepage.)
- [x] **6. Cal.com booking** — new `BookCall` section. Set `NEXT_PUBLIC_CALCOM_LINK` (e.g. `wereact/30min`) to embed the calendar; until then it shows a WhatsApp/email fallback.
- [x] **7. Per-page metadata** — added `generateMetadata` via route-level `layout.tsx` for about, services, contact, work, and work/[id] (bilingual EN/FR titles + descriptions).
- [x] **8. hreflang + OG** — `alternates.languages` (en/fr/x-default) on every route; OpenGraph `locale` is now locale-aware (`en_US` / `fr_FR`).

---

## 🟡 Quality / Security / Accessibility — DONE

- [x] **9. Blog HTML sanitized** — `sanitizeHtml()` util applied to `dangerouslySetInnerHTML` (strips script/iframe/event-handlers/js: URIs).
- [x] **10. Removed `any` types** — `work/[id]` now uses `CaseStudy` / `CaseStudyMetric` / `CaseStudyFeature` interfaces.
- [x] **11. aria-labels** — added to BlogShare icon buttons; Footer social links already had them.
- [x] **12. Reduced-motion + focus** — global `prefers-reduced-motion` guard in place; all new sections respect it; global `:focus-visible` (clay outline) styles added.
- [x] **13. Decorative + headings** — decorative images/SVGs `aria-hidden`; homepage has a single `<h1>`.
- [x] **14. Bundle cleanup** — deleted 13 dead files (old homepage sections, WebGLHero, VariableProximity, SplashScreen, LoadingWrapper). gsap retained for the nav menu (legit, isolated use).
- [x] **15. Work carousel** — old `sections/Work.tsx` (hardcoded -2000px drag) was dead and removed. Error boundaries (`SectionErrorBoundary`) now wrap every homepage section.

---

## 🎨 Homepage Redesign (new) — DONE

Brand-driven rebuild following **BRAND.md** (Atlas Green + Medina Sand + Marrakech Clay, Nohemi):
Hero → Trust band + stats → Manifesto (parallax collage) → Selected Projects → What We Do →
How We Work → Testimonials → FAQ → Cal.com booking → Final CTA. All new sections are bilingual via next-intl.

---

## ⚠️ Remaining (flagged, not blocking)

- **Legacy inner-page bodies** (about / services / contact / work-detail) still contain hardcoded
  **English** marketing copy. The homepage, header, footer, and all metadata are fully bilingual;
  these large legacy page bodies are the remaining i18n translation work.
- **Assets to supply:** real client logos (trust band), real testimonial names/quotes
  (placeholders in `messages/*.json`), and the Cal.com link.
- 3 ESLint `exhaustive-deps` warnings in `CardNav`/`StaggeredMenu` (gsap timelines) — safe to leave.
