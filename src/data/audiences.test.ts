import assert from 'node:assert/strict';
import test from 'node:test';
import { audienceLandingPages, getAudienceLandingPage } from './audiences';

test('defines only the two new non-overlapping audience pages', () => {
  assert.deepEqual(
    audienceLandingPages.map((page) => page.slug),
    ['website-design-moroccan-businesses', 'international-web-design-agency']
  );
});

test('provides complete English and French conversion copy', () => {
  for (const page of audienceLandingPages) {
    for (const locale of ['en', 'fr'] as const) {
      assert.ok(page.copy[locale].heading.length > 30);
      assert.equal(page.copy[locale].faqs.length, 3);
      assert.ok(page.relatedServiceSlugs.length >= 2);
    }
  }
  assert.equal(getAudienceLandingPage('missing'), undefined);
});
