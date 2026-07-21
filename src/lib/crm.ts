export const CRM_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'] as const;

export type LeadStatus = (typeof CRM_STATUSES)[number];

export type CrmLead = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  company: string | null;
  phone: string;
  whatsapp: string | null;
  message: string;
  status: LeadStatus;
  source: string;
  attribution: Record<string, string>;
  notes: string | null;
  assigned_to: string | null;
  estimated_value: number | null;
  next_follow_up: string | null;
  last_contacted_at: string | null;
};

export type LeadEventKind = 'created' | 'note' | 'status_change' | 'email_sent' | 'contacted';

export type LeadEvent = {
  id: string;
  lead_id: string;
  created_at: string;
  author: string | null;
  kind: LeadEventKind;
  body: string | null;
  meta: Record<string, unknown>;
};

export type TeamMember = {
  email: string;
  name: string | null;
  role: 'owner' | 'seller';
};

export type LeadFilters = {
  query: string;
  status: LeadStatus | 'all';
};

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && CRM_STATUSES.includes(value as LeadStatus);
}

export function groupLeadsByStatus(leads: CrmLead[]): Record<LeadStatus, CrmLead[]> {
  const groups: Record<LeadStatus, CrmLead[]> = {
    new: [],
    contacted: [],
    qualified: [],
    won: [],
    lost: [],
  };

  for (const lead of leads) groups[lead.status].push(lead);
  return groups;
}

export function filterLeads(leads: CrmLead[], filters: LeadFilters) {
  const query = filters.query.trim().toLowerCase();

  return leads.filter((lead) => {
    if (filters.status !== 'all' && lead.status !== filters.status) return false;
    if (!query) return true;

    return [lead.name, lead.email, lead.company, lead.phone, lead.whatsapp]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });
}

export function formatLeadAge(createdAt: string, now = new Date()) {
  const created = new Date(createdAt);
  const elapsed = Math.max(0, now.getTime() - created.getTime());
  const days = Math.floor(elapsed / 86_400_000);

  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function compactPhone(value: string) {
  return value.trim().replace(/[^\d+]/g, '');
}

function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('00212')) return digits.slice(2);
  if (/^0\d{9}$/.test(digits)) return `212${digits.slice(1)}`;
  return digits;
}

export function getWhatsAppHref(value: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(value)}`;
}

export function getLeadContactRoute(lead: Pick<CrmLead, 'email' | 'phone' | 'whatsapp'>) {
  if (lead.whatsapp?.trim()) {
    return {
      kind: 'whatsapp' as const,
      href: getWhatsAppHref(lead.whatsapp),
    };
  }

  if (lead.phone.trim()) {
    return {
      kind: 'phone' as const,
      href: `tel:${compactPhone(lead.phone)}`,
    };
  }

  return {
    kind: 'email' as const,
    href: `mailto:${lead.email.trim()}`,
  };
}
