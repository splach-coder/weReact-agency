import assert from 'node:assert/strict';
import test from 'node:test';
import { buildInvoiceEmail } from './invoice-email';

test('builds a complete branded invoice email with escaped client data', () => {
  const email = buildInvoiceEmail({
    invoiceNumber: 'WR-2026-0001',
    clientName: 'Atlas <Riad>',
    projectName: 'Booking website',
    issuedOn: '2026-07-23',
    dueOn: '2026-08-06',
    status: 'issued',
    total: 2000,
    notes: 'Reply for payment details.',
    lines: [{ description: '<script>alert(1)</script>', quantity: 1, unitPrice: 2000, total: 2000 }],
  });

  assert.equal(email.subject, 'Invoice WR-2026-0001 from WeReact agency');
  assert.match(email.html, /&middot;wereact&middot;/);
  assert.match(email.html, /Atlas &lt;Riad&gt;/);
  assert.match(email.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(email.html, /MAD/);
  assert.match(email.html, /2[,.\s]000/);
  assert.doesNotMatch(email.html, /<script>alert/);
});

test('marks paid invoice emails clearly', () => {
  const email = buildInvoiceEmail({
    invoiceNumber: 'WR-2026-0002',
    clientName: 'Client',
    projectName: 'Website',
    issuedOn: '2026-07-23',
    dueOn: '2026-07-23',
    status: 'paid',
    total: 5000,
    notes: '',
    lines: [{ description: 'Website delivery', quantity: 1, unitPrice: 5000, total: 5000 }],
  });

  assert.match(email.html, /marked as paid/);
});
