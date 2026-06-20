# WeReact — Brand Identity

> **Morocco's modern web agency.**
> We build fast, beautiful websites that bridge Moroccan businesses to the world.

This is the source of truth for the WeReact identity. The website design follows from this
document — not the other way around. It evolves the existing system (Nohemi + Atlas Green)
rather than replacing it.

---

## 1. Positioning

**Who we are:** A Marrakech-based web agency that makes Moroccan businesses — hospitality,
tourism, local brands — look world-class online, in English and French.

**What we stand for:** Local craft, modern execution. We're proud to be from Marrakech and
fluent in the international web. We bridge the two.

**Who we're for:** Riads, kasbahs, tour operators, local brands, and ambitious Moroccan
businesses that need to compete for international attention.

**Proof:** 7+ live projects across travel, hospitality, and local brands (Flying Tandem,
Kasbah Angour, Your Morocco, By Marrakech, Trust Drivers, Yoo Marrakech, Atlas Guide).

**One-liner:** *Moroccan craft, modern web.*

---

## 2. Personality

| Trait | Means | Not |
| --- | --- | --- |
| **Calm** | Confident, unhurried, lots of space | Loud, busy, gimmicky |
| **Crafted** | Considered detail, premium finish | Templated, cheap |
| **Rooted** | Proud of Marrakech, warm | Generic, placeless |
| **Modern** | Fast, sharp, current | Trendy-for-trend's-sake |
| **Clear** | Plain language, honest results | Jargon, overpromising |

If the brand were a place: a sunlit modern riad — clean lines, warm materials, calm light.

---

## 3. Voice & Tone

- **Plain and confident.** Short sentences. Say what we do and the result it gets.
- **Bilingual by default.** Every customer-facing string lives in EN and FR. French is a
  first-class citizen, not an afterthought.
- **Results-aware.** Talk in outcomes: bookings, visibility, trust, speed.
- **Warm, not corporate.** "We build" not "We leverage." Human, never stiff.

**Examples**
- Hero: *We build digital experiences that convert.* / *Des sites qui convertissent.*
- CTA: *Start a project →* / *Démarrer un projet →*
- Section label (mono, uppercase): `MARRAKECH · EST. 2025`

---

## 4. Logo & Wordmark

- **Icon:** `public/logo_icon.ico` — the mark. Used as favicon, header glyph, hero corner.
- **Wordmark:** `wereact` set in Nohemi. Lowercase for the calm/modern feel.
  - Editorial framing `·wereact·` or `-wereact-` is permitted in nav/footer as a signature.
- **Clear space:** keep at least the height of the "w" clear on all sides.
- **Don't:** stretch, recolor outside the palette, add shadows/gradients to the mark, or
  rotate it as a permanent state (subtle motion is fine, spinning is not).

---

## 5. Color System

The palette is **green-dominant, sand-grounded, clay-accented.** Green and sand do ~95% of
the work; clay is the single warm accent that signals Marrakech. Use clay sparingly — a CTA,
an underline, a highlight — never as a background field.

### Core

| Token | Hex | Name | Use |
| --- | --- | --- | --- |
| `--color-primary` | `#3A5A40` | **Atlas Green** | Brand green: headings, buttons, dark sections |
| `--color-primary-dark` | `#2E4833` | Atlas Green Dark | Hover, deep accents |
| `--color-primary-light` | `#5A7A60` | Atlas Green Light | Gradients, subtle fills |
| `--color-background-main` | `#F6F6F2` | **Medina Sand** | Main page background |
| `--color-background-contrast` | `#FFFFFF` | Bright | Cards, contrast panels |
| `--color-text-main` | `#1A1A1A` | Ink | Primary text |
| `--color-text-secondary` | `#5F5F5F` | Ink 70 | Body / supporting copy |
| `--color-text-muted` | `#737373` | Ink 50 | Labels, helper text |

### Accent (NEW — the evolution)

| Token | Hex | Name | Use |
| --- | --- | --- | --- |
| `--color-accent-clay` | `#C26B43` | **Marrakech Clay** | Primary accent: key CTAs, underlines, highlights |
| `--color-accent-clay-dark` | `#A6562F` | Clay Dark | Clay hover states |
| `--color-accent-sage` | `#A3B18A` | Sage | Soft secondary accent, tags |
| `--color-accent-warm` | `#E3E3DC` | Warm Stone | Hairlines, footer text on green, soft fills |

**Ratio guideline:** ~60% sand/white · ~30% green · ~5% ink · ~5% clay.

**Contrast:** Atlas Green on Medina Sand and Ink on Sand both pass WCAG AA for body text.
Clay (`#C26B43`) on white passes AA for large text/UI; use Clay Dark for small text on light.

---

## 6. Typography

**Primary face: Nohemi** (loaded locally, `--font-nohemi`). Geometric, modern, confident.

| Role | Weight | Treatment |
| --- | --- | --- |
| Display / hero | 800–900 (ExtraBold/Black) | Very large, tight tracking (`-0.02em`), can be uppercase |
| Headings (h2/h3) | 700 (Bold) | Tight tracking, sentence case |
| Body | 400 (Regular) | Comfortable line-height (1.6), editorial feel |
| Lead paragraph | 500 (Medium) | Slightly larger, calmer |
| Labels / eyebrows | mono, 600 | Uppercase, wide tracking (`+0.1em`), small |

**Mono accent:** `JetBrains Mono` for eyebrows, metrics, and technical labels — gives the
"modern web" signal against Nohemi's warmth.

**Type scale (suggested):** 12 · 14 · 16 · 18 · 24 · 32 · 48 · 64 · 80px (clamp for fluid).

---

## 7. UI & Layout Principles

- **Space is a feature.** Generous margins; let sections breathe. Calm = uncrowded.
- **Sharp, light UI.** Small radii (4–12px), thin green hairline borders, soft green-tinted
  shadows (already in tokens). No heavy drop shadows.
- **Grid-driven.** Strong alignment, clear columns, editorial rhythm.
- **One accent per view.** Clay appears once or twice per screen, deliberately.
- **Bilingual layouts** must survive French (~20% longer strings) without breaking.

---

## 8. Motion

- **Purposeful and quiet.** Reveal on scroll, gentle hover lifts, easing
  `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Timing:** 0.6–0.8s reveals, 0.3s hovers.
- **Always** respect `prefers-reduced-motion` (the global guard exists in `globals.css`).
- **No** infinite spinners, no aggressive parallax, no motion as decoration.

---

## 9. Imagery

- **Warm, natural light.** Real Moroccan places, architecture, texture — sunlit, not
  over-saturated.
- **Project shots** framed cleanly, on sand or white, with breathing room.
- Avoid generic stock and cold corporate photography.

---

## 10. Implementation Notes

- Tokens live in `src/app/globals.css` under `@theme`. Add the clay accent tokens there so
  Tailwind v4 exposes `bg-accent-clay`, `text-accent-clay`, etc.
- This file supersedes `design_brand.md` (which documented only the pre-evolution palette).
- Every new component pulls from these tokens — no hard-coded hex values in JSX.

---

*Last updated: 2026-06-19 · Direction: Morocco's modern web agency · Calm Premium (evolved)*
