import { createBrowserClient } from '@supabase/ssr';

/** Browser Supabase client (dashboard auth + realtime). Uses the public anon key. */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase browser credentials are missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env when the site is built.',
    );
  }

  return createBrowserClient(url, key);
}
