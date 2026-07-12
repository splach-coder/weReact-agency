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
