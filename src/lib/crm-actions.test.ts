import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLeadNote, parseLeadUpdate } from './crm-actions';

test('normalizes a complete lead workflow update', () => {
  const result = parseLeadUpdate({
    status: 'qualified',
    assignedTo: '  karim@example.com ',
    estimatedValue: '3500.50',
    nextFollowUp: '2026-07-25T08:30:00.000Z',
  });

  assert.deepEqual(result, {
    valid: true,
    value: {
      status: 'qualified',
      assigned_to: 'karim@example.com',
      estimated_value: 3500.5,
      next_follow_up: '2026-07-25T08:30:00.000Z',
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
    }),
    {
      valid: true,
      value: {
        status: 'contacted',
        assigned_to: null,
        estimated_value: null,
        next_follow_up: null,
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
