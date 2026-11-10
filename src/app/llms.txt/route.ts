import { buildLlmsTxt } from '@/lib/llms-txt';

// Generated at build time from the site data (src/lib/llms-txt.ts) and served
// as a static asset. The middleware matcher skips paths with a dot, so it is
// never locale-redirected.
export const dynamic = 'force-static';

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
