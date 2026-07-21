import { isLeadStatus, type LeadStatus } from './crm';

export type LeadUpdate = {
  status: LeadStatus;
  assigned_to: string | null;
  estimated_value: number | null;
  next_follow_up: string | null;
  expected_updated_at: string;
};

type ParseResult<T> = { valid: true; value: T } | { valid: false; error: string };

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