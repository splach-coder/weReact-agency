'use client';

import Link from 'next/link';
import {
  CircleAlert,
  CircleCheckBig,
  ExternalLink,
  FilePlus2,
  Plus,
  ReceiptText,
  Save,
  Send,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useMemo, useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  createInvoiceDraftAction,
  issueInvoiceAction,
  updateInvoiceDraftAction,
  voidInvoiceAction,
} from '../../operations-actions';
import type { CrmLead, CrmProject } from '@/lib/crm';
import { calculateInvoiceTotals, type Invoice, type InvoiceLine } from '@/lib/operations';

type EditableLine = {
  key: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

type InvoiceWorkspaceProps = {
  leadId: string;
  lead: CrmLead;
  project: CrmProject;
  invoices: Invoice[];
  invoiceLines: InvoiceLine[];
};

const STATUS_LABELS: Record<Invoice['status'], string> = {
  draft: 'Draft',
  issued: 'Issued',
  paid: 'Paid',
  void: 'Void',
};

function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function dateAfter(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return isoDate(date);
}

function money(value: number) {
  return new Intl.NumberFormat('en-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function initialLines(invoice: Invoice | null, lines: InvoiceLine[], project: CrmProject): EditableLine[] {
  if (invoice) {
    const related = lines
      .filter((line) => line.invoice_id === invoice.id)
      .sort((a, b) => a.position - b.position)
      .map((line) => ({
        key: line.id,
        description: line.description,
        quantity: String(line.quantity),
        unitPrice: String(line.unit_price),
      }));
    if (related.length) return related;
  }

  return [{
    key: 'initial',
    description: `${project.project_name || 'Website'} project`,
    quantity: '1',
    unitPrice: project.budget == null ? '' : String(project.budget),
  }];
}

export function InvoiceWorkspace({
  leadId,
  lead,
  project,
  invoices,
  invoiceLines,
}: InvoiceWorkspaceProps) {
  const router = useRouter();
  const invoice = invoices.find((item) => item.project_id === project.id) ?? null;
  const [lines, setLines] = useState<EditableLine[]>(() => initialLines(invoice, invoiceLines, project));
  const [dueOn, setDueOn] = useState(invoice?.due_on ?? dateAfter(14));
  const [notes, setNotes] = useState(invoice?.notes ?? 'Thank you for choosing WeReact agency.');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [saving, startSaving] = useTransition();

  const totals = useMemo(() => calculateInvoiceTotals(lines.map((line) => ({
    quantity: Number(line.quantity),
    unit_price: Number(line.unitPrice),
  }))), [lines]);

  function showResult(ok: boolean, text: string) {
    setIsError(!ok);
    setMessage(text);
  }

  function payload() {
    return {
      clientId: project.client_id,
      projectId: project.id,
      issuedOn: invoice?.issued_on ?? isoDate(),
      dueOn,
      currency: 'MAD',
      notes,
      lines: lines.map((line, position) => ({
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        position,
      })),
    };
  }

  function updateLine(key: string, field: keyof Omit<EditableLine, 'key'>, value: string) {
    setLines((current) => current.map((line) => (
      line.key === key ? { ...line, [field]: value } : line
    )));
  }

  function addLine() {
    setLines((current) => [...current, {
      key: `new-${Date.now()}-${current.length}`,
      description: '',
      quantity: '1',
      unitPrice: '0',
    }]);
  }

  function removeLine(key: string) {
    setLines((current) => current.length === 1 ? current : current.filter((line) => line.key !== key));
  }

  function createDraft() {
    setMessage('');
    startSaving(async () => {
      const result = await createInvoiceDraftAction(leadId, payload());
      showResult(result.ok, result.ok ? 'Invoice draft created.' : (result.error ?? 'Could not create the invoice draft.'));
      if (result.ok) router.refresh();
    });
  }

  function saveDraft(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!invoice || invoice.status !== 'draft') return;
    setMessage('');
    startSaving(async () => {
      const result = await updateInvoiceDraftAction(leadId, invoice.id, payload());
      showResult(result.ok, result.ok ? 'Invoice draft saved.' : (result.error ?? 'Could not save the invoice draft.'));
      if (result.ok) router.refresh();
    });
  }

  function issueInvoice() {
    if (!invoice || invoice.status !== 'draft') return;
    if (!window.confirm('Issue this invoice now? Its number, client details, and amounts will become locked.')) return;
    setMessage('');
    startSaving(async () => {
      const saved = await updateInvoiceDraftAction(leadId, invoice.id, payload());
      if (!saved.ok) {
        showResult(false, saved.error ?? 'Save the invoice before issuing it.');
        return;
      }
      const result = await issueInvoiceAction(leadId, invoice.id);
      showResult(result.ok, result.ok ? 'Invoice issued and locked.' : (result.error ?? 'Could not issue the invoice.'));
      if (result.ok) router.refresh();
    });
  }

  function voidInvoice() {
    if (!invoice || invoice.status !== 'issued') return;
    if (!window.confirm('Void this issued invoice? Its number will remain in the record.')) return;
    setMessage('');
    startSaving(async () => {
      const result = await voidInvoiceAction(leadId, invoice.id);
      showResult(result.ok, result.ok ? 'Invoice voided.' : (result.error ?? 'Could not void the invoice.'));
      if (result.ok) router.refresh();
    });
  }

  if (!invoice) {
    const amountReady = project.budget != null && Number(project.budget) > 0;
    return (
      <section className="crm-invoice-empty">
        <div className="crm-invoice-empty__icon"><ReceiptText size={24} /></div>
        <div>
          <span>Project invoice</span>
          <h3>Create the invoice when the price is agreed</h3>
          <p>Client and project details are filled automatically. You can adjust services and prices before issuing.</p>
          <dl>
            <div><dt>Client</dt><dd>{lead.name}{lead.company ? ` / ${lead.company}` : ''}</dd></div>
            <div><dt>Confirmed amount</dt><dd>{amountReady ? money(Number(project.budget)) : 'Add the agreed amount in Brief'}</dd></div>
          </dl>
        </div>
        <button type="button" className="crm-primary-button" disabled={saving || !amountReady} onClick={createDraft}>
          <FilePlus2 size={16} />{saving ? 'Creating...' : 'Create invoice draft'}
        </button>
        {!amountReady && <p className="crm-invoice-warning"><CircleAlert size={15} />A confirmed project amount is required.</p>}
        {message && <p className={`crm-form-message ${isError ? 'is-error' : ''}`} role="status">{message}</p>}
      </section>
    );
  }

  if (invoice.status !== 'draft') {
    return (
      <section className="crm-invoice-readonly">
        <header>
          <div>
            <span>Project invoice</span>
            <h3>{invoice.number ?? 'Invoice pending number'}</h3>
          </div>
          <strong className={`crm-invoice-status is-${invoice.status}`}>{STATUS_LABELS[invoice.status]}</strong>
        </header>
        <div className="crm-invoice-summary">
          <div><span>Total</span><strong>{money(Number(invoice.total))}</strong></div>
          <div><span>Issued</span><strong>{invoice.issued_on ?? 'Not issued'}</strong></div>
          <div><span>{invoice.status === 'paid' ? 'Paid' : 'Due'}</span><strong>{invoice.paid_on ?? invoice.due_on ?? 'Not set'}</strong></div>
        </div>
        <p className={`crm-invoice-state-copy is-${invoice.status}`}>
          {invoice.status === 'paid' && <CircleCheckBig size={17} />}
          {invoice.status === 'void' && <XCircle size={17} />}
          {invoice.status === 'issued' && <Send size={17} />}
          {invoice.status === 'paid'
            ? 'Payment is linked to Finance and this document is locked.'
            : invoice.status === 'void'
              ? 'This number is preserved for the audit trail and cannot be reused.'
              : 'This invoice is issued and locked. Marking the project complete will link its paid revenue automatically.'}
        </p>
        <div className="crm-invoice-actions">
          <Link className="crm-primary-button" href={`/admin/invoices/${invoice.id}`}>
            <ExternalLink size={15} /> Open printable invoice
          </Link>
          {invoice.status === 'issued' && (
            <button type="button" className="crm-secondary-button is-danger" disabled={saving} onClick={voidInvoice}>
              <XCircle size={15} /> Void invoice
            </button>
          )}
        </div>
        {message && <p className={`crm-form-message ${isError ? 'is-error' : ''}`} role="status">{message}</p>}
      </section>
    );
  }

  return (
    <form className="crm-invoice-editor" onSubmit={saveDraft}>
      <header>
        <div>
          <span>Invoice draft</span>
          <h3>{project.project_name}</h3>
          <p>Review the service lines before issuing. Issued details cannot be edited.</p>
        </div>
        <strong className="crm-invoice-status is-draft">Draft</strong>
      </header>

      <div className="crm-invoice-meta">
        <label className="crm-field">
          <span>Client</span>
          <input value={lead.name} readOnly />
        </label>
        <label className="crm-field">
          <span>Issue date</span>
          <input value={isoDate()} readOnly />
        </label>
        <label className="crm-field">
          <span>Due date *</span>
          <input type="date" required value={dueOn} onChange={(event) => setDueOn(event.target.value)} />
        </label>
      </div>

      <div className="crm-invoice-lines">
        <header>
          <span>Service lines</span>
          <button type="button" className="crm-text-button" onClick={addLine}><Plus size={14} /> Add line</button>
        </header>
        {lines.map((line, index) => (
          <div className="crm-invoice-line" key={line.key}>
            <label className="crm-field crm-invoice-line__description">
              <span>Description *</span>
              <input required maxLength={500} value={line.description} onChange={(event) => updateLine(line.key, 'description', event.target.value)} />
            </label>
            <label className="crm-field">
              <span>Quantity *</span>
              <input type="number" min="0.01" max="1000000" step="0.01" required value={line.quantity} onChange={(event) => updateLine(line.key, 'quantity', event.target.value)} />
            </label>
            <label className="crm-field">
              <span>Unit price (MAD) *</span>
              <input type="number" min="0" step="0.01" required value={line.unitPrice} onChange={(event) => updateLine(line.key, 'unitPrice', event.target.value)} />
            </label>
            <div className="crm-invoice-line__total"><span>Line total</span><strong>{money(Number(line.quantity) * Number(line.unitPrice))}</strong></div>
            <button type="button" className="crm-work-icon-button is-danger" disabled={lines.length === 1} onClick={() => removeLine(line.key)} aria-label={`Remove invoice line ${index + 1}`} title="Remove line">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="crm-invoice-bottom">
        <label className="crm-field">
          <span>Notes</span>
          <textarea maxLength={2000} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
        <dl>
          <div><dt>Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
          <div><dt>Total</dt><dd>{money(totals.total)}</dd></div>
        </dl>
      </div>

      <footer>
        <Link className="crm-secondary-button" href={`/admin/invoices/${invoice.id}`}>
          <ExternalLink size={15} /> Open printable invoice
        </Link>
        <div>
          <button type="submit" className="crm-secondary-button" disabled={saving}><Save size={15} /> Save draft</button>
          <button type="button" className="crm-primary-button" disabled={saving || totals.total <= 0} onClick={issueInvoice}><Send size={15} /> Issue invoice</button>
        </div>
      </footer>
      {message && <p className={`crm-form-message ${isError ? 'is-error' : ''}`} role="status">{message}</p>}
    </form>
  );
}
