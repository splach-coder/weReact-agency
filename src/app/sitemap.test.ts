import assert from 'node:assert/strict';
import test from 'node:test';
import sitemap from './sitemap';

test('includes localized commercial service pages and article modification dates', () => {
  const routes = sitemap();
  assert.ok(routes.some((entry) => entry.url.endsWith('/fr/web-design-marrakech')));
  const article = routes.find((entry) => entry.url.endsWith('/blog/website-design-marrakech-business-guide'));
  assert.equal(new Date(article?.lastModified ?? '').toISOString().slice(0, 10), '2026-07-12');
});
