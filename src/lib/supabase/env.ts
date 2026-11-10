/**
 * Supabase credentials for server-side clients (RSC, route handlers, middleware),
 * resolved in one place so a missing value fails with a clear message instead
 * of an opaque client error.
 */
export function getSupabaseServerCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase server credentials are missing. Provide NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY, or the worker secrets SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  return { url, key };
}
