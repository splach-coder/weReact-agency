import {
  isLeadStatus,
  isProjectStatus,
  PROJECT_WORK_ITEM_KINDS,
  PROJECT_WORK_ITEM_PRIORITIES,
  PROJECT_WORK_ITEM_STATUSES,
  type LeadStatus,
  type ProjectStatus,
  type ProjectWorkItemKind,
  type ProjectWorkItemPriority,
  type ProjectWorkItemStatus,
} from './crm';

export type LeadUpdate = {
  status: LeadStatus;
  assigned_to: string | null;
  estimated_value: number | null;
  next_follow_up: string | null;
  expected_updated_at: string;
};

type ParseResult<T> = { valid: true; value: T } | { valid: false; error: string };

export const MANUAL_LEAD_SOURCES = [
  'whatsapp',
  'phone',
  'referral',
  'instagram',
  'walk_in',
  'other',
] as const;

export type ManualLeadSource = (typeof MANUAL_LEAD_SOURCES)[number];

export type ManualLeadInput = {
  name: string;
  email: string;
  company: string;
  phone: string;
  whatsapp: string;
  source: ManualLeadSource;
  message: string;
};

export type ProjectBriefUpdate = {
  project_id: string | null;
  expected_updated_at: string | null;
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
};

function cleanText(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function cleanList(value: unknown, maxItems = 30) {
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[\n,]+/) : [];
  return [...new Set(items.map((item) => String(item).trim()).filter(Boolean))].slice(0, maxItems);
}

export function parseManualLead(input: unknown): ParseResult<ManualLeadInput> {
  if (!input || typeof input !== 'object') {
    return { valid: false, error: 'Client details are missing.' };
  }

  const value = input as Record<string, unknown>;
  const name = cleanText(value.name, 120);
  const email = cleanText(value.email, 254).toLowerCase();
  const company = cleanText(value.company, 160);
  const phone = cleanText(value.phone, 40);
  const whatsapp = cleanText(value.whatsapp, 40);
  const message = cleanText(value.message, 2000) || 'Manual enquiry added by the team.';
  const source = typeof value.source === 'string' && MANUAL_LEAD_SOURCES.includes(value.source as ManualLeadSource)
    ? value.source as ManualLeadSource
    : null;

  if (!name) return { valid: false, error: 'Add the client name.' };
  if (!email && !phone && !whatsapp) {
    return { valid: false, error: 'Add an email, phone, or WhatsApp number.' };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Enter a valid email address.' };
  }
  if (!source) return { valid: false, error: 'Choose a valid enquiry source.' };

  return {
    valid: true,
    value: { name, email, company, phone, whatsapp, source, message },
  };
}

export function parseProjectBrief(input: unknown): ParseResult<ProjectBriefUpdate> {
  if (!input || typeof input !== 'object') {
    return { valid: false, error: 'Project brief is missing.' };
  }

  const value = input as Record<string, unknown>;
  const projectId = cleanText(value.projectId, 36);
  if (projectId && !/^[0-9a-f-]{36}$/i.test(projectId)) {
    return { valid: false, error: 'Invalid project reference.' };
  }

  const rawVersion = cleanText(value.expectedUpdatedAt, 40);
  const parsedVersion = new Date(rawVersion);
  if (projectId && (!/(?:Z|[+-]\d{2}:\d{2})$/.test(rawVersion) || Number.isNaN(parsedVersion.getTime()))) {
    return { valid: false, error: 'Refresh this project before saving.' };
  }

  const projectName = cleanText(value.projectName, 140);
  const projectType = cleanText(value.projectType, 80);
  const goals = cleanText(value.goals, 2000);
  const pages = cleanList(value.pages);
  const features = cleanList(value.features);
  const languages = cleanList(value.languages, 10);
  const status = isProjectStatus(value.status) ? value.status : 'briefing';
  const domainName = cleanText(value.domainName, 253)
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');

  if (!projectName || !projectType) {
    return { valid: false, error: 'Add a project name and website type.' };
  }
  if (status === 'ready_for_dev' && (!goals || pages.length === 0 || features.length === 0 || languages.length === 0)) {
    return { valid: false, error: 'Complete the goals, pages, features, and languages before development.' };
  }

  let budget: number | null = null;
  if (value.budget !== '' && value.budget != null) {
    const parsed = Number(value.budget);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 10_000_000) {
      return { valid: false, error: 'Budget must be a positive amount.' };
    }
    budget = Math.round(parsed * 100) / 100;
  }
  if (status === 'launched' && (!budget || budget <= 0)) {
    return { valid: false, error: 'Add the confirmed project amount before closing it.' };
  }

  const targetLaunch = cleanText(value.targetLaunch, 10);
  if (targetLaunch && !/^\d{4}-\d{2}-\d{2}$/.test(targetLaunch)) {
    return { valid: false, error: 'Choose a valid target launch date.' };
  }

  return {
    valid: true,
    value: {
      project_id: projectId || null,
      expected_updated_at: projectId ? parsedVersion.toISOString() : null,
      project_name: projectName,
      project_type: projectType,
      status,
      domain_name: domainName,
      goals,
      pages,
      features,
      languages,
      content_status: cleanText(value.contentStatus, 40) || 'unknown',
      brand_status: cleanText(value.brandStatus, 40) || 'unknown',
      domain_status: cleanText(value.domainStatus, 40) || 'unknown',
      hosting_status: cleanText(value.hostingStatus, 40) || 'unknown',
      reference_sites: cleanList(value.references, 10),
      budget,
      target_launch: targetLaunch || null,
      developer_notes: cleanText(value.developerNotes, 4000),
    },
  };
}

export function parseLeadUpdate(input: unknown): ParseResult<LeadUpdate> {
  if (!input || typeof input !== 'object') {
    return { valid: false, error: 'Lead update is missing.' };
  }

  const value = input as Record<string, unknown>;
  if (!isLeadStatus(value.status)) {
    return { valid: false, error: 'Choose a valid pipeline stage.' };
  }

  const assignedTo = typeof value.assignedTo === 'string' ? value.assignedTo.trim() : '';
  if (assignedTo.length > 254) {
    return { valid: false, error: 'Choose a valid team member.' };
  }

  let estimatedValue: number | null = null;
  if (value.estimatedValue !== '' && value.estimatedValue != null) {
    const parsed = Number(value.estimatedValue);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 10_000_000) {
      return { valid: false, error: 'Estimated value must be a positive number.' };
    }
    estimatedValue = Math.round(parsed * 100) / 100;
  }

  let nextFollowUp: string | null = null;
  if (value.nextFollowUp !== '' && value.nextFollowUp != null) {
    const rawDate = String(value.nextFollowUp);
    const parsed = new Date(rawDate);
    if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(rawDate) || Number.isNaN(parsed.getTime())) {
      return { valid: false, error: 'Choose a valid follow-up date.' };
    }
    nextFollowUp = parsed.toISOString();
  }

  const rawVersion = typeof value.expectedUpdatedAt === 'string' ? value.expectedUpdatedAt : '';
  const parsedVersion = new Date(rawVersion);
  if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(rawVersion) || Number.isNaN(parsedVersion.getTime())) {
    return { valid: false, error: 'Refresh this lead before saving.' };
  }

  return {
    valid: true,
    value: {
      status: value.status,
      assigned_to: assignedTo || null,
      estimated_value: estimatedValue,
      next_follow_up: nextFollowUp,
      expected_updated_at: parsedVersion.toISOString(),
    },
  };
}

export function parseLeadNote(input: unknown): ParseResult<string> {
  const note = typeof input === 'string' ? input.trim() : '';

  if (!note) return { valid: false, error: 'Write a note before saving.' };
  if (note.length > 2000) return { valid: false, error: 'Keep notes under 2,000 characters.' };

  return { valid: true, value: note };
}

export type ProjectWorkItemInput = {
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
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseIsoTimestamp(value: unknown) {
  const raw = cleanText(value, 40);
  const date = new Date(raw);
  if (!raw) return { valid: true as const, value: null };
  if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(raw) || Number.isNaN(date.getTime())) {
    return { valid: false as const };
  }
  return { valid: true as const, value: date.toISOString() };
}

export function parseProjectWorkItem(input: unknown): ParseResult<ProjectWorkItemInput> {
  if (!input || typeof input !== 'object') return { valid: false, error: 'Work item details are missing.' };

  const value = input as Record<string, unknown>;
  const projectId = cleanText(value.projectId, 36);
  const kind = cleanText(value.kind, 24);
  const title = cleanText(value.title, 180);
  const status = cleanText(value.status, 24) || 'todo';
  const priority = cleanText(value.priority, 24) || 'normal';
  const dueOn = typeof value.dueOn === 'string' ? value.dueOn.trim() : '';
  const assignedTo = cleanText(value.assignedTo, 254).toLowerCase();
  const completedAt = parseIsoTimestamp(value.completedAt);
  const position = value.position == null || value.position === '' ? 0 : Number(value.position);

  if (!isUuid(projectId)) return { valid: false, error: 'Invalid project reference.' };
  if (!PROJECT_WORK_ITEM_KINDS.includes(kind as ProjectWorkItemKind)) {
    return { valid: false, error: 'Choose a valid work item type.' };
  }
  if (!title) return { valid: false, error: 'Add a work item title.' };
  if (!PROJECT_WORK_ITEM_STATUSES.includes(status as ProjectWorkItemStatus)) {
    return { valid: false, error: 'Choose a valid work item status.' };
  }
  if (!PROJECT_WORK_ITEM_PRIORITIES.includes(priority as ProjectWorkItemPriority)) {
    return { valid: false, error: 'Choose a valid work item priority.' };
  }
  if (dueOn && !isIsoDate(dueOn)) return { valid: false, error: 'Choose a valid due date.' };
  if (typeof value.assignedTo === 'string' && value.assignedTo.trim().length > 254) {
    return { valid: false, error: 'Choose a valid team member.' };
  }
  if (!Number.isInteger(position) || position < 0) {
    return { valid: false, error: 'Choose a valid work item position.' };
  }
  if (!completedAt.valid) return { valid: false, error: 'Choose a valid completion time.' };

  return {
    valid: true,
    value: {
      project_id: projectId,
      kind: kind as ProjectWorkItemKind,
      title,
      details: cleanText(value.details, 2000),
      status: status as ProjectWorkItemStatus,
      priority: priority as ProjectWorkItemPriority,
      due_on: dueOn || null,
      assigned_to: assignedTo || null,
      required: value.required === true || value.required === 'true',
      position,
      completed_at: completedAt.value,
    },
  };
}
