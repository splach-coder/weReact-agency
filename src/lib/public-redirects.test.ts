import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getLocalizedPublicRedirect,
  getPermanentPublicRedirect,
  getPreferredLocale,
  shouldApplyLocaleMiddleware,
} from './public-redirects';

test('sends unprefixed public routes to the visitor language', () => {
  assert.equal(getLocalizedPublicRedirect('/', { acceptLanguage: 'fr-FR,fr;q=0.9' }), '/fr');
  assert.equal(getLocalizedPublicRedirect('/contact', { acceptLanguage: 'en-US,en;q=0.9' }), '/en/contact');
  assert.equal(getLocalizedPublicRedirect('/web-design-marrakech', {}), '/en/web-design-marrakech');
  assert.equal(getLocalizedPublicRedirect('/ai-info', { acceptLanguage: 'fr' }), '/fr/ai-info');
  assert.equal(getLocalizedPublicRedirect('/sitemap', {}), '/en/sitemap');
});

test('crawlers without Accept-Language get the English x-default', () => {
  assert.equal(getPreferredLocale({}), 'en');
});

test('French and Arabic browsers, or visitors in Morocco, get French', () => {
  assert.equal(getPreferredLocale({ acceptLanguage: 'ar-MA,ar;q=0.9,fr;q=0.8' }), 'fr');
  assert.equal(getPreferredLocale({ acceptLanguage: 'de-DE', country: 'MA' }), 'fr');
  assert.equal(getPreferredLocale({ acceptLanguage: 'en-GB', country: 'MA' }), 'en');
});

test('recovers the confirmed indexed legacy article', () => {
  assert.equal(
    getPermanentPublicRedirect('/blog/minimalist-design-trends'),
    '/en/blog/website-design-marrakech-business-guide'
  );
});

test('sends unprefixed case studies, articles and tools to the visitor language', () => {
  assert.equal(getLocalizedPublicRedirect('/work/kasbah-angour', { acceptLanguage: 'fr' }), '/fr/work/kasbah-angour');
  assert.equal(getLocalizedPublicRedirect('/blog/combien-coute-site-web-maroc', {}), '/en/blog/combien-coute-site-web-maroc');
  assert.equal(getLocalizedPublicRedirect('/outils/generateur-lien-whatsapp', { country: 'MA' }), '/fr/outils/generateur-lien-whatsapp');
  assert.equal(getLocalizedPublicRedirect('/work/kasbah-angour/extra', {}), undefined);
});

test('moves the retired Google Ads page to the digital marketing page in one hop', () => {
  for (const locale of ['fr', 'en']) {
    assert.equal(getPermanentPublicRedirect(`/${locale}/agence-google-ads-maroc`), `/${locale}/agence-marketing-digital-marrakech`);
    assert.equal(getPermanentPublicRedirect(`/${locale}/seo-landing-pages`), `/${locale}/agence-marketing-digital-marrakech`);
  }
  assert.equal(getLocalizedPublicRedirect('/agence-google-ads-maroc', { acceptLanguage: 'en' }), undefined);
});

test('legacy articles skip the language hop and go straight to their replacement', () => {
  assert.equal(getLocalizedPublicRedirect('/blog/minimalist-design-trends', { acceptLanguage: 'fr' }), undefined);
  assert.equal(getPermanentPublicRedirect('/fr/blog/choisir-agence-web-maroc-2024'), '/fr/blog/combien-coute-site-web-maroc');
  assert.equal(getPermanentPublicRedirect('/en/blog/seo-strategies-for-agencies'), '/en/agence-seo-marrakech');
});

test('does not turn unknown paths into soft 404s', () => {
  assert.equal(getPermanentPublicRedirect('/not-a-real-page'), undefined);
  assert.equal(getLocalizedPublicRedirect('/not-a-real-page', { acceptLanguage: 'fr' }), undefined);
});

test('applies locale middleware only to paths with a supported locale segment', () => {
  assert.equal(shouldApplyLocaleMiddleware('/en'), true);
  assert.equal(shouldApplyLocaleMiddleware('/fr/blog'), true);
  assert.equal(shouldApplyLocaleMiddleware('/not-a-real-page'), false);
  assert.equal(shouldApplyLocaleMiddleware('/enough'), false);
});
