import assert from 'node:assert/strict';
import test from 'node:test';
import { getServiceLandingPage, serviceLandingPages } from './services';

test('provides three approved commercial service pages', () => {
  assert.equal(serviceLandingPages.length, 3);
  assert.equal(getServiceLandingPage('web-design-marrakech')?.primaryKeyword, 'website design Marrakech');
  assert.equal(getServiceLandingPage('missing'), undefined);
});

test('keeps each service page available in English and French with answers for buyers', () => {
  for (const page of serviceLandingPages) {
    assert.ok(page.copy.en.heading);
    assert.ok(page.copy.fr.heading);
    assert.ok(page.copy.en.faqs.length >= 3);
    assert.ok(page.copy.fr.faqs.length >= 3);
  }
});
