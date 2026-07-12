import assert from 'node:assert/strict';
import test from 'node:test';
import { buildHubSpotContactProperties, buildHubSpotDealProperties, syncLeadToHubSpot } from './hubspot';
import type { LeadRecord } from './leads';

const lead: LeadRecord = {
  name: 'Karim Hida',
  email: 'karim@example.com',
  company: 'Atlas Studio',
  phone: '+212600000000',
  whatsapp: '+212611111111',
  message: 'We need a new tourism website.',
  status: 'new',
  source: 'website_contact_form',
  attribution: { utm_source: 'google', gclid: 'test-click' },
};

test('maps a website lead to standard HubSpot contact fields', () => {
  assert.deepEqual(buildHubSpotContactProperties(lead), {
    firstname: 'Karim',
    lastname: 'Hida',
    email: 'karim@example.com',
    phone: '+212600000000',
    mobilephone: '+212611111111',
    company: 'Atlas Studio',
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
    hubspot_owner_id: '35904457',
  });
});

test('creates a new-enquiry deal payload with attribution', () => {
  const properties = buildHubSpotDealProperties(lead);
  assert.equal(properties.dealstage, 'appointmentscheduled');
  assert.equal(properties.pipeline, 'default');
  assert.equal(properties.hubspot_owner_id, '35904457');
  assert.match(properties.dealname, /Atlas Studio - Karim Hida/);
  assert.match(properties.description, /utm_source: google/);
  assert.match(properties.description, /gclid: test-click/);
});

test('updates an existing contact and creates an associated deal', async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const fetcher = async (url: string | URL | Request, init?: RequestInit) => {
    requests.push({ url: String(url), init });
    if (String(url).endsWith('/contacts/search')) return Response.json({ results: [{ id: 'contact-1' }] });
    if (String(url).endsWith('/contacts/contact-1')) return Response.json({ id: 'contact-1' });
    return Response.json({ id: 'deal-1' });
  };

  const result = await syncLeadToHubSpot(lead, 'test-token', fetcher as typeof fetch);

  assert.deepEqual(result, { synced: true, contactId: 'contact-1', dealId: 'deal-1' });
  assert.equal(requests[1].init?.method, 'PATCH');
  const dealBody = JSON.parse(String(requests[2].init?.body));
  assert.equal(dealBody.associations[0].to.id, 'contact-1');
  assert.equal(dealBody.associations[0].types[0].associationTypeId, 3);
});

test('skips HubSpot cleanly when no token is configured', async () => {
  assert.deepEqual(await syncLeadToHubSpot(lead, ''), { synced: false, reason: 'not_configured' });
});
