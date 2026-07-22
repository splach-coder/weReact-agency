import assert from 'node:assert/strict';
import test from 'node:test';
import { blogPosts } from './blog';

test('every post has a named business author, ISO dates, and one related service page', () => {
  for (const post of blogPosts) {
    assert.match(post.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(post.modifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(post.author);
    assert.ok(post.authorRole);
    assert.ok(post.relatedServiceSlug);
  }
});

test('assigns every article to one relevant audience path', () => {
  const validAudienceSlugs = new Set([
    'tourism-websites-morocco',
    'website-design-moroccan-businesses',
    'international-web-design-agency',
  ]);

  for (const post of blogPosts) {
    assert.ok(validAudienceSlugs.has(post.relatedAudienceSlug));
  }
});

test('provides complete French metadata and article copy for every post', () => {
  for (const post of blogPosts) {
    assert.ok(post.fr);
    assert.ok(post.fr.metaDescription);
    assert.ok(post.fr.date);
    assert.ok(post.fr.readTime);
    assert.ok(post.fr.category);
    assert.ok(post.fr.authorRole);
    assert.match(post.fr.content, /<h2>/);
  }
});
