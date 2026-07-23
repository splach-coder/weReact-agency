# Public AI Sales Agent Design

## Goal

Add a production-grade public sales assistant to every localized WeReact page. It should answer natural questions about services, starting prices, timelines, portfolio work, contact routes, and the agency, while guiding qualified visitors toward WhatsApp or the contact form.

## Experience

- The closed state is a compact `Ask WeReact` launcher that does not interrupt page storytelling.
- Desktop opens a 400px-wide fixed conversation panel.
- Mobile opens a touch-safe bottom sheet that fits the viewport without horizontal overflow.
- The interface uses WeReact green, warm white, Nohemi, thin rules, and square editorial details. Radius never exceeds 8px.
- The assistant streams replies, keeps the conversation for the current browser session, supports retry/reset, and exposes persistent WhatsApp and project-contact actions.
- Suggested first questions cover pricing, launch time, tourism websites, SEO, and e-commerce.
- The interface is keyboard accessible, announces streamed status changes, and respects reduced motion.

## Agent Behavior

- Answer in the language used by the visitor, including English, French, Arabic, and Moroccan Darija.
- Keep replies concise, commercially useful, and easy to scan.
- Ask at most one qualification question at a time.
- Recommend only services WeReact actually offers.
- State only approved starting prices:
  - Showcase websites: from 2,000 MAD.
  - E-commerce websites: from 3,500 MAD.
  - Custom, booking, and advanced multilingual builds: tailored quote.
- Describe delivery as typically 2 to 3 days for most standard builds, while explaining that complex scopes receive an agreed timeline.
- Preserve the declared relationship for each portfolio item. Studio-owned concepts must never be described as client work.
- Never invent discounts, guarantees, testimonials, availability, final quotes, or unsupported capabilities.
- For uncertain questions, say what is known and route the visitor to WhatsApp, email, phone, or the project form.

## Knowledge Source

The server builds the system instruction from versioned repository data:

- `src/config/site.ts` for agency identity and contact details.
- `src/data/services.ts` for commercial service pages and approved FAQs.
- `src/data/projects.ts` for portfolio relationships, summaries, and links.
- A small explicit pricing and operating-policy block for facts currently held in localized message files.

The model does not crawl arbitrary websites or search the web. This keeps answers aligned with approved public claims.

## Architecture

### Client

`SalesChat.tsx` owns:

- open/closed state;
- visible user and assistant messages;
- session-scoped previous interaction ID;
- streaming text assembly;
- retry, reset, and abort behavior;
- safe link rendering;
- analytics for opens, messages, failures, and contact intents.

The component is mounted once in the localized root layout.

### Server

`POST /api/chat`:

1. Parses and validates the locale, message, and optional previous interaction ID.
2. Applies best-effort per-IP rate limiting.
3. Calls the Gemini Interactions API with server-side `GEMINI_API_KEY`.
4. Sends the approved system instruction on every turn.
5. Filters Gemini SSE events into a small newline-delimited stream:
   - `{ "type": "start", "interactionId": "..." }`
   - `{ "type": "text", "text": "..." }`
   - `{ "type": "done", "interactionId": "..." }`
   - `{ "type": "error", "message": "..." }`
6. Never returns the API key, raw provider errors, model thoughts, or safety metadata.

The default model is `gemini-3.5-flash-lite`, overridable with `GEMINI_MODEL`.

## Security And Reliability

- The API key is server-only in `.env.local` and Cloudflare secrets.
- Public input is bounded and normalized.
- Conversation IDs are treated as opaque and validated.
- Requests have an upstream timeout and client abort support.
- Output is rendered as text with an allowlisted URL linkifier, never as raw HTML.
- The endpoint has a warm-instance rate limit and a finite turn/output budget.
- Provider failures return localized fallbacks with direct contact options.
- The assistant tells visitors not to share passwords, payment card data, or other sensitive information.

## Dashboard Integration

The automation provider row remains compatible with the existing database provider key, but its visible label changes from `AI copilots` under an OpenAI-specific placeholder to `Gemini AI`, with accurate configured/healthy messaging after successful chat responses.

## Testing

- Unit tests cover input validation, system-instruction facts, portfolio relationship accuracy, safe URL detection, and provider stream filtering.
- Route tests cover missing configuration, malformed input, rate limiting, upstream errors, and successful streaming.
- UI tests cover layout mounting, accessible controls, mobile sizing, persistent contact actions, and no raw HTML rendering.
- Final verification includes the full test suite, targeted lint, production build, desktop browser behavior, 390px mobile behavior, streaming response, link behavior, and console errors.

