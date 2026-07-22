import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
import { getEarlyRequestRedirect } from './lib/auth-callback';
import {
  getPermanentPublicRedirect,
  shouldApplyLocaleMiddleware,
} from './lib/public-redirects';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const publicRedirect = getPermanentPublicRedirect(request.nextUrl.pathname);
  if (publicRedirect) {
    return NextResponse.redirect(new URL(publicRedirect, request.url), 308);
  }

  const recoveredAuthCallback = getEarlyRequestRedirect(request.nextUrl);
  if (recoveredAuthCallback) return Response.redirect(recoveredAuthCallback);

  // The CRM dashboard lives outside the localized site - it gets Supabase
  // session handling instead of next-intl locale routing.
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/crm')) {
    return updateSession(request);
  }

  if (!shouldApplyLocaleMiddleware(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - ... if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - ... the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
