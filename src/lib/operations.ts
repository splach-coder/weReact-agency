export const FINANCE_TYPES = ['income', 'expense'] as const;
export const FINANCE_STATUSES = ['pending', 'paid'] as const;

export type FinanceType = (typeof FINANCE_TYPES)[number];
export type FinanceStatus = (typeof FINANCE_STATUSES)[number];

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
