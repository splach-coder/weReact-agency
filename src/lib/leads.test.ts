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
