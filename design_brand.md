# WeReact Agency Brand Design

## Fonts

### Primary Font

**Nohemi** is the website's primary font family.

It is loaded locally from `public/fonts/` through `next/font/local` and exposed as:

```css
--font-nohemi
```

The global sans-serif stack is:

```css
var(--font-nohemi), system-ui, -apple-system, BlinkMacSystemFont, sans-serif
```

### Available Nohemi Weights

| Weight | Name | File |
| --- | --- | --- |
| 100 | Thin | `Nohemi-Thin-BF6438cc5896c67.ttf` |
| 200 | ExtraLight | `Nohemi-ExtraLight-BF6438cc58a2634.ttf` |
| 400 | Regular | `Nohemi-Regular-BF6438cc4d0e493.ttf` |
| 500 | Medium | `Nohemi-Medium-BF6438cc5883899.ttf` |
| 700 | Bold | `Nohemi-Bold-BF6438cc587b5b5.ttf` |
| 800 | ExtraBold | `Nohemi-ExtraBold-BF6438cc5881baf.ttf` |
| 900 | Black | `Nohemi-Black-BF6438cc58744d4.ttf` |

### Typography Style

- Large headings use bold or black Nohemi, often uppercase.
- Hero text uses tight tracking and very large display sizing.
- Body copy uses Nohemi with lighter weights for a clean editorial feel.
- Buttons and labels commonly use uppercase text with wide letter spacing.

## Core Colors

These are the main color tokens defined in `src/app/globals.css`.

| Token | Hex | Usage |
| --- | --- | --- |
| `--color-primary` | `#3A5A40` | Main brand green, headings, buttons, hero backgrounds |
| `--color-primary-dark` | `#2e4833` | Hover states, darker green accents |
| `--color-background-main` | `#F6F6F2` | Main page background |
| `--color-background-contrast` | `#FFFFFF` | Cards, contrast panels, light sections |
| `--color-text-main` | `#1A1A1A` | Main text color |
| `--color-text-secondary` | `#5F5F5F` | Secondary paragraphs and supporting copy |
| `--color-text-muted` | `#737373` | Muted labels and helper text |

## Supporting Colors

These colors appear in components and should be treated as secondary brand/UI colors.

| Hex | Usage |
| --- | --- |
| `#E3E3DC` | Warm light text/background accent, footer links, hero highlight |
| `#A3B18A` | Sage accent used in menu color sets |
| `#FFFFFF` | White text, cards, buttons on dark green |
| `#000000` | Utility black in navigation/menu states |
| `#111111` | Near-black social/menu text |

## Blog Category Colors

Used for blog badges and article category highlights.

| Hex | Usage |
| --- | --- |
| `#10B981` | Green category badge |
| `#EF4444` | Red category badge |
| `#3B82F6` | Blue category badge |

## CSS Token Reference

```css
:root {
  --color-primary: #3A5A40;
  --color-primary-dark: #2e4833;
  --color-background-main: #F6F6F2;
  --color-background-contrast: #FFFFFF;
  --color-text-main: #1A1A1A;
  --color-text-secondary: #5F5F5F;
  --color-text-muted: #737373;

  --font-family-sans: var(--font-nohemi), system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## Brand Feel

The visual identity is modern, calm, and premium: deep natural green, warm off-white backgrounds, large confident typography, sharp rectangular UI, and minimal decoration.
