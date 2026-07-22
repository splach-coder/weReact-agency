import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function redirectWithCookies(request: NextRequest, response: NextResponse, pathname: string, search = '') {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = search;
  const redirectResponse = NextResponse.redirect(url);
  for (const cookie of response.cookies.getAll()) redirectResponse.cookies.set(cookie);
  return redirectResponse;
}

/**
 * Refreshes the Supabase auth session and rejects non-team Google accounts
 * before any protected CRM route is rendered.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === '/admin/login' || pathname === '/crm/login';
  const isCallbackRoute = pathname.startsWith('/admin/auth');
  const loginPath = pathname.startsWith('/crm') ? '/crm/login' : '/admin/login';

  // The callback performs its own membership check after exchanging the code.
  if (isCallbackRoute) return response;

  if (!user) {
    if (isLoginRoute) return response;
    return redirectWithCookies(request, response, loginPath);
  }

  const { data: isTeamMember, error: membershipError } = await supabase.rpc('is_team_member');
  if (membershipError || isTeamMember !== true) {
    await supabase.auth.signOut();
    if (isLoginRoute) return response;
    return redirectWithCookies(request, response, loginPath, '?error=access');
  }

  if (isLoginRoute) return redirectWithCookies(request, response, '/admin');
  return response;
}
