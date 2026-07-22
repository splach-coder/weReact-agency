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

export function getPermanentPublicRedirect(pathname: string) {
  if (pathname === '/') return '/en';
  if (LEGACY_REDIRECTS[pathname]) return LEGACY_REDIRECTS[pathname];
  if (CURRENT_PUBLIC_PATHS.has(pathname)) return '/en' + pathname;
  return undefined;
}

export function shouldApplyLocaleMiddleware(pathname: string) {
  return siteConfig.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}
