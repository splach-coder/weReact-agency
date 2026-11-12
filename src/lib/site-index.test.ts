import assert from 'node:assert/strict';
import test from 'node:test';
import { serviceLandingPages } from '@/data/services';
import { audienceLandingPages } from '@/data/audiences';
import { projects } from '@/data/projects';
import { blogPosts } from '@/data/blog';
import { areaEntities } from '@/lib/entities';
import { siteConfig } from '@/config/site';
import { formatTierPrice, getContentLastModified, getPricing, getSitemapSections } from './site-index';

test('the HTML sitemap lists every page from the data, in both languages', () => {
  for (const locale of ['en', 'fr']) {
    const hrefs = getSitemapSections(locale).flatMap((section) => section.links.map((link) => link.href));
    for (const page of [...serviceLandingPages, ...audienceLandingPages]) assert.ok(hrefs.includes(`/${locale}/${page.slug}`), page.slug);
    for (const project of projects) assert.ok(hrefs.includes(`/${locale}/work/${project.id}`), project.id);
    for (const post of blogPosts) assert.ok(hrefs.includes(`/${locale}/blog/${post.slug}`), post.slug);
    for (const path of ['', '/about', '/work', '/blog', '/contact', '/book', '/ai-info']) assert.ok(hrefs.includes(`/${locale}${path}`), path);
    assert.equal(new Set(hrefs).size, hrefs.length, 'no page is listed twice');
  }
});

test('groups the sitemap under services, audiences, case studies, guides and company', () => {
  assert.deepEqual(getSitemapSections('en').map((section) => section.id), ['services', 'audiences', 'work', 'guides', 'tools', 'company']);
});

test('uses localized titles on the French sitemap', () => {
  const fr = getSitemapSections('fr');
  const services = fr.find((section) => section.id === 'services');
  const guides = fr.find((section) => section.id === 'guides');
  assert.ok(services && guides);
  assert.ok(services.links.some((link) => link.title === serviceLandingPages[0].copy.fr.title));
  const frenchPost = blogPosts.find((post) => post.fr);
  assert.ok(frenchPost?.fr);
  assert.ok(guides.links.some((link) => link.title === frenchPost.fr!.title));
});

test('formats starting prices with the site wording', () => {
  assert.equal(formatTierPrice({ name: 'Showcase', fromMad: 2000, note: '' }, 'en'), 'from 2,000 MAD');
  assert.equal(formatTierPrice({ name: 'Vitrine', fromMad: 2000, note: '' }, 'fr').replace(/\s/g, ' '), 'à partir de 2 000 MAD');
  assert.equal(formatTierPrice({ name: 'Booking', fromMad: null, note: '' }, 'en'), 'on quote');
  const prices = getPricing('en').tiers.map((tier) => tier.price);
  assert.ok(prices.includes('from 2,000 MAD'));
  assert.ok(prices.includes('from 3,500 MAD'));
});

test('dates the fact sheet with the newest content change', () => {
  const latest = getContentLastModified();
  assert.match(latest, /^\d{4}-\d{2}-\d{2}$/);
  for (const date of [...serviceLandingPages, ...audienceLandingPages, ...projects, ...blogPosts].map((item) => item.modifiedAt)) {
    assert.ok(date <= latest, `${date} is newer than ${latest}`);
  }
});

test('has a verified entity for every served area except the non-place "International"', () => {
  for (const area of siteConfig.business.areaServed) {
    if (area === 'International') continue;
    const entity = areaEntities[area];
    assert.ok(entity, `${area} has no Wikidata entity`);
    assert.match(entity.wikidata, /^Q\d+$/);
    assert.ok(entity.wikipedia.startsWith('https://en.wikipedia.org/wiki/'));
  }
});
