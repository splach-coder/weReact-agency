export const FINANCE_TYPES = ['income', 'expense'] as const;
export const FINANCE_STATUSES = ['pending', 'paid'] as const;

export const MAX_INVOICE_QUANTITY = 1_000_000;
export const MAX_INVOICE_TOTAL = 99_999_999_999.99;
const MAX_INVOICE_TOTAL_CENTS = 9_999_999_999_999;

export type FinanceType = (typeof FINANCE_TYPES)[number];
export type FinanceStatus = (typeof FINANCE_STATUSES)[number];
export type FinanceSource = 'manual' | 'project_close' | 'adjustment';

export const INVOICE_STATUSES = ['draft', 'issued', 'paid', 'void'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export function resolveInvoiceSnapshot(
  snapshot: Record<string, unknown> | null,
  fallbacks: Record<string, string>,
) {
  if (!snapshot) return fallbacks;

  return Object.fromEntries(
    Object.keys(fallbacks).map((key) => [
      key,
      typeof snapshot[key] === 'string' ? snapshot[key] : '',
    ]),
  );
}

export type Invoice = {
  id: string;
  project_id: string;
  client_id: string;
  finance_transaction_id: string | null;
  number: string | null;
  status: InvoiceStatus;
  issued_on: string | null;
  due_on: string | null;
  paid_on: string | null;
  currency: 'MAD';
  subtotal: number;
  total: number;
  notes: string;
  seller_snapshot: Record<string, unknown> | null;
  customer_snapshot: Record<string, unknown> | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type InvoiceLine = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  position: number;
};

export type InvoiceDraft = {
  client_id: string;
  project_id: string;
  issued_on: string;
  due_on: string;
  currency: 'MAD';
  notes: string;
  lines: Array<Pick<InvoiceLine, 'description' | 'quantity' | 'unit_price' | 'position'>>;
};

export type FinanceTransaction = {
  id: string;
  created_at: string;
  occurred_on: string;
  type: FinanceType;
  status: FinanceStatus;
  amount: number;
  category: string;
  description: string;
  reference: string | null;
  client_id: string | null;
  project_id: string | null;
  source: FinanceSource;
  created_by: string;
};

export type NewsletterSubscriber = {
  email: string;
  status: 'subscribed' | 'unsubscribed';
  locale: string;
  source: string;
  consented_at: string;
  created_at: string;
  updated_at: string;
  unsubscribe_token: string;
};

export type NewsletterCampaign = {
  id: string;
  created_at: string;
  sent_at: string | null;
  created_by: string;
  subject: string;
  preview_text: string;
  content: string;
  audience_count: number;
  sent_count: number;
  failed_count: number;
  status: 'draft' | 'sending' | 'sent' | 'partial' | 'failed';
};

type Valid<T> = { valid: true; value: T };
type Invalid = { valid: false; error: string };

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function nullableUuid(value: unknown) {
  const clean = text(value, 36);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clean)
    ? clean
    : null;
}

export function parseFinanceEntry(input: unknown): Valid<Omit<FinanceTransaction, 'id' | 'created_at' | 'created_by'>> | Invalid {
  if (!input || typeof input !== 'object') return { valid: false, error: 'Complete the transaction details.' };
  const value = input as Record<string, unknown>;
  const type = text(value.type, 16);
  const status = text(value.status, 16) || 'paid';
  const amount = Number(text(value.amount, 32).replace(/,/g, ''));
  const occurredOn = text(value.occurredOn, 10);
  const category = text(value.category, 80);
  const description = text(value.description, 180);

  if (!Number.isFinite(amount) || amount <= 0) return { valid: false, error: 'Enter an amount greater than zero.' };
  if (!FINANCE_TYPES.includes(type as FinanceType)) return { valid: false, error: 'Choose income or expense.' };
  if (!FINANCE_STATUSES.includes(status as FinanceStatus)) return { valid: false, error: 'Choose a valid payment status.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(occurredOn) || Number.isNaN(new Date(`${occurredOn}T00:00:00Z`).getTime())) {
    return { valid: false, error: 'Choose a valid transaction date.' };
  }
  if (!category) return { valid: false, error: 'Add a category.' };
  if (!description) return { valid: false, error: 'Describe the transaction.' };

  return {
    valid: true,
    value: {
      type: type as FinanceType,
      status: status as FinanceStatus,
      amount: Math.round(amount * 100) / 100,
      category,
      description,
      occurred_on: occurredOn,
      reference: text(value.reference, 80) || null,
      client_id: nullableUuid(value.clientId),
      project_id: nullableUuid(value.projectId),
      source: 'manual',
    },
  };
}

export function parseNewsletterCampaign(input: unknown): Valid<{ subject: string; preview: string; message: string }> | Invalid {
  if (!input || typeof input !== 'object') return { valid: false, error: 'Complete the campaign.' };
  const value = input as Record<string, unknown>;
  const subject = text(value.subject, 120);
  const preview = text(value.preview, 180);
  const message = text(value.message, 12000);
  if (!subject) return { valid: false, error: 'Add a subject for the campaign.' };
  if (!preview) return { valid: false, error: 'Add preview text for inboxes.' };
  if (message.length < 20) return { valid: false, error: 'Write a useful message before sending.' };
  return { valid: true, value: { subject, preview, message } };
}

export function calculateAgencyMetrics(transactions: FinanceTransaction[]) {
  const revenue = transactions
    .filter((item) => item.type === 'income' && item.status === 'paid')
    .reduce((total, item) => total + Number(item.amount), 0);
  const expenses = transactions
    .filter((item) => item.type === 'expense' && item.status === 'paid')
    .reduce((total, item) => total + Number(item.amount), 0);
  const pendingIncome = transactions
    .filter((item) => item.type === 'income' && item.status === 'pending')
    .reduce((total, item) => total + Number(item.amount), 0);
  const net = revenue - expenses;
  return {
    revenue,
    expenses,
    net,
    pendingIncome,
    margin: revenue > 0 ? Math.round((net / revenue) * 100) : 0,
  };
}

export function buildCashflowSeries(transactions: FinanceTransaction[], now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' });
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1));
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
    const inMonth = transactions.filter((item) => item.status === 'paid' && item.occurred_on.startsWith(key));
    return {
      key,
      label: formatter.format(date),
      income: inMonth.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0),
      expenses: inMonth.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0),
    };
  });
}

export function formatMad(value: number) {
  return `${new Intl.NumberFormat('en-MA', { maximumFractionDigits: 0 }).format(value)} MAD`;
}

function isInvoiceDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function hasAtMostTwoFractionalDigits(value: unknown) {
  const normalized = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim().replace(/,/g, '') : '';
  return /^\d+(?:\.\d{1,2})?$/.test(normalized);
}

function invoiceNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return Number.NaN;
  return Number(value.trim().replace(/,/g, ''));
}

function invoiceLineCents(quantity: number, unitPrice: number) {
  if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) return 0;

  const boundedQuantity = Math.min(quantity, MAX_INVOICE_QUANTITY);
  const boundedUnitPrice = Math.min(unitPrice, MAX_INVOICE_TOTAL);
  if (boundedUnitPrice === 0) return 0;
  if (boundedQuantity > MAX_INVOICE_TOTAL / boundedUnitPrice) return MAX_INVOICE_TOTAL_CENTS;

  return Math.min(Math.round(boundedQuantity * boundedUnitPrice * 100), MAX_INVOICE_TOTAL_CENTS);
}

export function calculateInvoiceTotals<T extends Pick<InvoiceLine, 'quantity' | 'unit_price'>>(lines: T[]) {
  const subtotalInCents = lines.reduce((sum, line) => (
    Math.min(sum + invoiceLineCents(Number(line.quantity), Number(line.unit_price)), MAX_INVOICE_TOTAL_CENTS)
  ), 0);
  const subtotal = subtotalInCents / 100;

  return { subtotal, total: subtotal };
}

export function parseInvoiceDraft(input: unknown): Valid<InvoiceDraft> | Invalid {
  if (!input || typeof input !== 'object') return { valid: false, error: 'Complete the invoice details.' };

  const value = input as Record<string, unknown>;
  const clientId = nullableUuid(value.clientId);
  const projectId = nullableUuid(value.projectId);
  const issuedOn = typeof value.issuedOn === 'string' ? value.issuedOn.trim() : '';
  const dueOn = typeof value.dueOn === 'string' ? value.dueOn.trim() : '';
  const rawLines = Array.isArray(value.lines) ? value.lines : [];

  if (!clientId) return { valid: false, error: 'Invalid client reference.' };
  if (!projectId) return { valid: false, error: 'Invalid project reference.' };
  if (!isInvoiceDate(issuedOn)) return { valid: false, error: 'Choose a valid issue date.' };
  if (!isInvoiceDate(dueOn)) return { valid: false, error: 'Choose a valid due date.' };
  if (dueOn < issuedOn) return { valid: false, error: 'Choose a due date on or after the issue date.' };
  if (rawLines.length === 0) return { valid: false, error: 'Add at least one invoice line.' };

  const lines: InvoiceDraft['lines'] = [];
  for (const [position, item] of rawLines.entries()) {
    const line = item && typeof item === 'object' ? item as Record<string, unknown> : {};
    const description = text(line.description, 500);
    const quantity = invoiceNumber(line.quantity);
    const unitPrice = invoiceNumber(line.unitPrice);

    if (!description) return { valid: false, error: 'Add a description for every invoice line.' };
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return { valid: false, error: 'Invoice line quantities must be greater than zero.' };
    }
    if (quantity > MAX_INVOICE_QUANTITY) {
      return { valid: false, error: 'Invoice line quantities cannot exceed 1,000,000.' };
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      return { valid: false, error: 'Invoice line prices cannot be negative.' };
    }
    if (!hasAtMostTwoFractionalDigits(line.unitPrice)) {
      return { valid: false, error: 'Invoice line prices must use at most two decimal places.' };
    }
    if (unitPrice > MAX_INVOICE_TOTAL || (unitPrice > 0 && quantity > MAX_INVOICE_TOTAL / unitPrice)) {
      return { valid: false, error: 'Invoice totals cannot exceed 99,999,999,999.99 MAD.' };
    }

    lines.push({
      description,
      quantity,
      unit_price: Math.round(unitPrice * 100) / 100,
      position,
    });
  }

  return {
    valid: true,
    value: {
      client_id: clientId,
      project_id: projectId,
      issued_on: issuedOn,
      due_on: dueOn,
      currency: 'MAD',
      notes: text(value.notes, 2000),
      lines,
    },
  };
}
