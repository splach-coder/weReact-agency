import assert from 'node:assert/strict';
import test from 'node:test';
import { getBlogUi } from './blog-ui';

test('uses French metadata and action copy on French blog pages', () => {
  const fr = getBlogUi('fr');
  assert.match(fr.indexTitle, /Journal/);
  assert.match(fr.indexDescription, /Marrakech|Maroc/);
  assert.equal(fr.readArticle, 'Lire l’article');
  assert.equal(fr.contact, 'Nous contacter');
  assert.equal(fr.shareArticle, 'Partager l’article');
});

test('falls back to English for unsupported locales', () => {
  assert.equal(getBlogUi('de').readArticle, 'Read article');
});
