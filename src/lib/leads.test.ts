import assert from 'node:assert/strict';
import test from 'node:test';
import { createLeadRecord } from './leads';

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
    }
  );

  assert.equal(lead.attribution.gclid, 'abc123');
  assert.equal(lead.attribution.fbclid, 'fb456');
  assert.equal(lead.attribution.transaction_id, 'tx-1');
  assert.equal('injected_key' in lead.attribution, false);
  assert.equal('utm_source' in lead.attribution, false);
  assert.equal(lead.attribution.landing_page?.length, 512);
});
