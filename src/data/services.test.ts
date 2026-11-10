import assert from 'node:assert/strict';
import test from 'node:test';
import { audienceLandingPages } from './audiences';
import { blogPosts } from './blog';
import { getServiceLandingPage, serviceLandingPages, servicePricing } from './services';

test('provides the approved commercial service pages', () => {
  assert.equal(serviceLandingPages.length, 9);
  assert.equal(getServiceLandingPage('web-design-marrakech')?.primaryKeyword, 'agence web marrakech');
  assert.equal(getServiceLandingPage('agence-web-marrakech'), undefined);
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

test('links every service page to existing related pages and guides', () => {
  const pageSlugs = new Set<string>([...serviceLandingPages.map((page) => page.slug), ...audienceLandingPages.map((page) => page.slug)]);
  const postSlugs = new Set(blogPosts.map((post) => post.slug));
  for (const page of serviceLandingPages) {
    for (const slug of page.relatedPageSlugs) assert.ok(pageSlugs.has(slug), page.slug + ' -> ' + slug);
    for (const slug of page.relatedPostSlugs) assert.ok(postSlugs.has(slug), page.slug + ' -> ' + slug);
  }
});

test('publishes the same starting prices in both languages', () => {
  assert.deepEqual(
    servicePricing.en.tiers.map((tier) => tier.fromMad),
    servicePricing.fr.tiers.map((tier) => tier.fromMad),
  );
  assert.deepEqual(servicePricing.en.tiers.map((tier) => tier.fromMad), [3500, 6000, null]);
});
