import { createBrowserClient } from '@supabase/ssr';

/** Browser Supabase client (dashboard auth + realtime). Uses the public anon key. */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
