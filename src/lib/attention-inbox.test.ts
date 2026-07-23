import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { groupAttentionItems, type AttentionItem } from './automation';

function item(overrides: Partial<AttentionItem>): AttentionItem {
  return {
    id: crypto.randomUUID(),
    kind: 'new_lead',
    priority: 'normal',
    status: 'open',
    title: 'Atlas Riad needs a reply',
    detail: 'New website enquiry',
    owner_email: '70karim.hida@gmail.com',
    due_at: '2026-07-23T12:00:00.000Z',
    snoozed_until: null,
    source_type: 'lead',
    source_id: crypto.randomUUID(),
    source_href: '/admin/leads/11111111-1111-4111-8111-111111111111',
    action_label: 'Reply now',
    idempotency_key: crypto.randomUUID(),
    completed_at: null,
    created_at: '2026-07-23T10:00:00.000Z',
    updated_at: '2026-07-23T10:00:00.000Z',
    ...overrides,
  };
}

test('groups visible attention by urgency and keeps snoozed work hidden', () => {
  const now = new Date('2026-07-23T13:00:00.000Z');
  const groups = groupAttentionItems([
    item({ title: 'Normal overdue', due_at: '2026-07-23T11:00:00.000Z' }),
    item({ title: 'Urgent overdue', priority: 'urgent', due_at: '2026-07-23T12:00:00.000Z' }),
    item({ title: 'Due today', due_at: '2026-07-23T16:00:00.000Z' }),
    item({ title: 'Upcoming', due_at: '2026-07-25T09:00:00.000Z' }),
    item({ title: 'Snoozed', status: 'snoozed', snoozed_until: '2026-07-24T13:00:00.000Z' }),
    item({ title: 'No deadline', due_at: null }),
  ], now);

  assert.deepEqual(groups.overdue.map((entry) => entry.title), ['Urgent overdue', 'Normal overdue']);
  assert.deepEqual(groups.today.map((entry) => entry.title), ['Due today', 'No deadline']);
  assert.deepEqual(groups.upcoming.map((entry) => entry.title), ['Upcoming']);
});

test('overview refreshes and reads protected attention items before rendering', () => {
  const page = readFileSync(new URL('../app/admin/page.tsx', import.meta.url), 'utf8');
  const inbox = readFileSync(new URL('../app/admin/AttentionInbox.tsx', import.meta.url), 'utf8');
  const actions = readFileSync(new URL('../app/admin/attention-actions.ts', import.meta.url), 'utf8');

  assert.match(page, /requireAdminMember\(\)/);
  assert.match(page, /crm_refresh_attention_items/);
  assert.match(page, /from\('attention_items'\)/);
  assert.match(page, /AttentionItem/);
  assert.match(inbox, /Overdue/);
  assert.match(inbox, /Today/);
  assert.match(inbox, /Upcoming/);
  assert.match(inbox, /attentionMutationAction/);
  assert.match(inbox, /Snooze for 24 hours/);
  assert.match(actions, /parseAttentionMutation/);
  assert.match(actions, /requireAdminMember/);
  assert.match(actions, /crm_complete_attention_item/);
  assert.match(actions, /crm_snooze_attention_item/);
});

test('attention inbox keeps phone actions touch-safe', () => {
  const css = readFileSync(new URL('../app/admin/operations.css', import.meta.url), 'utf8');

  assert.match(css, /\.ops-attention-action/);
  assert.match(css, /min-(?:width|height): 44px/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.ops-attention-row/);
});
