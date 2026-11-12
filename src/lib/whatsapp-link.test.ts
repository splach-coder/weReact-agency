import assert from 'node:assert/strict';
import test from 'node:test';
import { buildWaMeLink, normalizeWhatsAppNumber } from './whatsapp-link';

test('Moroccan numbers typed nationally get 212 and lose the trunk 0', () => {
  assert.deepEqual(normalizeWhatsAppNumber('06 12 34 56 78', '212'), { digits: '212612345678', warning: undefined });
  assert.equal(normalizeWhatsAppNumber('07-12-34-56-78', '212').digits, '212712345678');
  assert.equal(normalizeWhatsAppNumber('612345678', '212').digits, '212612345678');
});

test('international input is kept whatever country is selected', () => {
  assert.equal(normalizeWhatsAppNumber('+212 6 12 34 56 78', '33').digits, '212612345678');
  assert.equal(normalizeWhatsAppNumber('00212612345678', '33').digits, '212612345678');
  assert.equal(normalizeWhatsAppNumber('212612345678', '212').digits, '212612345678');
  assert.equal(normalizeWhatsAppNumber('+33 6 12 34 56 78', '212').digits, '33612345678');
});

test('other countries', () => {
  assert.equal(normalizeWhatsAppNumber('06 12 34 56 78', '33').digits, '33612345678');
  assert.equal(normalizeWhatsAppNumber('07700 900123', '44').digits, '447700900123');
  assert.equal(normalizeWhatsAppNumber('06 1234 5678', '39').digits, '390612345678');
});

test('warnings for numbers that cannot be right', () => {
  assert.equal(normalizeWhatsAppNumber('06 12 34', '212').warning, 'moroccoLength');
  assert.equal(normalizeWhatsAppNumber('05 24 12 34 56', '212').warning, 'moroccoPrefix');
  assert.equal(normalizeWhatsAppNumber('+44 123', '212').warning, 'tooShort');
  assert.equal(normalizeWhatsAppNumber('', '212').digits, '');
});

test('links encode the message and drop it when blank', () => {
  assert.equal(buildWaMeLink('212612345678'), 'https://wa.me/212612345678');
  assert.equal(buildWaMeLink('212612345678', '   '), 'https://wa.me/212612345678');
  assert.equal(
    buildWaMeLink('212612345678', 'Bonjour, un devis ? Quad & dîner\nmerci'),
    'https://wa.me/212612345678?text=Bonjour%2C%20un%20devis%20%3F%20Quad%20%26%20d%C3%AEner%0Amerci',
  );
});
