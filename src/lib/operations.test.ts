import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  buildCashflowSeries,
  calculateInvoiceTotals,
  calculateAgencyMetrics,
  parseFinanceEntry,
  parseInvoiceDraft,
  parseNewsletterCampaign,
  INVOICE_STATUSES,
  resolveInvoiceSnapshot,
  type FinanceTransaction,
} from './operations';

const transactions: FinanceTransaction[] = [
  { id: '1', created_at: '2026-07-01T00:00:00.000Z', occurred_on: '2026-07-02', type: 'income', status: 'paid', amount: 12000, category: 'Website project', description: 'Atlas deposit', reference: null, client_id: null, project_id: null, source: 'manual', created_by: 'owner@wereact.agency' },
  { id: '2', created_at: '2026-07-03T00:00:00.000Z', occurred_on: '2026-07-03', type: 'expense', status: 'paid', amount: 2500, category: 'Software', description: 'Subscriptions', reference: null, client_id: null, project_id: null, source: 'manual', created_by: 'owner@wereact.agency' },
  { id: '3', created_at: '2026-07-04T00:00:00.000Z', occurred_on: '2026-07-04', type: 'income', status: 'pending', amount: 4000, category: 'SEO', description: 'Monthly retainer', reference: null, client_id: null, project_id: null, source: 'manual', created_by: 'owner@wereact.agency' },
];

test('calculates paid company performance separately from pending income', () => {
  assert.deepEqual(calculateAgencyMetrics(transactions), { revenue: 12000, expenses: 2500, net: 9500, pendingIncome: 4000, margin: 79 });
});

test('builds a stable six-month cashflow series including empty months', () => {
  const series = buildCashflowSeries(transactions, new Date('2026-07-22T12:00:00.000Z'));
  assert.equal(series.length, 6);
  assert.deepEqual(series.at(-1), { key: '2026-07', label: 'Jul', income: 12000, expenses: 2500 });
  assert.deepEqual(series[0], { key: '2026-02', label: 'Feb', income: 0, expenses: 0 });
});

test('validates and normalizes a finance entry', () => {
  assert.deepEqual(parseFinanceEntry({ type: ' income ', status: 'paid', amount: '12,500.50', category: ' Website project ', description: ' Atlas final payment ', occurredOn: '2026-07-22', reference: ' INV-042 ', clientId: '', projectId: '' }), {
    valid: true,
    value: { type: 'income', status: 'paid', amount: 12500.5, category: 'Website project', description: 'Atlas final payment', occurred_on: '2026-07-22', reference: 'INV-042', client_id: null, project_id: null, source: 'manual' },
  });
});

test('rejects invalid money and newsletter campaigns without useful content', () => {
  assert.deepEqual(parseFinanceEntry({ type: 'expense', amount: '-4', occurredOn: 'bad' }), { valid: false, error: 'Enter an amount greater than zero.' });
  assert.deepEqual(parseNewsletterCampaign({ subject: '', preview: '', message: '' }), { valid: false, error: 'Add a subject for the campaign.' });
});

test('normalizes a focused newsletter campaign', () => {
  assert.deepEqual(parseNewsletterCampaign({ subject: '  Three ways to improve your website ', preview: ' Practical notes from WeReact. ', message: 'A useful opening.\n\nA second paragraph.' }), {
    valid: true,
    value: { subject: 'Three ways to improve your website', preview: 'Practical notes from WeReact.', message: 'A useful opening.\n\nA second paragraph.' },
  });
});
test('exposes automatic project-close revenue throughout Finance', () => {
  const operations = readFileSync(new URL('./operations.ts', import.meta.url), 'utf8');
  const workspace = readFileSync(new URL('../app/admin/finance/FinanceWorkspace.tsx', import.meta.url), 'utf8');
  const overviewPage = readFileSync(new URL('../app/admin/page.tsx', import.meta.url), 'utf8');
  const financePage = readFileSync(new URL('../app/admin/finance/page.tsx', import.meta.url), 'utf8');

  assert.match(operations, /export type FinanceSource = 'manual' \| 'project_close' \| 'adjustment'/);
  assert.match(operations, /source: FinanceSource/);
  assert.match(workspace, /Project payment/);
  assert.match(workspace, /item\.source === 'project_close'/);
  assert.match(overviewPage, /project_id,source,created_by/);
  assert.match(financePage, /project_id,source,created_by/);
});

test('normalizes an MAD invoice draft without trusting issued snapshots', () => {
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000',
    projectId: '123e4567-e89b-42d3-a456-426614174001',
    issuedOn: '2026-07-23',
    dueOn: '2026-08-06',
    notes: '  Payment is due within 14 days.  ',
    number: 'WR-2026-0001',
    sellerSnapshot: { name: 'Untrusted seller' },
    lines: [
      { description: '  Atlas Riad website  ', quantity: '3', unitPrice: '333.33' },
      { description: 'Domain migration', quantity: 1, unitPrice: 0.01 },
    ],
  }), {
    valid: true,
    value: {
      client_id: '123e4567-e89b-42d3-a456-426614174000',
      project_id: '123e4567-e89b-42d3-a456-426614174001',
      issued_on: '2026-07-23',
      due_on: '2026-08-06',
      currency: 'MAD',
      notes: 'Payment is due within 14 days.',
      lines: [
        { description: 'Atlas Riad website', quantity: 3, unit_price: 333.33, position: 0 },
        { description: 'Domain migration', quantity: 1, unit_price: 0.01, position: 1 },
      ],
    },
  });
});

test('calculates invoice totals as two-decimal MAD amounts', () => {
  assert.deepEqual(calculateInvoiceTotals([
    { description: 'Website', quantity: 3, unit_price: 333.33, position: 0 },
    { description: 'Migration', quantity: 1, unit_price: 0.01, position: 1 },
  ]), { subtotal: 1000, total: 1000 });
});

test('bounds extreme invoice quantities before totals can overflow', () => {
  const draft = parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000',
    projectId: '123e4567-e89b-42d3-a456-426614174001',
    issuedOn: '2026-07-23',
    dueOn: '2026-08-06',
    lines: [{ description: 'Website', quantity: 1e308, unitPrice: 1 }],
  });
  assert.deepEqual(draft, { valid: false, error: 'Invoice line quantities cannot exceed 1,000,000.' });

  const totals = calculateInvoiceTotals([{ quantity: 1e308, unit_price: 1 }]);
  assert.deepEqual(totals, { subtotal: 1000000, total: 1000000 });
  assert.ok(Number.isFinite(totals.subtotal));
  assert.ok(Number.isFinite(totals.total));
});

test('rejects incomplete invoices and invalid line amounts', () => {
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: '2026-07-23', dueOn: '2026-08-06', lines: [],
  }), { valid: false, error: 'Add at least one invoice line.' });
  assert.deepEqual(parseInvoiceDraft({
    clientId: 'bad-client', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: '2026-07-23', dueOn: '2026-08-06', lines: [{ description: 'Website', quantity: 1, unitPrice: 1 }],
  }), { valid: false, error: 'Invalid client reference.' });
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: 'bad-date', dueOn: '2026-08-06', lines: [{ description: 'Website', quantity: 1, unitPrice: 1 }],
  }), { valid: false, error: 'Choose a valid issue date.' });
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: ' 2026-07-23junk ', dueOn: '2026-08-06', lines: [{ description: 'Website', quantity: 1, unitPrice: 1 }],
  }), { valid: false, error: 'Choose a valid issue date.' });
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: '2026-07-23', dueOn: '2026-07-22', lines: [{ description: 'Website', quantity: 1, unitPrice: 1 }],
  }), { valid: false, error: 'Choose a due date on or after the issue date.' });
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: '2026-07-23', dueOn: ' 2026-08-06junk ', lines: [{ description: 'Website', quantity: 1, unitPrice: 1 }],
  }), { valid: false, error: 'Choose a valid due date.' });
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: '2026-07-23', dueOn: '2026-08-06', lines: [{ description: '   ', quantity: 1, unitPrice: 1 }],
  }), { valid: false, error: 'Add a description for every invoice line.' });
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: '2026-07-23', dueOn: '2026-08-06', lines: [{ description: 'Website', quantity: 0, unitPrice: 1 }],
  }), { valid: false, error: 'Invoice line quantities must be greater than zero.' });
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: '2026-07-23', dueOn: '2026-08-06', lines: [{ description: 'Website', quantity: 1, unitPrice: -1 }],
  }), { valid: false, error: 'Invoice line prices cannot be negative.' });
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: '2026-07-23', dueOn: '2026-08-06', lines: [{ description: 'Website', quantity: 1, unitPrice: '1.005' }],
  }), { valid: false, error: 'Invoice line prices must use at most two decimal places.' });
  assert.deepEqual(parseInvoiceDraft({
    clientId: '123e4567-e89b-42d3-a456-426614174000', projectId: '123e4567-e89b-42d3-a456-426614174001', issuedOn: '2026-07-23', dueOn: '2026-08-06', lines: [{ description: 'Website', quantity: 1, unitPrice: 1.005 }],
  }), { valid: false, error: 'Invoice line prices must use at most two decimal places.' });
});

test('exposes the four immutable invoice statuses', () => {
  assert.deepEqual(INVOICE_STATUSES, ['draft', 'issued', 'paid', 'void']);
});

test('keeps issued invoice snapshots immutable when later client data changes', () => {
  assert.deepEqual(
    resolveInvoiceSnapshot(
      { name: 'Atlas Riad', company: '', email: null, phone: '' },
      { name: 'Updated client', company: 'New company', email: 'new@example.com', phone: '+212600000000' },
    ),
    { name: 'Atlas Riad', company: '', email: '', phone: '' },
  );
  assert.deepEqual(
    resolveInvoiceSnapshot(null, { name: 'Draft client', company: '', email: '', phone: '' }),
    { name: 'Draft client', company: '', email: '', phone: '' },
  );
});
