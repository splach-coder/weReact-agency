import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CRM_STATUSES,
  DEFAULT_SELLER_EMAIL,
  PROJECT_STATUSES,
  filterLeads,
  formatLeadAge,
  getLeadContactRoute,
  getProjectBriefProgress,
  groupLeadsByStatus,
  type CrmLead,
  type CrmProject,
} from './crm';

function lead(overrides: Partial<CrmLead> = {}): CrmLead {
  return {
    id: 'lead-1',
    created_at: '2026-07-20T10:00:00.000Z',
    updated_at: '2026-07-20T10:00:00.000Z',
    name: 'Yassine Amrani',
    email: 'yassine@example.com',
    company: 'Atlas Riad',
    phone: '+212 600 000 000',
    whatsapp: '+212 611 000 000',
    message: 'We need a booking website.',
    status: 'new',
    source: 'website_contact_form',
    attribution: { utm_source: 'google', utm_campaign: 'marrakech-search' },
    notes: null,
    assigned_to: null,
    estimated_value: null,
    next_follow_up: null,
    last_contacted_at: null,
    ...overrides,
  };
}

test('groups every lead into the seven sales pipeline stages', () => {
  const grouped = groupLeadsByStatus([
    lead(),
    lead({ id: 'lead-2', status: 'discovery' }),
    lead({ id: 'lead-3', status: 'won' }),
  ]);

  assert.deepEqual(CRM_STATUSES, ['new', 'contacted', 'discovery', 'proposal_sent', 'negotiation', 'won', 'lost']);
  assert.deepEqual(Object.keys(grouped), CRM_STATUSES);
  assert.equal(grouped.new.length, 1);
  assert.equal(grouped.contacted.length, 0);
  assert.equal(grouped.discovery[0].id, 'lead-2');
  assert.equal(grouped.won[0].id, 'lead-3');
});

test('filters leads by status and human-visible contact text', () => {
  const leads = [
    lead(),
    lead({
      id: 'lead-2',
      name: 'Sara Karim',
      email: 'sara@studio.ma',
      company: 'Safi Studio',
      status: 'contacted',
    }),
  ];

  assert.deepEqual(filterLeads(leads, { query: 'atlas', status: 'all' }).map((item) => item.id), ['lead-1']);
  assert.deepEqual(filterLeads(leads, { query: 'SARA@', status: 'contacted' }).map((item) => item.id), ['lead-2']);
  assert.equal(filterLeads(leads, { query: '', status: 'won' }).length, 0);
});

test('chooses WhatsApp, then phone, then email as the direct contact route', () => {
  assert.deepEqual(getLeadContactRoute(lead()), {
    kind: 'whatsapp',
    href: 'https://wa.me/212611000000',
  });
  assert.deepEqual(getLeadContactRoute(lead({ whatsapp: null })), {
    kind: 'phone',
    href: 'tel:+212600000000',
  });
  assert.deepEqual(getLeadContactRoute(lead({ whatsapp: null, phone: '' })), {
    kind: 'email',
    href: 'mailto:yassine@example.com',
  });
});

test('normalizes local Moroccan numbers for WhatsApp links', () => {
  assert.deepEqual(getLeadContactRoute(lead({ whatsapp: '06 45 09 86 91' })), {
    kind: 'whatsapp',
    href: 'https://wa.me/212645098691',
  });
});

test('formats lead age without unstable locale output', () => {
  const now = new Date('2026-07-21T10:00:00.000Z');
  assert.equal(formatLeadAge('2026-07-21T09:00:00.000Z', now), 'Today');
  assert.equal(formatLeadAge('2026-07-20T10:00:00.000Z', now), '1 day ago');
  assert.equal(formatLeadAge('2026-07-16T10:00:00.000Z', now), '5 days ago');
});
test('keeps Karim as the automatic seller and exposes stable project stages', () => {
  assert.equal(DEFAULT_SELLER_EMAIL, '70karim.hida@gmail.com');
  assert.deepEqual(PROJECT_STATUSES, [
    'briefing',
    'ready_for_dev',
    'building',
    'review',
    'launched',
    'paused',
  ]);
});

test('measures whether a project brief is ready for developer handoff', () => {
  const project = {
    project_name: 'Atlas Riad booking website',
    project_type: 'Business website',
    goals: 'Increase direct bookings and reduce OTA dependence.',
    pages: ['Home', 'Rooms', 'Booking', 'Contact'],
    features: ['WhatsApp', 'Booking request'],
    languages: ['English', 'French'],
  } as CrmProject;

  assert.deepEqual(getProjectBriefProgress(project), {
    completed: 6,
    total: 6,
    percentage: 100,
    missing: [],
    ready: true,
  });

  assert.deepEqual(getProjectBriefProgress({ ...project, pages: [] }), {
    completed: 5,
    total: 6,
    percentage: 83,
    missing: ['pages'],
    ready: false,
  });
});