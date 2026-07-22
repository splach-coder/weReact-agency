'use client';

import { useState, useTransition } from 'react';
import { ArrowDownLeft, ArrowUpRight, Plus, ReceiptText } from 'lucide-react';
import { buildCashflowSeries, calculateAgencyMetrics, formatMad, type FinanceTransaction } from '@/lib/operations';
import { createFinanceTransactionAction } from '../operations-actions';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-MA', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function FinanceWorkspace({ transactions, projects }: { transactions: FinanceTransaction[]; projects: { id: string; project_name: string }[] }) {
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState('');
  const [isPending, startTransition] = useTransition();
  const metrics = calculateAgencyMetrics(transactions);
  const months = buildCashflowSeries(transactions);
  const maxValue = Math.max(1, ...months.flatMap((month) => [month.income, month.expenses]));

  function submit(formData: FormData) {
    setResult('');
    startTransition(async () => {
      const response = await createFinanceTransactionAction({ type: formData.get('type'), status: formData.get('status'), amount: formData.get('amount'), occurredOn: formData.get('occurredOn'), category: formData.get('category'), description: formData.get('description'), reference: formData.get('reference'), projectId: formData.get('projectId') });
      if (response.ok) { setResult('Transaction saved.'); setShowForm(false); }
      else setResult(response.error || 'Could not save the transaction.');
    });
  }

  return (
    <main className="ops-main">
      <header className="ops-page-header"><div><p>Company health</p><h1>Finance</h1></div><button type="button" className="ops-primary-button" onClick={() => setShowForm((value) => !value)}><Plus size={16} /> Add transaction</button></header>
      <section className="ops-kpis ops-kpis--finance">
        <article><span>Paid revenue</span><strong>{formatMad(metrics.revenue)}</strong><small>{formatMad(metrics.pendingIncome)} outstanding</small></article>
        <article><span>Paid expenses</span><strong>{formatMad(metrics.expenses)}</strong><small>Recorded operating costs</small></article>
        <article><span>Net result</span><strong className={metrics.net < 0 ? 'is-negative' : ''}>{formatMad(metrics.net)}</strong><small>{metrics.margin}% cash margin</small></article>
      </section>

      {showForm && <form action={submit} className="ops-panel ops-finance-form">
        <header><div><p>Ledger entry</p><h2>Add a transaction</h2></div><button type="button" onClick={() => setShowForm(false)}>Cancel</button></header>
        <div className="ops-form-grid">
          <label><span>Type</span><select name="type" required><option value="income">Income</option><option value="expense">Expense</option></select></label>
          <label><span>Status</span><select name="status" required><option value="paid">Paid</option><option value="pending">Pending</option></select></label>
          <label><span>Amount (MAD)</span><input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00" /></label>
          <label><span>Date</span><input name="occurredOn" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label>
          <label><span>Category</span><select name="category" required><option value="Website project">Website project</option><option value="SEO">SEO</option><option value="Maintenance">Maintenance</option><option value="Software">Software</option><option value="Advertising">Advertising</option><option value="Contractor">Contractor</option><option value="Operations">Operations</option><option value="Other">Other</option></select></label>
          <label><span>Project</span><select name="projectId"><option value="">No linked project</option>{projects.map((project) => <option value={project.id} key={project.id}>{project.project_name}</option>)}</select></label>
          <label className="is-wide"><span>Description</span><input name="description" required maxLength={180} placeholder="What was paid or purchased?" /></label>
          <label className="is-wide"><span>Reference</span><input name="reference" maxLength={80} placeholder="Invoice or receipt number (optional)" /></label>
        </div>
        <footer><button type="submit" className="ops-primary-button" disabled={isPending}><ReceiptText size={16} /> {isPending ? 'Saving...' : 'Save transaction'}</button></footer>
      </form>}
      {result && <p className={`ops-form-result${result === 'Transaction saved.' ? ' is-success' : ' is-error'}`} role="status">{result}</p>}

      <div className="ops-finance-grid">
        <section className="ops-panel ops-finance-chart"><header><div><p>Six months</p><h2>Income vs expenses</h2></div></header><div>{months.map((month) => <article key={month.key}><span>{month.label}</span><div><i style={{ width: `${month.income / maxValue * 100}%` }} /><i style={{ width: `${month.expenses / maxValue * 100}%` }} /></div><small>{formatMad(month.income)} / {formatMad(month.expenses)}</small></article>)}</div></section>
        <section className="ops-panel ops-ledger"><header><div><p>All entries</p><h2>Transaction ledger</h2></div><span>{transactions.length} entries</span></header><div>{transactions.map((item) => <article key={item.id}><span className={`ops-ledger-icon is-${item.type}`}>{item.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}</span><span><strong>{item.description}</strong><small>{item.category} - {formatDate(item.occurred_on)}{item.reference ? ` - ${item.reference}` : ''}</small>{item.source === 'project_close' && <em className="ops-ledger-source">Project payment</em>}</span><span><b>{item.type === 'income' ? '+' : '-'}{formatMad(item.amount)}</b><small className={`is-${item.status}`}>{item.status}</small></span></article>)}{!transactions.length && <div className="ops-panel-empty">No transactions yet.</div>}</div></section>
      </div>
    </main>
  );
}
