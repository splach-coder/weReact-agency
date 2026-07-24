export type ChatTextPart =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; href: string };

const TOKEN_PATTERN =
  /https?:\/\/[^\s<>()]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+212(?:[\s-]?\d){9}/gi;
const TRAILING_PUNCTUATION = /[.,!?;:]+$/;

function approvedHref(token: string) {
  const email = token.toLowerCase();
  if (email === 'hello@wereact.agency') return `mailto:${email}`;

  if (token.startsWith('+212')) {
    const normalized = token.replace(/[^\d+]/g, '');
    return normalized === '+212602258009' ? `tel:${normalized}` : null;
  }

  try {
    const url = new URL(token);
    if (url.protocol !== 'https:') return null;
    if (['wereact.agency', 'www.wereact.agency', 'api.whatsapp.com', 'wa.me'].includes(url.hostname)) {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function tokenizeChatText(text: string): ChatTextPart[] {
  const parts: ChatTextPart[] = [];
  let cursor = 0;

  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) parts.push({ type: 'text', text: text.slice(cursor, index) });

    const raw = match[0];
    const trailing = raw.match(TRAILING_PUNCTUATION)?.[0] ?? '';
    const token = trailing ? raw.slice(0, -trailing.length) : raw;
    const href = approvedHref(token);

    if (href) parts.push({ type: 'link', text: token, href });
    else parts.push({ type: 'text', text: token });
    if (trailing) parts.push({ type: 'text', text: trailing });

    cursor = index + raw.length;
  }

  if (cursor < text.length) parts.push({ type: 'text', text: text.slice(cursor) });
  return parts.length ? parts : [{ type: 'text', text }];
}

export function cleanChatText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s*[*•]\s+/gm, '- ')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
}