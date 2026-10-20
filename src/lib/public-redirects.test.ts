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
