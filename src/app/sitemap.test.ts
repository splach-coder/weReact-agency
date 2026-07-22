import assert from 'node:assert/strict';
import test from 'node:test';
import sitemap from './sitemap';

test('includes localized commercial service pages and article modification dates', () => {
  const routes = sitemap();
  assert.ok(routes.some((entry) => entry.url.endsWith('/fr/web-design-marrakech')));
  const article = routes.find((entry) => entry.url.endsWith('/blog/website-design-marrakech-business-guide'));
  assert.equal(new Date(article?.lastModified ?? '').toISOString().slice(0, 10), '2026-07-14');
});

test('includes both new audience paths in English and French', () => {
  const routes = sitemap();
  assert.ok(routes.some((entry) => entry.url.endsWith('/en/website-design-moroccan-businesses')));
  assert.ok(routes.some((entry) => entry.url.endsWith('/fr/website-design-moroccan-businesses')));
  assert.ok(routes.some((entry) => entry.url.endsWith('/en/international-web-design-agency')));
  assert.ok(routes.some((entry) => entry.url.endsWith('/fr/international-web-design-agency')));
});

test('uses stable project modification dates instead of the build time', () => {
  const createSitemap = sitemap as (buildDate?: Date) => ReturnType<typeof sitemap>;
  const routes = createSitemap(new Date('2030-01-02T00:00:00.000Z'));
  const home = routes.find((entry) => entry.url.endsWith('/en'));
  const project = routes.find((entry) => entry.url.endsWith('/en/work/flying-tandem'));
  assert.equal(new Date(home?.lastModified ?? '').toISOString().slice(0, 10), '2030-01-02');
  assert.equal(new Date(project?.lastModified ?? '').toISOString().slice(0, 10), '2026-07-22');
});
