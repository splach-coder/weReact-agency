import assert from 'node:assert/strict';
import test from 'node:test';
import { runScheduledAutomation } from './automation-scheduler';

test('scheduled automation calls the protected processor endpoint', async () => {
  const receivedRequests: Request[] = [];

  await runScheduledAutomation(
    {
      AUTOMATION_INTERNAL_SECRET: 'secret-value',
    },
    async (request) => {
      receivedRequests.push(request);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    },
  );

  assert.equal(receivedRequests.length, 1);
  const receivedRequest = receivedRequests[0];
  assert.equal(receivedRequest.method, 'POST');
  assert.equal(
    receivedRequest.headers.get('authorization'),
    'Bearer secret-value',
  );
  assert.equal(
    receivedRequest.url,
    'https://www.wereact.agency/api/internal/automation',
  );
});

test('scheduled automation fails when the secret is missing', async () => {
  await assert.rejects(
    runScheduledAutomation(
      { AUTOMATION_INTERNAL_SECRET: '' },
      async () => new Response(null, { status: 200 }),
    ),
    /AUTOMATION_INTERNAL_SECRET/,
  );
});

test('scheduled automation surfaces processor failures', async () => {
  await assert.rejects(
    runScheduledAutomation(
      { AUTOMATION_INTERNAL_SECRET: 'secret-value' },
      async () => new Response(null, { status: 503 }),
    ),
    /503/,
  );
});