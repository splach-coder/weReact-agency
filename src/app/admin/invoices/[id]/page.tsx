import { notFound } from 'next/navigation';
import { requireAdminMember } from '@/lib/admin-auth';
import { siteConfig } from '@/config/site';
import { resolveInvoiceSnapshot, type Invoice, type InvoiceLine } from '@/lib/operations';
import { InvoicePrintActions } from './InvoicePrintActions';

export const dynamic = 'force-dynamic';

type ProjectRecord = {
  id: string;
  client_id: string;
  originating_lead_id: string | null;
  project_name: string;
  project_type: string;
  domain_name: string;
};

type ClientRecord = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
};

function money(value: number) {
  return new Intl.NumberFormat('en-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
  }).format(Number(value));
}

function readableDate(value: string | null) {
  if (!value) return 'Not set';
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-MA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdminMember();
  const { data: rawInvoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('id,project_id,client_id,finance_transaction_id,number,status,issued_on,due_on,paid_on,currency,subtotal,total,notes,seller_snapshot,customer_snapshot,created_by,created_at,updated_at')
    .eq('id', id)
    .maybeSingle();

  if (!rawInvoice && !invoiceError) notFound();
  if (invoiceError || !rawInvoice) {
    console.error('Invoice document query failed.', invoiceError);
    notFound();
  }

  const invoice = rawInvoice as Invoice;
  const [linesResult, projectResult, clientResult] = await Promise.all([
    supabase
      .from('invoice_lines')
      .select('id,invoice_id,description,quantity,unit_price,line_total,position')
      .eq('invoice_id', invoice.id)
      .order('position', { ascending: true }),
    supabase
      .from('crm_projects')
      .select('id,client_id,originating_lead_id,project_name,project_type,domain_name')
      .eq('id', invoice.project_id)
      .maybeSingle(),
    supabase
      .from('clients')
      .select('id,name,company,email,phone,whatsapp')
      .eq('id', invoice.client_id)
      .maybeSingle(),
  ]);

  if (linesResult.error || projectResult.error || clientResult.error) {
    console.error('Invoice document details failed.', {
      lines: linesResult.error,
      project: projectResult.error,
      client: clientResult.error,
    });
  }

  const lines = (linesResult.data ?? []) as InvoiceLine[];
  const project = projectResult.data as ProjectRecord | null;
  const client = clientResult.data as ClientRecord | null;
  const seller = resolveInvoiceSnapshot(invoice.seller_snapshot, {
    name: siteConfig.business.legalName,
    email: siteConfig.business.email,
    phone: siteConfig.business.phoneDisplay,
    address: siteConfig.business.addressDisplay,
    website: siteConfig.url,
  });
  const customer = resolveInvoiceSnapshot(invoice.customer_snapshot, {
    name: client?.name ?? 'Client',
    company: client?.company ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
  });
  const backHref = project?.originating_lead_id
    ? `/admin/leads/${project.originating_lead_id}?project=${invoice.project_id}`
    : '/admin/pipeline';
  const amountDue = invoice.status === 'paid' || invoice.status === 'void' ? 0 : Number(invoice.total);
  const displayNumber = invoice.number ?? 'WR-DRAFT';

  return (
    <main className="invoice-page">
      <InvoicePrintActions
        backHref={backHref}
        invoiceId={invoice.id}
        recipientEmail={client?.email?.trim() || customer.email}
        invoiceStatus={invoice.status}
      />
      <article className="invoice-document">
        <header className="invoice-document__header">
          <div className="invoice-brand">
            <strong>WeReact agency</strong>
            <span>Web design and digital experiences</span>
          </div>
          <div className="invoice-title">
            <span>Invoice</span>
            <h1>{displayNumber}</h1>
            <strong className={`invoice-status invoice-status--${invoice.status}`}>{invoice.status}</strong>
          </div>
        </header>

        <section className="invoice-parties">
          <div>
            <span>From</span>
            <strong>{seller.name}</strong>
            <p>{seller.address}</p>
            <p>{seller.email}</p>
            <p>{seller.phone}</p>
            <p>{seller.website.replace(/^https?:\/\//, '')}</p>
          </div>
          <div>
            <span>Invoice to</span>
            <strong>{customer.name}</strong>
            {customer.company && <p>{customer.company}</p>}
            {customer.email && <p>{customer.email}</p>}
            {customer.phone && <p>{customer.phone}</p>}
          </div>
          <dl>
            <div><dt>Issue date</dt><dd>{readableDate(invoice.issued_on)}</dd></div>
            <div><dt>Due date</dt><dd>{readableDate(invoice.due_on)}</dd></div>
            {invoice.paid_on && <div><dt>Paid date</dt><dd>{readableDate(invoice.paid_on)}</dd></div>}
            <div><dt>Currency</dt><dd>MAD</dd></div>
          </dl>
        </section>

        <section className="invoice-project">
          <span>Project</span>
          <strong>{project?.project_name ?? 'Website project'}</strong>
          <p>{project?.project_type ?? 'Digital service'}{project?.domain_name ? ` / ${project.domain_name}` : ''}</p>
        </section>

        <div className="invoice-table-wrap">
          <table className="invoice-table">
            <thead><tr><th>Service</th><th>Qty</th><th>Unit price</th><th>Total</th></tr></thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id}>
                  <td>{line.description}</td>
                  <td>{Number(line.quantity).toFixed(2)}</td>
                  <td>{money(Number(line.unit_price))}</td>
                  <td>{money(Number(line.line_total))}</td>
                </tr>
              ))}
              {lines.length === 0 && <tr><td colSpan={4}>No service lines recorded.</td></tr>}
            </tbody>
          </table>
        </div>

        <section className="invoice-totals">
          <div>
            {invoice.notes && <><span>Notes</span><p>{invoice.notes}</p></>}
          </div>
          <dl>
            <div><dt>Subtotal</dt><dd>{money(Number(invoice.subtotal))}</dd></div>
            <div><dt>Total</dt><dd>{money(Number(invoice.total))}</dd></div>
            <div className="invoice-amount-due"><dt>Amount due</dt><dd>{money(amountDue)}</dd></div>
          </dl>
        </section>

        <footer>
          <p>Thank you for working with WeReact agency.</p>
          <span>{displayNumber} / {invoice.status.toUpperCase()}</span>
        </footer>
      </article>
    </main>
  );
}
