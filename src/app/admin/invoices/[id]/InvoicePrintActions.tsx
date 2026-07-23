'use client';

import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';

export function InvoicePrintActions({ backHref }: { backHref: string }) {
  return (
    <nav className="invoice-toolbar" aria-label="Invoice actions">
      <Link href={backHref}><ArrowLeft size={16} /> Back to project</Link>
      <button type="button" onClick={() => window.print()}><Printer size={16} /> Print / Save as PDF</button>
    </nav>
  );
}
