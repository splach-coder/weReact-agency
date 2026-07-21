import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Server Supabase client bound to the request cookies (RSC + route handlers). */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
          } catch {
            // Called from a Server Component where cookies are read-only -
            // safe to ignore; the middleware refreshes the session cookie.
          }
        },
      },
    },
  );
}
