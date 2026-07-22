import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/** Exchanges the magic-link code for a session, then lands on the dashboard. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: isTeamMember, error: membershipError } = await supabase.rpc('is_team_member');
      if (!membershipError && isTeamMember === true) {
        return NextResponse.redirect(new URL('/admin', url.origin));
      }

      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/admin/login?error=access', url.origin));
    }
  }

  return NextResponse.redirect(new URL('/admin/login?error=auth', url.origin));
}
