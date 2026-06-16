# GreenOps Full-Site Redesign Design

## Objective

Redesign the full WeReact agency website around the Vertex "Optimize Quantum Data" reference while preserving the existing WeReact brand colors and Nohemi font family from `design_brand.md`.

The result should feel like a premium digital operations studio: dense, confident, technical, and commercial, with compact panels, operational labels, live-status details, bento grids, measured motion, and strong project showcase moments.

## Brand Constraints

- Font: keep Nohemi as the site font for display, body, buttons, labels, and metadata.
- Colors: keep the existing WeReact palette only: primary green `#3A5A40`, dark green `#2e4833`, warm off-white `#F6F6F2`, white, near-black, muted gray, warm light accent `#E3E3DC`, and sage `#A3B18A`.
- Do not use the Vertex neon lime or black palette directly.
- Keep sharp UI geometry: cards and controls at 8px radius or less, with strong rectangular composition.

## Creative Direction

Use a "GreenOps Studio" visual language.

- The site behaves like a live command center for business websites.
- Hero and feature sections use dashboard panels, status chips, compact metrics, service nodes, delivery timers, and project telemetry.
- Large typography remains editorial and premium, but every section has an operational layer rather than decorative filler.
- Project imagery should be prominent and inspectable; showcase cards can mix real screenshots/project assets with generated abstract system panels where needed.
- Motion should preserve the Vertex tone: masked reveals, staggered entrances, hover lift, subtle pulses, and ambient status movement.

## Site-Wide Structure

### Header

Redesign the header so it matches the operational system:

- Keep the WeReact brand centered or clearly dominant.
- Use compact uppercase nav labels.
- Include a clear project CTA.
- Make the scrolled navigation feel like a compact command bar rather than a separate floating style.

### Footer

Redesign the footer as a final operations panel:

- Include contact, location, hours, social links, and navigation.
- Keep newsletter only if it can be styled as a compact transmission/sign-up panel.
- Use large WeReact typography as a background or structural anchor without overpowering useful links.

### Buttons And Cards

- Buttons use icon+text where helpful, especially for CTAs.
- Cards use thin borders, nested surfaces, metric tags, and small operational labels.
- No nested decorative card stacks.
- Focus states and hover states must be visible and polished.

## Homepage Sections

### Hero

Replace the current nature-photo hero with a first-screen operations board:

- H1: WeReact positioned as a digital launch/website performance partner.
- Include a compact dashboard composition with live metrics, project pipeline cards, service nodes, and a prominent CTA.
- Use brand colors only.
- Make the first viewport visually dense but readable on mobile and desktop.

### Problem

Turn the problem section into a diagnostic board:

- Show common website failures as operational alerts: invisible online, slow load, poor conversion, unclear offer.
- Use compact cards and severity/status styling.

### Solution

Turn the solution section into the system response:

- Present how WeReact reacts: clarify, design, build, optimize.
- Use panel sequencing and measured reveal motion.

### Services

Keep the bento idea, but make it more intentional:

- Business websites, landing pages, redesigns, mobile optimization, SEO foundations, maintenance/custom development.
- Use varied card sizes, icons, labels, and small "output" details.

### Process

Rework "How It Works" into a launch protocol:

- Discover, map, design, build, launch/optimize.
- Use a horizontal/stacked timeline with status indicators.

### Work Showcase

Make the showcase more creative and stronger than the current marquee:

- Include existing projects:
  - Flying Tandem
  - Kasbah Angour
  - Your Morocco
  - By Marrakech
- Add the new domains requested by the user:
  - `www.trustdrivers.tours`
  - `www.yoomarrakech.com`
  - `www.moroccoatlasguide.com`
- Use a mix of featured project tiles, compact domain tiles, and metric/status overlays.
- If real screenshots are not available locally, use existing assets where suitable and create branded placeholder/system-card visuals instead of pretending to show unavailable screenshots.

### About

Reframe the advantages as operational principles:

- Accessible premium pricing.
- Long-term partnership.
- Performance-driven builds.
- Add compact proof metrics and delivery values.

### Blog

Restyle latest insights into a knowledge feed:

- Compact article cards with category, read time, and dispatch-style labels.
- Keep images inspectable and avoid generic blog-card styling.

### Contact

Make contact the final deploy CTA:

- Strong launch-focused headline.
- WhatsApp CTA, email, phone, location, and hours.
- Use a command-panel layout with availability status.

## Inner Pages

The redesign should cover the whole website, not only the homepage.

- About, services, work index, work detail, blog index, blog detail, and contact pages should share the same GreenOps tokens, card language, section rhythm, and header/footer treatment.
- Update the shared components and the top-level layout of each page type so every route visibly belongs to the same redesign.

## Assets

- Prefer existing real project images in `public/images/projects`.
- Generate or create new bitmap assets only when they support the design better than existing assets.
- Use generated/abstract visuals for operational panels, system maps, or project placeholders when no real screenshot exists.
- Do not replace real project imagery with vague atmospheric stock-like imagery.
- Add appropriate generated bitmap assets that make the site feel impressive and premium, especially for the GreenOps hero, operational panels, and any showcase item that lacks a real local screenshot.
- Save all project-bound generated assets inside `public/images/` and reference them from the app; do not leave referenced images outside the workspace.

## SEO And GEO Requirements

- Make the website professionally SEO-friendly and local/GEO-friendly for WeReact agency in Marrakech, Morocco.
- Improve metadata for the home page and main inner pages: title, description, Open Graph, Twitter, canonical/alternate behavior where practical, and location/service intent.
- Keep or improve structured data for `LocalBusiness`, `ProfessionalService`, offered services, address, geo coordinates, sameAs links, and area served.
- Ensure the sitemap includes static pages and all blog posts.
- Add one or two high-quality blog posts targeting useful Google search intent and local Moroccan service intent. Topics should support searches around website design in Marrakech/Morocco, business websites, SEO foundations, tourism/hospitality websites, and local digital presence.
- Blog content should read like professional guidance, not keyword stuffing. Use natural mentions of Marrakech, Morocco, web design, business websites, SEO, local visibility, and conversion.
- New blog posts need clear slugs, excerpts, meta descriptions, categories, tags, read times, images, and full article HTML.

## Testing And Verification

- Run the project build or the strongest available compile check.
- Run lint if the script works in this Next version.
- Start the dev server and visually inspect the redesigned pages in the browser at desktop and mobile widths.
- Verify no text overlaps, no blank hero/panel areas, and the site remains usable with keyboard focus.
