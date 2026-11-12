import { siteConfig } from '@/config/site';

const CURRENT_PUBLIC_PATHS = new Set([
  '/contact',
  '/work',
  '/blog',
  '/web-design-marrakech',
  '/tourism-websites-morocco',
  '/web-design-casablanca',
  '/web-design-rabat',
  '/web-design-agadir',
  '/hotel-website-design',
  '/agence-seo-marrakech',
  '/agence-google-ads-maroc',
  '/site-web-agence-de-voyage',
  '/creation-site-e-commerce-maroc',
  '/web-design-tanger',
  '/about',
  '/book',
  '/website-design-moroccan-businesses',
  '/international-web-design-agency',
  '/sitemap',
  '/ai-info',
]);

/** Google review form for the WeReact agency Business Profile (place ID ChIJUysQnRbvrw0RJFlwR-sflgw). */
export const GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJUysQnRbvrw0RJFlwR-sflgw';

const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  // Short links to hand to clients (WhatsApp, cards, invoices): straight to the Google review form.
  '/avis': GOOGLE_REVIEW_URL,
  '/review': GOOGLE_REVIEW_URL,
  // Merged into the Marrakech web design page (same search intent, Nov 2026).
  '/agence-web-marrakech': '/fr/web-design-marrakech',
  // Never indexed by Google; merged into the Google Ads page (Nov 2026).
  '/seo-landing-pages': '/fr/agence-google-ads-maroc',
  '/fr/seo-landing-pages': '/fr/agence-google-ads-maroc',
  '/en/seo-landing-pages': '/en/agence-google-ads-maroc',
  '/fr/agence-web-marrakech': '/fr/web-design-marrakech',
  '/en/agence-web-marrakech': '/en/web-design-marrakech',
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
