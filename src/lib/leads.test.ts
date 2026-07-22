import assert from 'node:assert/strict';
import test from 'node:test';
import { createLeadRecord, getAllowedSourcePage } from './leads';

test('creates a new lead record with direct contact routes and attribution', () => {
  const lead = createLeadRecord(
    {
      name: 'Anas Benbow',
      email: 'anas@example.com',
      company: 'WeReact',
      phone: '+212 600 000 000',
      whatsapp: '+212 611 000 000',
      message: 'I need a website.',
    },
    { landing_page: 'https://www.wereact.agency/en/contact', utm_source: 'google' }
  );

  assert.equal(lead.status, 'new');
  assert.equal(lead.phone, '+212 600 000 000');
  assert.equal(lead.whatsapp, '+212 611 000 000');
  assert.equal(lead.attribution.utm_source, 'google');
});

test('normalizes a null attribution from direct visitors instead of crashing downstream', () => {
  const lead = createLeadRecord({
    name: 'Anas',
    email: 'anas@example.com',
    attribution: null,
  });

  assert.deepEqual(lead.attribution, {});
  // The HubSpot formatter iterates entries — must never throw.
  assert.doesNotThrow(() => Object.entries(lead.attribution));
});

test('whitelists attribution keys, keeps strings only, and truncates oversized values', () => {
  const lead = createLeadRecord(
    { name: 'Anas', email: 'anas@example.com' },
    {
      gclid: 'abc123',
      fbclid: 'fb456',
      transaction_id: 'tx-1',
      injected_key: 'evil',
      utm_source: { nested: 'object' },
      landing_page: 'x'.repeat(2000),
      source_page: 'forged-admin-page',
    }
  );

  assert.equal(lead.attribution.gclid, 'abc123');
  assert.equal(lead.attribution.fbclid, 'fb456');
  assert.equal(lead.attribution.transaction_id, 'tx-1');
  assert.equal('injected_key' in lead.attribution, false);
  assert.equal('utm_source' in lead.attribution, false);
  assert.equal(lead.attribution.landing_page?.length, 512);
  assert.equal(lead.attribution.source_page, undefined);
});

test('stores qualification inside the existing lead message', () => {
  const lead = createLeadRecord({
    name: 'Amina',
    email: 'amina@example.com',
    projectType: 'tourism',
    budget: '5000-10000',
    timeline: 'within-month',
    message: 'We need a bilingual booking website.',
  });
  assert.match(lead.message, /Project type: tourism/);
  assert.match(lead.message, /Budget: 5000-10000/);
  assert.match(lead.message, /Timeline: within-month/);
  assert.match(lead.message, /We need a bilingual booking website/);
});

test('allows only known commercial pages as lead sources', () => {
  assert.equal(getAllowedSourcePage('tourism-websites-morocco'), 'tourism-websites-morocco');
  assert.equal(getAllowedSourcePage('international-web-design-agency'), 'international-web-design-agency');
  assert.equal(getAllowedSourcePage('forged-admin-page'), undefined);
});
