import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateCommunicationHealth,
  calculateFunnelMetrics,
  normalizeProviderEventType,
  parseAttentionMutation,
  type Communication,
} from './automation';
import type { CrmLead, CrmProject } from './crm';
import type { FinanceTransaction } from './operations';

const UUID = '11111111-1111-4111-8111-111111111111';

function lead(overrides: Partial<CrmLead> = {}): CrmLead {
  return {
    id: UUID,
    created_at: '2026-07-01T09:00:00.000Z',
    updated_at: '2026-07-01T09:00:00.000Z',
    client_id: null,
    name: 'Atlas Riad',
    email: 'hello@example.com',
    company: 'Atlas Riad',
    phone: '+212600000000',
    whatsapp: '+212600000000',
    message: 'Website enquiry',
    status: 'new',
    source: 'website_contact_form',
    attribution: {},
    notes: null,
    assigned_to: '70karim.hida@gmail.com',
    estimated_value: null,
    next_follow_up: null,
    last_contacted_at: null,
    ...overrides,
  };
}

function communication(state: Communication['state']): Communication {
  return {
    id: crypto.randomUUID(),
    channel: 'email',
    direction: 'outbound',
    provider: 'resend',
    provider_message_id: crypto.randomUUID(),
    state,
    from_address: 'hello@wereact.agency',
    to_address: 'client@example.com',
    subject: 'Project update',
    body_summary: '',
    lead_id: null,
    client_id: null,
    project_id: null,
    invoice_id: null,
    approved_by: null,
    approved_at: null,
    sent_at: '2026-07-01T10:00:00.000Z',
    delivered_at: null,
    opened_at: null,
    clicked_at: null,
    replied_at: null,
    failed_at: null,
    created_at: '2026-07-01T10:00:00.000Z',
    updated_at: '2026-07-01T10:00:00.000Z',
  };
}

test('validates complete and future snooze attention actions', () => {
  assert.deepEqual(parseAttentionMutation({ id: UUID, action: 'complete' }), {
    valid: true,
    value: { id: UUID, action: 'complete', snoozeUntil: null },
  });

  assert.deepEqual(
    parseAttentionMutation(
      { id: UUID, action: 'snooze', snoozeUntil: '2026-07-24T12:00:00.000Z' },
      new Date('2026-07-23T12:00:00.000Z'),
    ),
    {
      valid: true,
      value: { id: UUID, action: 'snooze', snoozeUntil: '2026-07-24T12:00:00.000Z' },
    },
  );
});

test('rejects malformed attention ids and unsafe snooze dates', () => {
  assert.equal(parseAttentionMutation({ id: 'bad', action: 'complete' }).valid, false);
  assert.equal(parseAttentionMutation(
    { id: UUID, action: 'snooze', snoozeUntil: '2026-07-22T12:00:00.000Z' },
    new Date('2026-07-23T12:00:00.000Z'),
  ).valid, false);
  assert.equal(parseAttentionMutation(
    { id: UUID, action: 'snooze', snoozeUntil: '2026-09-23T12:00:00.000Z' },
    new Date('2026-07-23T12:00:00.000Z'),
  ).valid, false);
});

test('normalizes supported provider event types and rejects unknown events', () => {
  assert.equal(normalizeProviderEventType('email.sent'), 'sent');
  assert.equal(normalizeProviderEventType('email.delivered'), 'delivered');
  assert.equal(normalizeProviderEventType('email.opened'), 'opened');
  assert.equal(normalizeProviderEventType('email.clicked'), 'clicked');
  assert.equal(normalizeProviderEventType('email.bounced'), 'bounced');
  assert.equal(normalizeProviderEventType('email.complained'), 'complained');
  assert.equal(normalizeProviderEventType('email.failed'), 'failed');
  assert.equal(normalizeProviderEventType('contact.updated'), null);
});

test('calculates communication delivery and engagement health', () => {
  const metrics = calculateCommunicationHealth([
    communication('sent'),
    communication('delivered'),
    communication('opened'),
    communication('clicked'),
    communication('replied'),
    communication('bounced'),
    communication('failed'),
    { ...communication('delivered'), channel: 'phone' },
    { ...communication('delivered'), direction: 'inbound' },
  ]);

  assert.deepEqual(metrics, {
    sent: 7,
    delivered: 4,
    engaged: 3,
    failed: 2,
    deliveryRate: 57,
    engagementRate: 75,
  });
  assert.equal(calculateCommunicationHealth([]).deliveryRate, 0);
});

test('calculates one source-to-revenue funnel with explicit rates', () => {
  const leads = [
    lead({ id: '11111111-1111-4111-8111-111111111111', last_contacted_at: '2026-07-01T09:20:00.000Z', status: 'won', estimated_value: 5000, source: 'google_ads' }),
    lead({ id: '22222222-2222-4222-8222-222222222222', last_contacted_at: '2026-07-01T12:00:00.000Z', status: 'proposal_sent', estimated_value: 3000, source: 'referral' }),
    lead({ id: '33333333-3333-4333-8333-333333333333', status: 'lost', source: 'google_ads' }),
    lead({ id: '44444444-4444-4444-8444-444444444444', status: 'new', estimated_value: 2000, source: 'instagram' }),
  ];
  const projects = [{ id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', originating_lead_id: leads[0].id }] as CrmProject[];
  const finances = [{
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    created_at: '2026-07-10T10:00:00.000Z',
    occurred_on: '2026-07-10',
    type: 'income',
    status: 'paid',
    amount: 5000,
    category: 'Project revenue',
    description: 'Atlas Riad website',
    reference: null,
    client_id: null,
    project_id: projects[0].id,
    created_by: 'anas@example.com',
  }] as FinanceTransaction[];

  assert.deepEqual(calculateFunnelMetrics(leads, projects, finances), {
    totalLeads: 4,
    respondedLeads: 2,
    responseSlaRate: 50,
    qualifiedLeads: 2,
    qualificationRate: 50,
    proposals: 2,
    proposalRate: 50,
    wins: 1,
    losses: 1,
    winRate: 25,
    pipelineValue: 5000,
    averageWonValue: 5000,
    revenueBySource: [{ source: 'google_ads', revenue: 5000 }],
  });
});