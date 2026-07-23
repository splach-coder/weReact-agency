export const CRM_STATUSES = [
  'new',
  'contacted',
  'discovery',
  'proposal_sent',
  'negotiation',
  'won',
  'lost',
] as const;
export const SALES_PIPELINE_STATUSES = [
  'new',
  'contacted',
  'discovery',
  'proposal_sent',
  'negotiation',
] as const;
export const DEFAULT_SELLER_EMAIL = '70karim.hida@gmail.com';
export const PROJECT_STATUSES = [
  'briefing',
  'ready_for_dev',
  'building',
  'review',
  'launched',
  'paused',
] as const;

export type LeadStatus = (typeof CRM_STATUSES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_WORK_ITEM_KINDS = ['milestone', 'task', 'delivery_check'] as const;
export const PROJECT_WORK_ITEM_STATUSES = ['todo', 'in_progress', 'blocked', 'done', 'skipped'] as const;
export const PROJECT_WORK_ITEM_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;

export type ProjectWorkItemKind = (typeof PROJECT_WORK_ITEM_KINDS)[number];
export type ProjectWorkItemStatus = (typeof PROJECT_WORK_ITEM_STATUSES)[number];
export type ProjectWorkItemPriority = (typeof PROJECT_WORK_ITEM_PRIORITIES)[number];

export type ProjectWorkItem = {
  id: string;
  project_id: string;
  kind: ProjectWorkItemKind;
  title: string;
  details: string;
  status: ProjectWorkItemStatus;
  priority: ProjectWorkItemPriority;
  due_on: string | null;
  assigned_to: string | null;
  required: boolean;
  position: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CrmClient = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  whatsapp: string | null;
};

export type CrmProject = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  originating_lead_id: string | null;
  project_name: string;
  project_type: string;
  domain_name: string;
  status: ProjectStatus;
  goals: string;
  pages: string[];
  features: string[];
  languages: string[];
  content_status: string;
  brand_status: string;
  domain_status: string;
  hosting_status: string;
  reference_sites: string[];
  budget: number | null;
  target_launch: string | null;
  developer_notes: string;
  created_by: string | null;
  assigned_developer_email?: string | null;
};

export type CrmLead = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id?: string | null;
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
export type LeadLifecycleAction = {
  nextStatus: LeadStatus;
  label: string;
};

export function getLeadLifecycleAction(status: LeadStatus): LeadLifecycleAction | null {
  if (status === 'new') return { nextStatus: 'contacted', label: 'Mark as contacted' };
  if (status === 'contacted') return { nextStatus: 'discovery', label: 'Start discovery' };
  if (status === 'discovery') return { nextStatus: 'proposal_sent', label: 'Mark proposal sent' };
  if (status === 'proposal_sent') return { nextStatus: 'negotiation', label: 'Start negotiation' };
  if (status === 'negotiation') return { nextStatus: 'won', label: 'Mark as won' };
  return null;
}

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return typeof value === 'string' && PROJECT_STATUSES.includes(value as ProjectStatus);
}

export type ProjectLifecycleAction = {
  nextStatus: ProjectStatus;
  label: string;
  confirmation?: string;
};

export function getProjectLifecycleAction(status: ProjectStatus): ProjectLifecycleAction | null {
  if (status === 'briefing') return { nextStatus: 'ready_for_dev', label: 'Send to development' };
  if (status === 'ready_for_dev') return { nextStatus: 'building', label: 'Start development' };
  if (status === 'building') return { nextStatus: 'review', label: 'Send to client review' };
  if (status === 'review') {
    return {
      nextStatus: 'launched',
      label: 'Close project and record payment',
      confirmation: 'Close this project and record its confirmed amount as paid revenue?',
    };
  }
  if (status === 'paused') return { nextStatus: 'building', label: 'Resume development' };
  return null;
}

const PROJECT_BRIEF_FIELDS = [
  'project_name',
  'project_type',
  'goals',
  'pages',
  'features',
  'languages',
] as const;

export function getProjectBriefProgress(
  project: Pick<CrmProject, (typeof PROJECT_BRIEF_FIELDS)[number]>,
) {
  const missing = PROJECT_BRIEF_FIELDS.filter((field) => {
    const value = project[field];
    return Array.isArray(value) ? value.length === 0 : value.trim().length === 0;
  });
  const completed = PROJECT_BRIEF_FIELDS.length - missing.length;

  return {
    completed,
    total: PROJECT_BRIEF_FIELDS.length,
    percentage: Math.round((completed / PROJECT_BRIEF_FIELDS.length) * 100),
    missing: [...missing],
    ready: missing.length === 0,
  };
}

export function groupLeadsByStatus(leads: CrmLead[]): Record<LeadStatus, CrmLead[]> {
  const groups: Record<LeadStatus, CrmLead[]> = {
    new: [],
    contacted: [],
    discovery: [],
    proposal_sent: [],
    negotiation: [],
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

function isProjectWorkComplete(status: ProjectWorkItemStatus) {
  return status === 'done' || status === 'skipped';
}

export function getProjectWorkProgress(items: ProjectWorkItem[]) {
  const milestones = items
    .filter((item) => item.kind === 'milestone')
    .sort((left, right) => left.position - right.position);
  const completed = milestones.filter((item) => isProjectWorkComplete(item.status)).length;
  const next = milestones.find((item) => !isProjectWorkComplete(item.status))?.id ?? null;

  return {
    completed,
    total: milestones.length,
    percentage: milestones.length ? Math.round((completed / milestones.length) * 100) : 0,
    next,
  };
}

export function getProjectLaunchProgress(items: ProjectWorkItem[]) {
  const requiredChecks = items.filter((item) => item.kind === 'delivery_check' && item.required);
  const incomplete = requiredChecks
    .filter((item) => !isProjectWorkComplete(item.status))
    .map((item) => item.title);
  const completed = requiredChecks.length - incomplete.length;

  return {
    completed,
    total: requiredChecks.length,
    percentage: requiredChecks.length ? Math.round((completed / requiredChecks.length) * 100) : 100,
    ready: incomplete.length === 0,
    incomplete,
  };
}

export type {
  AttentionItem,
  AutomationEvent,
  Communication,
  CommunicationEvent,
  IntegrationHealth,
} from './automation';
