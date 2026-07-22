const AUTH_CODE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PUBLIC_ENTRY_PATHS = new Set(['/', '/en', '/fr']);

/** Recovers OAuth codes that Supabase sent to the configured site URL. */
export function recoverMisroutedAuthCallback(url: URL) {
  const code = url.searchParams.get('code');
  if (!PUBLIC_ENTRY_PATHS.has(url.pathname) || !code || !AUTH_CODE_PATTERN.test(code)) return null;

  const callback = new URL('/admin/auth/callback', url.origin);
  callback.searchParams.set('code', code);
  return callback;
}
