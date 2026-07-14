import type { LeadRecord } from '@/lib/leads';

const HUBSPOT_API_URL = 'https://api.hubapi.com';
const HUBSPOT_SALES_OWNER_ID = '35904457';

type Fetcher = typeof fetch;
type HubSpotObject = { id: string };
type HubSpotSearchResponse = { results?: HubSpotObject[] };

export type HubSpotSyncResult =
  | { synced: true; contactId: string; dealId: string }
  | { synced: false; reason: 'not_configured' | 'sync_failed' };

function splitName(name: string) {
  const [firstname, ...rest] = name.trim().split(/\s+/);
  return { firstname, lastname: rest.join(' ') };
}

function compactProperties(properties: Record<string, string | null | undefined>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => typeof value === 'string' && value.length > 0),
  );
}

function formatAttribution(record: LeadRecord) {
  const values = Object.entries(record.attribution ?? {})
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);
  return values.length ? `\n\nAttribution\n${values.join('\n')}` : '';
}

export function buildHubSpotContactProperties(record: LeadRecord) {
  const { firstname, lastname } = splitName(record.name);
  return compactProperties({
    firstname,
    lastname,
    email: record.email,
    phone: record.phone,
    mobilephone: record.whatsapp,
    company: record.company,
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
    hubspot_owner_id: HUBSPOT_SALES_OWNER_ID,
  });
}

export function buildHubSpotDealProperties(record: LeadRecord) {
  const leadName = record.company ? `${record.company} - ${record.name}` : record.name;
  return {
    dealname: `Website enquiry - ${leadName}`,
    pipeline: 'default',
    dealstage: 'appointmentscheduled',
    hubspot_owner_id: HUBSPOT_SALES_OWNER_ID,
    description: `${record.message}\n\nPhone: ${record.phone}\nWhatsApp: ${record.whatsapp ?? 'Not provided'}${formatAttribution(record)}`,
  };
}

async function hubSpotRequest<T>(path: string, token: string, init: RequestInit, fetcher: Fetcher): Promise<T> {
  const response = await fetcher(`${HUBSPOT_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    signal: AbortSignal.timeout(6000),
  });
  if (!response.ok) throw new Error(`HubSpot request failed (${response.status}): ${await response.text()}`);
  return response.json() as Promise<T>;
}

async function upsertContact(record: LeadRecord, token: string, fetcher: Fetcher) {
  const search = await hubSpotRequest<HubSpotSearchResponse>(
    '/crm/v3/objects/contacts/search',
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: record.email }] }],
        properties: ['email'],
        limit: 1,
      }),
    },
    fetcher,
  );
  const properties = buildHubSpotContactProperties(record);
  const existing = search.results?.[0];
  if (existing) {
    return hubSpotRequest<HubSpotObject>(
      `/crm/v3/objects/contacts/${existing.id}`,
      token,
      { method: 'PATCH', body: JSON.stringify({ properties }) },
      fetcher,
    );
  }
  return hubSpotRequest<HubSpotObject>(
    '/crm/v3/objects/contacts',
    token,
    { method: 'POST', body: JSON.stringify({ properties }) },
    fetcher,
  );
}

async function createDeal(record: LeadRecord, contactId: string, token: string, fetcher: Fetcher) {
  return hubSpotRequest<HubSpotObject>(
    '/crm/v3/objects/deals',
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        properties: buildHubSpotDealProperties(record),
        associations: [{
          to: { id: contactId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }],
        }],
      }),
    },
    fetcher,
  );
}

export async function syncLeadToHubSpot(
  record: LeadRecord,
  token = process.env.HUBSPOT_ACCESS_TOKEN,
  fetcher: Fetcher = fetch,
): Promise<HubSpotSyncResult> {
  if (!token) return { synced: false, reason: 'not_configured' };
  try {
    const contact = await upsertContact(record, token, fetcher);
    const deal = await createDeal(record, contact.id, token, fetcher);
    return { synced: true, contactId: contact.id, dealId: deal.id };
  } catch (error) {
    console.error('HubSpot lead sync failed.', error);
    return { synced: false, reason: 'sync_failed' };
  }
}
