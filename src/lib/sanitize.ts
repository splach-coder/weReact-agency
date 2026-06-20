/**
 * Lightweight, dependency-free HTML sanitizer for trusted-but-rendered content
 * (e.g. blog post bodies authored in the repo). It is defense-in-depth, not a
 * substitute for a full sanitizer on untrusted user input — if blog content ever
 * becomes CMS/user-sourced, swap this for `isomorphic-dompurify`.
 *
 * Runs identically on server and client (pure string transforms).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return (
    html
      // Drop entire dangerous elements (with their content)
      .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
      // Drop self-closing / unclosed dangerous tags
      .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)[^>]*\/?>/gi, '')
      // Strip inline event handlers: onclick=, onload=, etc.
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      // Neutralize javascript:/data: URIs in href/src
      .replace(/\s(href|src)\s*=\s*("|')\s*(javascript|data):[^"']*\2/gi, ' $1="#"')
  );
}
