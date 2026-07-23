import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  getResendWebhookHeaders,
  parseResendWebhook,
  shouldAdvanceCommunicationState,
} from './resend-webhook';

test('requires every Svix signature header', () => {
  const result = getResendWebhookHeaders(new Headers({
    'svix-id': 'msg_123',
    'svix-timestamp': '1784786400',
  }));

  assert.deepEqual(result, {
    valid: false,
    error: 'Missing webhook signature headers.',
  });
});

test('normalizes a supported Resend delivery event', () => {
  const result = parseResendWebhook({
    type: 'email.delivered',
    created_at: '2026-07-23T10:00:00.000Z',
    data: {
      email_id: '4f31aa11-a177-47aa-83f3-0ab7ea16e622',
      from: 'WeReact <hello@wereact.agency>',
      to: ['client@example.com'],
      subject: 'Your project enquiry',
    },
  }, 'evt_123');

  assert.deepEqual(result, {
    valid: true,
    value: {
      provider: 'resend',
      providerEventId: 'evt_123',
      eventType: 'email.delivered',
      state: 'delivered',
      occurredAt: '2026-07-23T10:00:00.000Z',
      messageId: '4f31aa11-a177-47aa-83f3-0ab7ea16e622',
      from: 'WeReact <hello@wereact.agency>',
      to: 'client@example.com',
      subject: 'Your project enquiry',
      payload: {
        type: 'email.delivered',
        created_at: '2026-07-23T10:00:00.000Z',
        data: {
          email_id: '4f31aa11-a177-47aa-83f3-0ab7ea16e622',
          from: 'WeReact <hello@wereact.agency>',
          to: ['client@example.com'],
          subject: 'Your project enquiry',
        },
      },
    },
  });
});

test('rejects malformed supported events and safely ignores unrelated events', () => {
  assert.deepEqual(parseResendWebhook({
    type: 'email.delivered',
    created_at: 'not-a-date',
    data: { email_id: '' },
  }, 'evt_bad'), {
    valid: false,
    error: 'Malformed Resend webhook event.',
  });

  assert.deepEqual(parseResendWebhook({
    type: 'contact.updated',
    created_at: '2026-07-23T10:00:00.000Z',
    data: {},
  }, 'evt_contact'), {
    valid: true,
    value: null,
  });
});

test('keeps communication state monotonic while allowing terminal failures', () => {
  assert.equal(shouldAdvanceCommunicationState('sent', 'delivered'), true);
  assert.equal(shouldAdvanceCommunicationState('clicked', 'opened'), false);
  assert.equal(shouldAdvanceCommunicationState('delivered', 'bounced'), true);
  assert.equal(shouldAdvanceCommunicationState('bounced', 'opened'), false);
  assert.equal(shouldAdvanceCommunicationState('complained', 'failed'), false);
  assert.equal(shouldAdvanceCommunicationState('opened', 'opened'), false);
});
test('webhook route verifies the untouched body before processing provider data', () => {
  const route = readFileSync(
    new URL('../app/api/webhooks/resend/route.ts', import.meta.url),
    'utf8',
  );
  const rawBodyPosition = route.indexOf('request.text()');
  const verifyPosition = route.indexOf('.verify(rawBody');
  const parsePosition = route.indexOf('parseResendWebhook(');

  assert.ok(rawBodyPosition > -1);
  assert.ok(verifyPosition > rawBodyPosition);
  assert.ok(parsePosition > verifyPosition);
  assert.doesNotMatch(route, /request\.json\(\)/);
  assert.match(route, /RESEND_WEBHOOK_SECRET/);
  assert.match(route, /provider_event_id/);
  assert.match(route, /onConflict:\s*'provider,provider_event_id'/);
});