import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Landing-page copy is stored as plain strings. To weave contextual internal
 * links into it, write `[anchor text](/fr/some-page)`. Only site-relative
 * paths are turned into links; anything else is left as plain text.
 *
 * - `renderInlineLinks` turns the markup into <Link> elements for the page.
 * - `stripInlineLinks` returns the plain text, for metadata, JSON-LD, the AI
 *   info page, llms.txt and the sales assistant.
 */
const INLINE_LINK = /\[([^\]\n]+)\]\((\/[^)\s]*)\)/g;

export function stripInlineLinks(text: string): string {
  return text.replace(INLINE_LINK, '$1');
}

export function hasInlineLinks(text: string): boolean {
  INLINE_LINK.lastIndex = 0;
  return INLINE_LINK.test(text);
}

/** Every link target used in a string, for tests and the link audit. */
export function inlineLinkTargets(text: string): string[] {
  return [...text.matchAll(INLINE_LINK)].map((m) => m[2]);
}

export function renderInlineLinks(text: string, linkClassName = INLINE_LINK_CLASS): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_LINK)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    parts.push(
      <Link key={`${index}-${match[2]}`} href={match[2]} className={linkClassName}>
        {match[1]}
      </Link>,
    );
    last = index + match[0].length;
  }
  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export const INLINE_LINK_CLASS =
  'underline decoration-[rgba(58,90,64,0.35)] underline-offset-4 transition-colors hover:text-[var(--color-primary)] hover:decoration-[var(--color-primary)]';
