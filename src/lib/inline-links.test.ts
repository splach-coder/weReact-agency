import assert from 'node:assert/strict';
import test from 'node:test';
import { inlineLinkTargets, stripInlineLinks } from './inline-links';
import { serviceLandingPages, type ServiceLocaleCopy } from '../data/services';
import { audienceLandingPages } from '../data/audiences';
import { blogPosts } from '../data/blog';
import { projects } from '../data/projects';

test('strips inline link markup to its anchor text', () => {
  assert.equal(
    stripInlineLinks('See our [pricing guide](/fr/blog/combien-coute-site-web-maroc) first.'),
    'See our pricing guide first.',
  );
  assert.equal(stripInlineLinks('No links [here] (x) or [there](https://example.com).'), 'No links [here] (x) or [there](https://example.com).');
});

function copyStrings(copy: ServiceLocaleCopy): string[] {
  return [
    copy.lead,
    copy.proof,
    ...copy.outcomes,
    ...copy.faqs.map((faq) => faq.answer),
    ...(copy.insights ? [copy.insights.lead ?? '', copy.insights.note ?? '', ...copy.insights.items.map((i) => i.label)] : []),
    ...(copy.sections ?? []).flatMap((section) => section.paragraphs),
  ];
}

test('every inline link in article Q&As points at a page in the same language', () => {
  for (const post of blogPosts) {
    for (const [locale, faqs] of [['en', post.faqs ?? []], ['fr', post.fr?.faqs ?? []]] as const) {
      for (const target of faqs.flatMap((faq) => inlineLinkTargets(faq.answer))) {
        assert.ok(target.startsWith(`/${locale}/`), `${post.slug} (${locale}) Q&A links to another language: ${target}`);
      }
    }
  }
});

test('every inline link in landing copy points at a real page in the same language', () => {
  const growthSlugs = new Set<string>([...serviceLandingPages, ...audienceLandingPages].map((page) => page.slug));
  const staticPaths = new Set(['', '/contact', '/work', '/about', '/book', '/blog', '/sitemap', '/ai-info']);
  const postSlugs = new Set(blogPosts.map((post) => post.slug));
  const projectIds = new Set(projects.map((project) => project.id));

  for (const page of [...serviceLandingPages, ...audienceLandingPages]) {
    for (const locale of ['en', 'fr'] as const) {
      for (const target of copyStrings(page.copy[locale]).flatMap(inlineLinkTargets)) {
        const path = target.split('#')[0].split('?')[0];
        assert.ok(path.startsWith(`/${locale}`), `${page.slug} (${locale}) links to another language: ${target}`);
        const rest = path.slice(locale.length + 1);
        const valid =
          staticPaths.has(rest) ||
          growthSlugs.has(rest.slice(1)) ||
          (rest.startsWith('/blog/') && postSlugs.has(rest.slice(6))) ||
          (rest.startsWith('/work/') && projectIds.has(rest.slice(6)));
        assert.ok(valid, `${page.slug} (${locale}) links to a page that does not exist: ${target}`);
        assert.notEqual(rest.slice(1), page.slug, `${page.slug} (${locale}) links to itself`);
      }
    }
  }
});
