import assert from 'node:assert/strict';
import test from 'node:test';
import { getServiceLandingPage } from '@/data/services';
import { createFaqJsonLd, createLocalizedAlternates, createServicePageJsonLd } from './seo';

test('creates a localized Service schema for a landing page', () => {
  const page = getServiceLandingPage('web-design-marrakech');
  assert.ok(page);
  const schema = createServicePageJsonLd(page, 'fr');
  assert.equal(schema['@type'], 'Service');
  assert.equal(schema.url, 'https://www.wereact.agency/fr/web-design-marrakech');
});

test('creates FAQPage schema from factual page answers', () => {
  const page = getServiceLandingPage('seo-landing-pages');
  assert.ok(page);
  const schema = createFaqJsonLd(page.copy.en.faqs);
  assert.equal(schema['@type'], 'FAQPage');
  assert.equal(schema.mainEntity.length, 3);
});

test('uses a final English URL as x-default', () => {
  const alternates = createLocalizedAlternates('/blog');
  assert.equal(alternates.en, 'https://www.wereact.agency/en/blog');
  assert.equal(alternates.fr, 'https://www.wereact.agency/fr/blog');
  assert.equal(alternates['x-default'], 'https://www.wereact.agency/en/blog');
});