import assert from 'node:assert/strict';
import test from 'node:test';
import { validateSubscriberEmail } from './newsletter';

test('accepts a valid newsletter email address', () => {
  assert.deepEqual(validateSubscriberEmail('hello@wereact.agency'), { valid: true });
});

test('rejects an invalid newsletter email address', () => {
  assert.deepEqual(validateSubscriberEmail('not-an-email'), {
    valid: false,
    message: 'Please enter a valid email address.',
  });
});
