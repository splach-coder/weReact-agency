import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
import { getEarlyRequestRedirect } from './lib/auth-callback';
import {
  getLocalizedPublicRedirect,
  getPermanentPublicRedirect,
  shouldApplyLocaleMiddleware,
} from './lib/public-redirects';
import { siteConfig } from './config/site';

const intlMiddleware = createMiddleware(routing);

const CANONICAL_HOST = new URL(siteConfig.url).host;
const APEX_HOST = CANONICAL_HOST.replace(/^www\./, '');

export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host')?.toLowerCase();

  // Plain HTTP on our own hosts → HTTPS canonical in one permanent hop. Without
  // this, http://www… served every page with a 200 and Google kept those URLs.
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const isHttp = forwardedProto ? forwardedProto === 'http' : request.nextUrl.protocol === 'http:';
  if (isHttp && (host === CANONICAL_HOST || host === APEX_HOST)) {
    const target = getPermanentPublicRedirect(pathname) ?? pathname;
    return NextResponse.redirect(new URL(target + search, siteConfig.url), 308);
  }

  const localizedRedirect = getLocalizedPublicRedirect(pathname, {
    acceptLanguage: request.headers.get('accept-language'),
    country: request.headers.get('cf-ipcountry'),
  });
  if (localizedRedirect) {
    // One hop: apex visitors go straight to the canonical host + their language.
    const base = host === APEX_HOST ? siteConfig.url : request.url;
    const response = NextResponse.redirect(new URL(localizedRedirect + search, base), 307);
    response.headers.set('Vary', 'Accept-Language');
    return response;
  }

  // wereact.agency/* → www.wereact.agency/* in a single permanent hop.
  if (host === APEX_HOST) {
    const target = getPermanentPublicRedirect(pathname) ?? pathname;
    return NextResponse.redirect(new URL(target + search, siteConfig.url), 308);
  }

  const publicRedirect = getPermanentPublicRedirect(pathname);
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
