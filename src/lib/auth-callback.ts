const AUTH_CODE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PUBLIC_ENTRY_PATHS = new Set(['/', '/en', '/fr']);

/** Canonicalizes production traffic and recovers OAuth codes sent to the public site. */
export function getEarlyRequestRedirect(url: URL) {
  if (url.hostname === 'wereact.agency') {
    const canonicalUrl = new URL(url);
    canonicalUrl.protocol = 'https:';
    canonicalUrl.hostname = 'www.wereact.agency';
    canonicalUrl.port = '';
    return canonicalUrl;
  }

  const code = url.searchParams.get('code');
  if (!PUBLIC_ENTRY_PATHS.has(url.pathname) || !code || !AUTH_CODE_PATTERN.test(code)) return null;

  const callback = new URL('/admin/auth/callback', url.origin);
  callback.searchParams.set('code', code);
  return callback;
}
