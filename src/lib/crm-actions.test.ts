import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseLeadNote,
  parseLeadUpdate,
  parseManualLead,
  parseProjectBrief,
  parseProjectWorkItem,
} from './crm-actions';

test('normalizes a complete lead workflow update', () => {
  const result = parseLeadUpdate({
    status: 'discovery',
    assignedTo: '  karim@example.com ',
    estimatedValue: '3500.50',
    nextFollowUp: '2026-07-25T08:30:00.000Z',
    expectedUpdatedAt: '2026-07-21T10:00:00.000Z',
  });

  assert.deepEqual(result, {
    valid: true,
    value: {
      status: 'discovery',
      assigned_to: 'karim@example.com',
      estimated_value: 3500.5,
      next_follow_up: '2026-07-25T08:30:00.000Z',
      expected_updated_at: '2026-07-21T10:00:00.000Z',
    },
  });
});

test('accepts cleared optional workflow values', () => {
  assert.deepEqual(
    parseLeadUpdate({
      status: 'contacted',
      assignedTo: '',
      estimatedValue: '',
      nextFollowUp: '',
      expectedUpdatedAt: '2026-07-21T10:00:00.000Z',
    }),
    {
      valid: true,
      value: {
        status: 'contacted',
        assigned_to: null,
        estimated_value: null,
        next_follow_up: null,
        expected_updated_at: '2026-07-21T10:00:00.000Z',
      },
    },
  );
});

test('rejects unsupported statuses, negative money, and invalid dates', () => {
  assert.deepEqual(parseLeadUpdate({ status: 'deleted' }), {
    valid: false,
    error: 'Choose a valid pipeline stage.',
  });
  assert.deepEqual(parseLeadUpdate({ status: 'new', estimatedValue: '-5' }), {
    valid: false,
    error: 'Estimated value must be a positive number.',
  });
  assert.deepEqual(parseLeadUpdate({ status: 'new', nextFollowUp: 'not-a-date' }), {
    valid: false,
    error: 'Choose a valid follow-up date.',
  });
  assert.deepEqual(parseLeadUpdate({ status: 'new', nextFollowUp: '2026-07-25T09:30' }), {
    valid: false,
    error: 'Choose a valid follow-up date.',
  });
});

test('requires a timezone-explicit lead version for conflict detection', () => {
  assert.deepEqual(parseLeadUpdate({ status: 'new' }), {
    valid: false,
    error: 'Refresh this lead before saving.',
  });
  assert.deepEqual(parseLeadUpdate({ status: 'new', expectedUpdatedAt: '2026-07-21T10:00' }), {
    valid: false,
    error: 'Refresh this lead before saving.',
  });
});
test('trims useful notes and rejects empty or oversized notes', () => {
  assert.deepEqual(parseLeadNote('  Called the client and sent the proposal.  '), {
    valid: true,
    value: 'Called the client and sent the proposal.',
  });
  assert.deepEqual(parseLeadNote('   '), {
    valid: false,
    error: 'Write a note before saving.',
  });
  assert.deepEqual(parseLeadNote('x'.repeat(2001)), {
    valid: false,
    error: 'Keep notes under 2,000 characters.',
  });
});
test('normalizes a complete website project brief', () => {
  assert.deepEqual(parseProjectBrief({
    projectId: '',
    projectName: '  Atlas Riad website ',
    projectType: 'Business website',
    status: 'ready_for_dev',
    domainName: ' AtlasRiad.ma ',
    goals: ' Increase direct bookings. ',
    pages: 'Home\nRooms\nBooking\nContact',
    features: 'WhatsApp, booking request',
    languages: ['English', 'French'],
    contentStatus: 'client_preparing',
    brandStatus: 'ready',
    domainStatus: 'owned',
    hostingStatus: 'needed',
    references: 'https://example.com\nhttps://example.org',
    budget: '8500',
    targetLaunch: '2026-09-15',
    developerNotes: 'Use the current photography.',
  }), {
    valid: true,
    value: {
      project_id: null,
      expected_updated_at: null,
      project_name: 'Atlas Riad website',
      project_type: 'Business website',
      status: 'ready_for_dev',
      domain_name: 'atlasriad.ma',
      goals: 'Increase direct bookings.',
      pages: ['Home', 'Rooms', 'Booking', 'Contact'],
      features: ['WhatsApp', 'booking request'],
      languages: ['English', 'French'],
      content_status: 'client_preparing',
      brand_status: 'ready',
      domain_status: 'owned',
      hosting_status: 'needed',
      reference_sites: ['https://example.com', 'https://example.org'],
      budget: 8500,
      target_launch: '2026-09-15',
      developer_notes: 'Use the current photography.',
    },
  });
});

test('requires a current version when editing an existing website project', () => {
  assert.deepEqual(parseProjectBrief({
    projectId: '123e4567-e89b-42d3-a456-426614174000',
    projectName: 'Riad website',
    projectType: 'Business website',
    status: 'briefing',
  }), {
    valid: false,
    error: 'Refresh this project before saving.',
  });
});
test('blocks developer handoff until the essential brief is complete', () => {
  assert.deepEqual(parseProjectBrief({
    projectName: 'Riad website',
    projectType: 'Business website',
    status: 'ready_for_dev',
    domainName: ' AtlasRiad.ma ',
    goals: '',
    pages: '',
    features: 'WhatsApp',
    languages: 'English',
  }), {
    valid: false,
    error: 'Complete the goals, pages, features, and languages before development.',
  });
});

test('requires a confirmed amount before closing a project as fully paid', () => {
  assert.deepEqual(parseProjectBrief({
    projectName: 'Riad website',
    projectType: 'Business website',
    status: 'launched',
    goals: 'Increase direct bookings.',
    pages: 'Home, Rooms, Contact',
    features: 'Booking request',
    languages: 'English, French',
    budget: '',
  }), {
    valid: false,
    error: 'Add the confirmed project amount before closing it.',
  });
});
test('normalizes a phone-first manual enquiry without inventing an email', () => {
  assert.deepEqual(parseManualLead({
    name: '  Salma Idrissi  ',
    email: '',
    company: ' Atlas House ',
    phone: ' +212 612 345 678 ',
    whatsapp: ' 06 12 34 56 78 ',
    source: 'whatsapp',
    message: ' Needs a booking website. ',
  }), {
    valid: true,
    value: {
      name: 'Salma Idrissi',
      email: '',
      company: 'Atlas House',
      phone: '+212 612 345 678',
      whatsapp: '06 12 34 56 78',
      source: 'whatsapp',
      message: 'Needs a booking website.',
    },
  });
});

test('requires a name and at least one usable manual contact route', () => {
  assert.deepEqual(parseManualLead({ name: '', phone: '+212600000000' }), {
    valid: false,
    error: 'Add the client name.',
  });
  assert.deepEqual(parseManualLead({ name: 'Salma' }), {
    valid: false,
    error: 'Add an email, phone, or WhatsApp number.',
  });
});

test('rejects malformed manual emails and unsupported lead sources', () => {
  assert.deepEqual(parseManualLead({ name: 'Salma', email: 'not-an-email' }), {
    valid: false,
    error: 'Enter a valid email address.',
  });
  assert.deepEqual(parseManualLead({ name: 'Salma', phone: '+212600000000', source: 'unknown-network' }), {
    valid: false,
    error: 'Choose a valid enquiry source.',
  });
});

test('normalizes a project work item with its delivery details', () => {
  assert.deepEqual(parseProjectWorkItem({
    projectId: '123e4567-e89b-42d3-a456-426614174000',
    kind: 'task',
    title: '  Connect the booking form  ',
    details: '  Send confirmations to the client team.  ',
    status: 'in_progress',
    priority: 'high',
    dueOn: '2026-08-01',
    assignedTo: '  developer@wereact.agency ',
    required: true,
    position: '3',
    completedAt: '2026-07-23T10:15:00.000Z',
  }), {
    valid: true,
    value: {
      project_id: '123e4567-e89b-42d3-a456-426614174000',
      kind: 'task', title: 'Connect the booking form', details: 'Send confirmations to the client team.',
      status: 'in_progress', priority: 'high', due_on: '2026-08-01', assigned_to: 'developer@wereact.agency',
      required: true, position: 3, completed_at: '2026-07-23T10:15:00.000Z',
    },
  });
});

test('defaults optional project work fields without widening enum values', () => {
  assert.deepEqual(parseProjectWorkItem({
    projectId: '123e4567-e89b-42d3-a456-426614174000', kind: 'milestone', title: 'Design approved',
  }), {
    valid: true,
    value: {
      project_id: '123e4567-e89b-42d3-a456-426614174000', kind: 'milestone', title: 'Design approved', details: '',
      status: 'todo', priority: 'normal', due_on: null, assigned_to: null, required: false, position: 0, completed_at: null,
    },
  });
});

test('rejects malformed work-item project references and unusable work titles', () => {
  assert.deepEqual(parseProjectWorkItem({ projectId: 'project-1', kind: 'task', title: 'Build it' }), {
    valid: false, error: 'Invalid project reference.',
  });
  assert.deepEqual(parseProjectWorkItem({
    projectId: '123e4567-e89b-42d3-a456-426614174000', kind: 'task', title: '   ',
  }), { valid: false, error: 'Add a work item title.' });
});

test('rejects unsupported work item fields and malformed dates', () => {
  assert.deepEqual(parseProjectWorkItem({ projectId: '123e4567-e89b-42d3-a456-426614174000', kind: 'reminder', title: 'Call client' }), { valid: false, error: 'Choose a valid work item type.' });
  assert.deepEqual(parseProjectWorkItem({ projectId: '123e4567-e89b-42d3-a456-426614174000', kind: 'task', title: 'Call client', status: 'waiting' }), { valid: false, error: 'Choose a valid work item status.' });
  assert.deepEqual(parseProjectWorkItem({ projectId: '123e4567-e89b-42d3-a456-426614174000', kind: 'task', title: 'Call client', priority: 'critical' }), { valid: false, error: 'Choose a valid work item priority.' });
  assert.deepEqual(parseProjectWorkItem({ projectId: '123e4567-e89b-42d3-a456-426614174000', kind: 'task', title: 'Call client', dueOn: '2026-02-30' }), { valid: false, error: 'Choose a valid due date.' });
  assert.deepEqual(parseProjectWorkItem({ projectId: '123e4567-e89b-42d3-a456-426614174000', kind: 'task', title: 'Call client', assignedTo: 'x'.repeat(255) }), { valid: false, error: 'Choose a valid team member.' });
  assert.deepEqual(parseProjectWorkItem({ projectId: '123e4567-e89b-42d3-a456-426614174000', kind: 'task', title: 'Call client', position: '-1' }), { valid: false, error: 'Choose a valid work item position.' });
  assert.deepEqual(parseProjectWorkItem({ projectId: '123e4567-e89b-42d3-a456-426614174000', kind: 'task', title: 'Call client', completedAt: '2026-07-23T10:15' }), { valid: false, error: 'Choose a valid completion time.' });
});
