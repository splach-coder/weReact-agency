import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getPermanentPublicRedirect,
  shouldApplyLocaleMiddleware,
} from './public-redirects';

test('permanently canonicalizes known unprefixed public routes', () => {
  assert.equal(getPermanentPublicRedirect('/'), '/en');
  assert.equal(getPermanentPublicRedirect('/contact'), '/en/contact');
  assert.equal(getPermanentPublicRedirect('/web-design-marrakech'), '/en/web-design-marrakech');
});

test('recovers the confirmed indexed legacy article', () => {
  assert.equal(
    getPermanentPublicRedirect('/blog/minimalist-design-trends'),
    '/en/blog/website-design-marrakech-business-guide'
  );
});

test('does not turn unknown paths into soft 404s', () => {
  assert.equal(getPermanentPublicRedirect('/not-a-real-page'), undefined);
});

test('applies locale middleware only to paths with a supported locale segment', () => {
  assert.equal(shouldApplyLocaleMiddleware('/en'), true);
  assert.equal(shouldApplyLocaleMiddleware('/fr/blog'), true);
  assert.equal(shouldApplyLocaleMiddleware('/not-a-real-page'), false);
  assert.equal(shouldApplyLocaleMiddleware('/enough'), false);
});
