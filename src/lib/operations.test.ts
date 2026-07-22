import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  buildCashflowSeries,
  calculateAgencyMetrics,
  parseFinanceEntry,
  parseNewsletterCampaign,
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
