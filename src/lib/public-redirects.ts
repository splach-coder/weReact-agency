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
  '/site-web-agence-de-voyage',
  '/creation-site-e-commerce-maroc',
  '/web-design-tanger',
  '/agence-marketing-digital-marrakech',
  '/outils/generateur-lien-whatsapp',
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
  // We stopped offering Google Ads management (Nov 2026): the Ads page and the
  // older landing-pages page it absorbed now point to the digital marketing page.
  '/agence-google-ads-maroc': '/fr/agence-marketing-digital-marrakech',
  '/fr/agence-google-ads-maroc': '/fr/agence-marketing-digital-marrakech',
  '/en/agence-google-ads-maroc': '/en/agence-marketing-digital-marrakech',
  '/seo-landing-pages': '/fr/agence-marketing-digital-marrakech',
  '/fr/seo-landing-pages': '/fr/agence-marketing-digital-marrakech',
  '/en/seo-landing-pages': '/en/agence-marketing-digital-marrakech',
  '/fr/agence-web-marrakech': '/fr/web-design-marrakech',
  '/en/agence-web-marrakech': '/en/web-design-marrakech',
  // Thin generic post Google never indexed; the SEO page answers the same question (Nov 2026).
  '/blog/seo-strategies-for-agencies': '/en/agence-seo-marrakech',
  '/fr/blog/seo-strategies-for-agencies': '/fr/agence-seo-marrakech',
  '/en/blog/seo-strategies-for-agencies': '/en/agence-seo-marrakech',
  // Old articles Google still crawls (404s in Search Console, Nov 2026).
  '/blog/minimalist-design-trends': '/en/blog/website-design-marrakech-business-guide',
  '/fr/blog/minimalist-design-trends': '/fr/blog/website-design-marrakech-business-guide',
  '/en/blog/minimalist-design-trends': '/en/blog/website-design-marrakech-business-guide',
  // "How to choose a web agency": the pricing guide has the questions to ask an agency.
  '/blog/choisir-agence-web-maroc-2024': '/fr/blog/combien-coute-site-web-maroc',
  '/fr/blog/choisir-agence-web-maroc-2024': '/fr/blog/combien-coute-site-web-maroc',
  '/en/blog/choisir-agence-web-maroc-2024': '/en/blog/combien-coute-site-web-maroc',
};

/** Unprefixed case studies, articles and tools (old links such as /work/kasbah-angour). */
const LOCALIZED_DETAIL_PATH = /^\/(work|blog|outils)\/[a-z0-9-]+$/;

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
  if (LEGACY_REDIRECTS[pathname]) return undefined;
  if (pathname !== '/' && !CURRENT_PUBLIC_PATHS.has(pathname) && !LOCALIZED_DETAIL_PATH.test(pathname)) {
    return undefined;
  }
  const locale = getPreferredLocale(signals);
  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
}

export function shouldApplyLocaleMiddleware(pathname: string) {
  return siteConfig.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}
