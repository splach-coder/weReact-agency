'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LoaderCircle, Mail, Printer } from 'lucide-react';
import { sendInvoiceEmailAction } from '../../operations-actions';

export function InvoicePrintActions({
  backHref,
  invoiceId,
  recipientEmail,
  invoiceStatus,
}: {
  backHref: string;
  invoiceId: string;
  recipientEmail: string;
  invoiceStatus: 'draft' | 'issued' | 'paid' | 'void';
}) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const canEmail = Boolean(recipientEmail) && ['issued', 'paid'].includes(invoiceStatus);

  async function emailInvoice() {
    if (!canEmail || sending) return;
    if (!window.confirm(`Email this invoice to ${recipientEmail}?`)) return;
    setSending(true);
    setResult(null);
    try {
      const response = await sendInvoiceEmailAction(invoiceId);
      setResult({
        ok: response.ok,
        message: response.ok ? `Invoice sent to ${recipientEmail}.` : response.error || 'Could not send the invoice.',
      });
    } catch {
      setResult({ ok: false, message: 'Could not send the invoice. Check your connection and try again.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <nav className="invoice-toolbar" aria-label="Invoice actions">
      <Link href={backHref}><ArrowLeft size={16} /> Back to project</Link>
      <div className="invoice-toolbar__actions">
        {result && <span className={result.ok ? 'is-success' : 'is-error'} role="status">{result.message}</span>}
        {canEmail && (
          <button type="button" onClick={emailInvoice} disabled={sending}>
            {sending ? <LoaderCircle className="invoice-email-spinner" size={16} /> : <Mail size={16} />}
            {sending ? 'Sending...' : 'Email invoice'}
          </button>
        )}
        <button type="button" onClick={() => window.print()}><Printer size={16} /> Print / Save as PDF</button>
      </div>
    </nav>
  );
}
