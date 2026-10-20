import { siteConfig } from '@/config/site';

const CURRENT_PUBLIC_PATHS = new Set([
  '/contact',
  '/work',
  '/blog',
  '/web-design-marrakech',
  '/tourism-websites-morocco',
  '/seo-landing-pages',
  '/agence-web-marrakech',
  '/website-design-moroccan-businesses',
  '/international-web-design-agency',
]);

const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  '/blog/minimalist-design-trends': '/en/blog/website-design-marrakech-business-guide',
};

/** Fixed, locale-independent moves — safe to cache as permanent. */
export function getPermanentPublicRedirect(pathname: string) {
  if (LEGACY_REDIRECTS[pathname]) return LEGACY_REDIRECTS[pathname];
  return undefined;
}

type LocaleSignals = {
  acceptLanguage?: string | null;
  country?: string | null;
};

/**
 * Most of our buyers are Moroccan businesses who browse in French (or Arabic,
 * where French reads better than English), so they land on /fr. Everyone else —
 * including crawlers, which send no Accept-Language — gets /en, the x-default.
 */
export function getPreferredLocale({ acceptLanguage, country }: LocaleSignals): 'en' | 'fr' {
  const primary = acceptLanguage?.split(',')[0]?.trim().slice(0, 2).toLowerCase();
  if (primary === 'fr' || primary === 'ar') return 'fr';
  if (primary === 'en') return 'en';
  if (country?.toUpperCase() === 'MA') return 'fr';
  return 'en';
}

/**
 * Unprefixed public routes redirect to the visitor's language. Temporary (307)
 * because the target depends on the request, so browsers must not cache it.
 */
export function getLocalizedPublicRedirect(pathname: string, signals: LocaleSignals) {
  if (pathname !== '/' && !CURRENT_PUBLIC_PATHS.has(pathname)) return undefined;
  const locale = getPreferredLocale(signals);
  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
}

export function shouldApplyLocaleMiddleware(pathname: string) {
  return siteConfig.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}
