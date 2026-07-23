# Public AI Sales Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a secure, streaming Gemini sales assistant that answers factual WeReact questions and guides visitors toward qualified contact.

**Architecture:** A focused server-side domain module owns validation, approved knowledge, Gemini request construction, and SSE filtering. A Next.js route proxies only safe text and interaction identifiers to a single client component mounted in the localized layout. The client presents an editorial desktop panel and touch-first mobile sheet while retaining the current session conversation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Gemini Interactions REST API, ReadableStream/SSE, Framer Motion, Lucide React, next-intl, Tailwind CSS, Node test runner.

## Global Constraints

- Keep `GEMINI_API_KEY` server-only.
- Default to `gemini-3.5-flash-lite`; allow `GEMINI_MODEL` override.
- Use approved prices only: showcase from 2,000 MAD, e-commerce from 3,500 MAD, custom work by quote.
- Preserve every project relationship from `src/data/projects.ts`.
- Never render model output as raw HTML.
- Support English, French, Arabic, and Moroccan Darija responses.
- Keep all touch targets at least 44px.
- Use WeReact colors, Nohemi, thin rules, and at most 8px radius.
- Respect `prefers-reduced-motion`.
- Do not persist public chat content in Supabase.

---

### Task 1: Sales-agent domain and provider stream

**Files:**
- Create: `src/lib/sales-agent.ts`
- Create: `src/lib/sales-agent.test.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: `parseSalesChatRequest(input)`, `buildSalesAgentInstruction(locale)`, `createGeminiInteractionPayload(input)`, `transformGeminiSse(upstream)`, `safeChatLinks(text)`.
- Consumes: `siteConfig`, `projects`, and `serviceLandingPages`.

- [ ] **Step 1: Write failing domain tests**

Cover:

```ts
assert.deepEqual(parseSalesChatRequest({
  message: 'How much is a website?',
  locale: 'en',
}), {
  valid: true,
  value: { message: 'How much is a website?', locale: 'en', previousInteractionId: null },
});
```

Also assert rejection of empty/oversized messages and malformed interaction IDs; approved pricing/contact facts in the instruction; accurate `relationship` labels; no API key in payload; and extraction of only allowlisted WeReact, WhatsApp, email, and phone links.

- [ ] **Step 2: Run the test and verify RED**

Run: `npx tsx --test src/lib/sales-agent.test.ts`

Expected: FAIL because `src/lib/sales-agent.ts` does not exist.

- [ ] **Step 3: Implement the domain module**

Use these public shapes:

```ts
type SalesChatRequest = {
  message: string;
  locale: 'en' | 'fr';
  previousInteractionId: string | null;
};

type ChatStreamEvent =
  | { type: 'start'; interactionId: string }
  | { type: 'text'; text: string }
  | { type: 'done'; interactionId: string }
  | { type: 'error'; message: string };
```

Build the instruction from repository data, create an Interactions payload with `stream: true`, `store: true`, `thinking_level: 'minimal'`, and filter provider events so only the four local event shapes leave the server.

- [ ] **Step 4: Add server-only environment documentation**

Append:

```dotenv
# Server-only Gemini sales assistant
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.5-flash-lite
```

- [ ] **Step 5: Run the domain tests and verify GREEN**

Run: `npx tsx --test src/lib/sales-agent.test.ts`

Expected: all sales-agent domain tests pass.

### Task 2: Secure streaming API route

**Files:**
- Create: `src/app/api/chat/route.ts`
- Create: `src/app/api/chat/route.test.ts`
- Modify: `src/lib/automation.ts`
- Modify: `src/app/admin/automation/AutomationWorkspace.tsx`

**Interfaces:**
- Consumes: Task 1 parsing, payload, and stream transform functions.
- Produces: `POST /api/chat` with NDJSON streaming and localized errors.

- [ ] **Step 1: Write failing route and provider-label tests**

Assert the route source:

```ts
assert.match(route, /process\.env\.GEMINI_API_KEY/);
assert.match(route, /x-goog-api-key/);
assert.match(route, /application\/x-ndjson/);
assert.doesNotMatch(route, /NEXT_PUBLIC_GEMINI/);
```

Assert the visible automation label is `Gemini AI`, not `OpenAI`.

- [ ] **Step 2: Run tests and verify RED**

Run: `npx tsx --test src/app/api/chat/route.test.ts src/lib/automation-workspace.test.ts`

Expected: FAIL because the route is missing and the provider label is stale.

- [ ] **Step 3: Implement the route**

The handler:

```ts
export async function POST(request: Request) {
  // parse JSON, validate, rate-limit, require GEMINI_API_KEY,
  // call /v1beta/interactions with AbortSignal.timeout(25_000),
  // return transformed NDJSON stream with no-store headers.
}
```

Use a best-effort warm-instance rate limit of 20 turns per 10 minutes per IP, cap maps at 5,000 keys, localize public errors, and never return raw Gemini error bodies.

- [ ] **Step 4: Update provider naming**

Keep the existing database key for migration compatibility while changing the visible provider copy to:

```ts
openai: { label: 'Gemini AI', detail: 'Public sales agent and structured copilots' }
```

- [ ] **Step 5: Run route tests and verify GREEN**

Run: `npx tsx --test src/app/api/chat/route.test.ts src/lib/automation-workspace.test.ts`

Expected: all focused tests pass.

### Task 3: Streaming chat interface

**Files:**
- Create: `src/components/chat/SalesChat.tsx`
- Create: `src/components/chat/SalesChatMessage.tsx`
- Create: `src/components/chat/sales-chat.css`
- Create: `src/components/chat/SalesChat.test.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/lib/analytics.ts`

**Interfaces:**
- Consumes: `POST /api/chat` NDJSON events and safe links.
- Produces: one localized, session-scoped public chat experience.

- [ ] **Step 1: Write failing UI source tests**

Assert the component has:

```ts
assert.match(component, /aria-label=.*Ask WeReact/);
assert.match(component, /aria-live="polite"/);
assert.match(component, /AbortController/);
assert.match(component, /sessionStorage/);
assert.match(component, /Reopen|Reset conversation/);
```

Assert the layout mounts `<SalesChat locale={locale} />`, persistent WhatsApp/contact actions exist, mobile uses `100dvh`/safe-area sizing, and no `dangerouslySetInnerHTML` is present in chat files.

- [ ] **Step 2: Run UI tests and verify RED**

Run: `npx tsx --test src/components/chat/SalesChat.test.ts`

Expected: FAIL because the chat UI files do not exist.

- [ ] **Step 3: Implement message rendering**

Render plain text blocks and allowlisted links only. Assistant messages are unframed with a green rule; user messages are compact right-aligned blocks. Preserve line breaks without accepting model HTML.

- [ ] **Step 4: Implement conversation behavior**

Include:

- welcome message and localized suggested prompts;
- streaming NDJSON parser;
- one in-flight request at a time;
- abort and retry controls;
- session interaction ID;
- reset conversation;
- focus return to the launcher;
- automatic scroll within the message region only;
- direct Contact and WhatsApp actions;
- localized provider fallback.

- [ ] **Step 5: Implement responsive styling**

Desktop: 400px panel, maximum 640px height, bottom-right placement.

Mobile: full-width bottom sheet, `max-height: min(82dvh, 760px)`, safe-area composer padding, no page x-overflow, and 44px controls.

- [ ] **Step 6: Add analytics**

Add:

```ts
export function trackSalesChat(event: 'open' | 'message' | 'error' | 'contact', params = {}) {
  trackEvent(`sales_chat_${event}`, params);
}
```

Do not send message text or personal data to analytics.

- [ ] **Step 7: Run UI tests and verify GREEN**

Run: `npx tsx --test src/components/chat/SalesChat.test.ts src/lib/analytics.test.ts`

Expected: all focused tests pass.

### Task 4: Secure configuration and provider verification

**Files:**
- Modify locally only: `.env.local`
- Modify Cloudflare secret: `GEMINI_API_KEY`
- Optionally set Cloudflare variable: `GEMINI_MODEL`

**Interfaces:**
- Consumes: the user-provided Gemini API key.
- Produces: working local and Cloudflare server-side Gemini access.

- [ ] **Step 1: Add local secrets without echoing them**

Set `GEMINI_API_KEY` and `GEMINI_MODEL` in `.env.local`. Confirm `.env.local` remains ignored.

- [ ] **Step 2: Verify the model endpoint**

Call the production model through the local `/api/chat` route, not from browser code.

Expected: HTTP 200 with `start`, `text`, and `done` NDJSON events.

- [ ] **Step 3: Add Cloudflare secrets**

Use Wrangler secret storage so the key is encrypted and absent from `wrangler.jsonc` and the repository.

- [ ] **Step 4: Verify source secrecy**

Run:

```powershell
git grep -n "AQ\\."
```

Expected: no output.

### Task 5: Final verification and production deployment

**Files:**
- Modify only if verification finds a defect.

**Interfaces:**
- Produces: deployed public sales chat on `https://www.wereact.agency`.

- [ ] **Step 1: Run focused tests**

Run:

```powershell
npx tsx --test src/lib/sales-agent.test.ts src/app/api/chat/route.test.ts src/components/chat/SalesChat.test.ts
```

Expected: all focused tests pass.

- [ ] **Step 2: Run repository verification**

Run:

```powershell
npm test
npx eslint src/lib/sales-agent.ts src/lib/sales-agent.test.ts src/app/api/chat/route.ts src/app/api/chat/route.test.ts src/components/chat/SalesChat.tsx src/components/chat/SalesChatMessage.tsx src/components/chat/SalesChat.test.ts src/lib/analytics.ts src/app/admin/automation/AutomationWorkspace.tsx
npm run build
```

Expected: zero failures and a successful production build.

- [ ] **Step 3: Commit and push**

```powershell
git add -- <exact implementation files>
git commit -m "feat: add Gemini sales assistant"
git push origin master
```

- [ ] **Step 4: Deploy Cloudflare**

Run: `npm run cf:deploy`

Expected: a new successful `wereact-agency` Worker version.

- [ ] **Step 5: Test production desktop and mobile**

Verify:

- launcher opens and closes;
- suggested prompt streams an accurate answer;
- second question retains context;
- pricing stays factual;
- links open the correct localized/contact destinations;
- WhatsApp CTA uses the approved number;
- reset clears the visible conversation;
- 390x844 layout has no x-overflow;
- keyboard focus and escape behavior work;
- no console errors occur.

