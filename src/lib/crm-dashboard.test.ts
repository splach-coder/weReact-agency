import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('uses stable drag context ids so server and client hydration match', () => {
  const dashboard = readFileSync(
    new URL('../app/admin/DashboardClient.tsx', import.meta.url),
    'utf8',
  );

  assert.match(dashboard, /<DndContext\s+id="crm-sales-pipeline"/);
  assert.match(dashboard, /<DndContext\s+id="crm-delivery-pipeline"/);
  assert.match(dashboard, /<DndContext\s+id="crm-closed-projects"/);
});

test('provides a touch-first mobile pipeline instead of relying on drag and drop', () => {
  const dashboard = readFileSync(
    new URL('../app/admin/DashboardClient.tsx', import.meta.url),
    'utf8',
  );

  assert.match(dashboard, /className="crm-mobile-board"/);
  assert.match(dashboard, /className="crm-mobile-stage-tabs"/);
  assert.match(dashboard, /aria-label="Sales pipeline stages"/);
  assert.match(dashboard, /aria-label="Website delivery stages"/);
});

test('mobile cards expose explicit, accessible stage controls', () => {
  const dashboard = readFileSync(
    new URL('../app/admin/DashboardClient.tsx', import.meta.url),
    'utf8',
  );

  assert.match(dashboard, /Move client/);
  assert.match(dashboard, /Move project/);
  assert.match(dashboard, /movingLeadId === lead\.id/);
  assert.match(dashboard, /movingProjectId === project\.id/);
});
