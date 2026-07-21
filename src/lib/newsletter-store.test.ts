import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSubscriberRecord } from './newsletter-store';

test('builds a normalized subscribed newsletter record', () => {
  const now = '2026-07-21T10:30:00.000Z';

  assert.deepEqual(buildSubscriberRecord(' Test@Example.com ', 'fr', 'footer', now), {
    email: 'test@example.com',
    locale: 'fr',
    source: 'footer',
    status: 'subscribed',
    consented_at: now,
  });
});

test('limits locale and source values to stable CRM data', () => {
  assert.deepEqual(
    buildSubscriberRecord('hello@example.com', 'ar-MA', '', '2026-07-21T10:30:00.000Z'),
    {
      email: 'hello@example.com',
      locale: 'en',
      source: 'website',
      status: 'subscribed',
      consented_at: '2026-07-21T10:30:00.000Z',
    },
  );
});