import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('contact delivery captures Resend ids and records both outbound messages', () => {
  const route = readFileSync(
    new URL('../app/api/contact/route.ts', import.meta.url),
    'utf8',
  );

  assert.match(route, /sendResendEmail/);
  assert.match(route, /recordOutboundCommunication/);
  assert.match(route, /providerMessageId/);
  assert.match(route, /leadResult\.id/);
  assert.match(route, /body_summary: 'New website enquiry notification'/);
  assert.match(route, /body_summary: 'Website enquiry confirmation'/);
});

test('invoice and newsletter sends create linked communication records', () => {
  const actions = readFileSync(
    new URL('../app/admin/operations-actions.ts', import.meta.url),
    'utf8',
  );

  assert.match(actions, /sendResendEmail/);
  assert.match(actions, /recordOutboundCommunication/);
  assert.match(actions, /invoice_id: invoiceId/);
  assert.match(actions, /client_id: rawInvoice\.client_id/);
  assert.match(actions, /project_id: rawInvoice\.project_id/);
  assert.match(actions, /lead_id: projectResult\.data\?\.originating_lead_id/);
  assert.match(actions, /body_summary: parsed\.value\.preview/);
});

test('shared Resend sender returns a provider message id only on acceptance', () => {
  const sender = readFileSync(new URL('./resend.ts', import.meta.url), 'utf8');

  assert.match(sender, /response\.json\(\)/);
  assert.match(sender, /providerMessageId/);
  assert.match(sender, /response\.ok/);
  assert.match(sender, /AbortSignal\.timeout/);
});
