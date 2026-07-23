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
test('connects project closure to its confirmed paid revenue', () => {
  const editor = readFileSync(
    new URL('../app/admin/leads/[id]/LeadEditor.tsx', import.meta.url),
    'utf8',
  );

  assert.match(editor, /draft\.budget/);
  assert.match(editor, /Close this project and record/);
  assert.match(editor, /formatMad\(confirmedBudget\)/);
  assert.match(editor, /Payment recorded/);
  assert.match(editor, /href="\/admin\/finance"/);
  assert.match(editor, /disabled=\{draft\.status === 'launched'\}/);
});

test('authorizes and validates project workspace mutations before calling their RPCs', () => {
  const actions = readFileSync(new URL('../app/admin/actions.ts', import.meta.url), 'utf8');

  assert.match(actions, /getAuthorizedContext\(\)/);
  assert.match(actions, /parseProjectWorkItem/);
  assert.match(actions, /saveProjectWorkItemAction/);
  assert.match(actions, /deleteProjectWorkItemAction/);
  assert.match(actions, /rpc\('crm_save_project_work_item'/);
  assert.match(actions, /rpc\('crm_delete_project_work_item'/);
  assert.match(actions, /p_project_id: parsed\.value\.project_id/);
  assert.match(actions, /p_item: parsed\.value/);
  assert.match(actions, /This work item changed in another session\. Refresh and try again\./);
  assert.match(actions, /revalidatePath\(`\/admin\/leads\/\$\{leadId\}`\)/);
});

test('authorizes, validates, and refreshes invoice mutations through secure RPCs', () => {
  const actions = readFileSync(new URL('../app/admin/operations-actions.ts', import.meta.url), 'utf8');

  assert.match(actions, /requireAdminMember/);
  assert.match(actions, /parseInvoiceDraft/);
  assert.match(actions, /createInvoiceDraftAction/);
  assert.match(actions, /updateInvoiceDraftAction/);
  assert.match(actions, /issueInvoiceAction/);
  assert.match(actions, /voidInvoiceAction/);
  assert.match(actions, /rpc\('crm_create_invoice_draft'/);
  assert.match(actions, /rpc\('crm_update_invoice_draft'/);
  assert.match(actions, /rpc\('crm_issue_invoice'/);
  assert.match(actions, /rpc\('crm_void_invoice'/);
  assert.match(actions, /p_project_id: parsed\.value\.project_id/);
  assert.match(actions, /p_draft: parsed\.value/);
  assert.match(actions, /This invoice changed in another session\. Refresh and try again\./);
  assert.match(actions, /revalidatePath\(`\/admin\/leads\/\$\{leadId\}`\)/);
});

test('loads selected-project operations data and refreshes it in realtime', () => {
  const detail = readFileSync(new URL('../app/admin/leads/[id]/page.tsx', import.meta.url), 'utf8');

  assert.match(detail, /assigned_developer_email/);
  assert.match(detail, /from\('project_work_items'\)/);
  assert.match(detail, /from\('invoices'\)/);
  assert.match(detail, /from\('invoice_lines'\)/);
  assert.match(detail, /from\('team_members'\)/);
  assert.match(detail, /eq\('project_id', selectedProject\.id\)/);
  assert.match(detail, /'project_work_items', 'invoices', 'invoice_lines'/);
});


test('uses the shared admin membership gate for lead detail access', () => {
  const detail = readFileSync(new URL('../app/admin/leads/[id]/page.tsx', import.meta.url), 'utf8');

  assert.match(detail, /import \{ requireAdminMember \} from '@\/lib\/admin-auth';/);
  assert.match(detail, /const \{ supabase, member \} = await requireAdminMember\(\);/);
  assert.doesNotMatch(detail, /supabase\.auth\.getUser\(\)/);
});

test('passes selected project workspace data into the project brief editor', () => {
  const detail = readFileSync(new URL('../app/admin/leads/[id]/page.tsx', import.meta.url), 'utf8');
  const editor = readFileSync(new URL('../app/admin/leads/[id]/LeadEditor.tsx', import.meta.url), 'utf8');

  assert.match(detail, /teamMembers=\{projectWorkspace\.teamMembers\}/);
  assert.match(detail, /workItems=\{projectWorkspace\.workItems\}/);
  assert.match(detail, /invoices=\{projectWorkspace\.invoices\}/);
  assert.match(detail, /invoiceLines=\{projectWorkspace\.invoiceLines\}/);
  assert.match(editor, /teamMembers\?: TeamMember\[\];/);
  assert.match(editor, /workItems\?: ProjectWorkItem\[\];/);
  assert.match(editor, /invoices\?: Invoice\[\];/);
  assert.match(editor, /invoiceLines\?: InvoiceLine\[\];/);
});

test('assigns a validated project developer through the secure RPC and refreshes CRM routes', () => {
  const actions = readFileSync(new URL('../app/admin/actions.ts', import.meta.url), 'utf8');

  assert.match(actions, /export async function assignProjectDeveloperAction/);
  assert.match(actions, /if \(!UUID_PATTERN\.test\(leadId\)\) return \{ ok: false, error: 'Invalid lead reference\.' \};/);
  assert.match(actions, /if \(!UUID_PATTERN\.test\(projectId\)\) return \{ ok: false, error: 'Invalid project reference\.' \};/);
  assert.match(actions, /developerEmail === null/);
  assert.match(actions, /EMAIL_PATTERN\.test\(normalizedDeveloperEmail\)/);
  assert.match(actions, /const context = await getAuthorizedContext\(\);/);
  assert.match(actions, /rpc\('crm_assign_project_developer', \{[\s\S]*p_project_id: projectId,[\s\S]*p_developer_email: normalizedDeveloperEmail,/);
  assert.match(actions, /refreshLeadRoutes\(leadId\);/);
});
test('includes the project developer assignment in every overview and pipeline project read', () => {
  const overview = readFileSync(new URL('../app/admin/page.tsx', import.meta.url), 'utf8');
  const pipeline = readFileSync(new URL('../app/admin/pipeline/page.tsx', import.meta.url), 'utf8');

  assert.match(overview, /assigned_developer_email/);
  assert.match(pipeline, /assigned_developer_email/);
});

test('provides four focused project workspace views with an invoice integration slot', () => {
  const workspace = readFileSync(
    new URL('../app/admin/leads/[id]/ProjectWorkspace.tsx', import.meta.url),
    'utf8',
  );
  const editor = readFileSync(
    new URL('../app/admin/leads/[id]/LeadEditor.tsx', import.meta.url),
    'utf8',
  );

  assert.match(workspace, /'brief', 'work', 'launch', 'invoice'/);
  assert.match(workspace, /Brief/);
  assert.match(workspace, /Work/);
  assert.match(workspace, /Launch/);
  assert.match(workspace, /Invoice/);
  assert.match(workspace, /invoiceSlot\?: ReactNode/);
  assert.match(editor, /<ProjectWorkspace/);
  assert.match(editor, /brief=\{/);
});

test('project work view exposes assignment progress and explicit task controls', () => {
  const workspace = readFileSync(
    new URL('../app/admin/leads/[id]/ProjectWorkspace.tsx', import.meta.url),
    'utf8',
  );

  assert.match(workspace, /assignProjectDeveloperAction/);
  assert.match(workspace, /saveProjectWorkItemAction/);
  assert.match(workspace, /deleteProjectWorkItemAction/);
  assert.match(workspace, /getProjectWorkProgress/);
  assert.match(workspace, /Next milestone/);
  assert.match(workspace, /Add work item/);
  assert.match(workspace, /Edit work item/);
  assert.match(workspace, /aria-label=\{`Status for \$\{item\.title\}`\}/);
  assert.match(workspace, /aria-label=\{`Priority for \$\{item\.title\}`\}/);
  assert.match(workspace, /type="date"/);
  assert.match(workspace, /assignedTo/);
  assert.match(workspace, /if \(saving\) return;/);
  assert.match(workspace, /disabled=\{saving\}/);
  assert.doesNotMatch(workspace, /disabled=\{pending\}/);
  assert.doesNotMatch(workspace, /DndContext|useDraggable|useSortable/);
});

test('launch view names blocking checks and exposes explicit checklist controls', () => {
  const workspace = readFileSync(
    new URL('../app/admin/leads/[id]/ProjectWorkspace.tsx', import.meta.url),
    'utf8',
  );
  const editor = readFileSync(
    new URL('../app/admin/leads/[id]/LeadEditor.tsx', import.meta.url),
    'utf8',
  );

  assert.match(workspace, /getProjectLaunchProgress/);
  assert.match(workspace, /Domain readiness/);
  assert.match(workspace, /Hosting readiness/);
  assert.match(workspace, /Launch blocked/);
  assert.match(workspace, /launchProgress\.incomplete\.map/);
  assert.match(workspace, /aria-label=\{`Checklist status for \$\{item\.title\}`\}/);
  assert.match(editor, /closingWithIncompleteChecks/);
  assert.match(editor, /Remaining launch checks:/);
});

test('project workspace remains dense on desktop and touch-safe without mobile overflow', () => {
  const adminCss = readFileSync(new URL('../app/admin/admin.css', import.meta.url), 'utf8');
  const operationsCss = readFileSync(new URL('../app/admin/operations.css', import.meta.url), 'utf8');

  assert.match(adminCss, /\.crm-project-view-tabs[\s\S]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(adminCss, /\.crm-work-item__control[\s\S]*min-height:\s*44px/);
  assert.match(adminCss, /@media \(max-width: 700px\)[\s\S]*\.crm-project-view-tabs[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(adminCss, /@media \(max-width: 700px\)[\s\S]*\.crm-work-item-row[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(adminCss, /@media \(max-width: 700px\)[\s\S]*\.crm-project-selector[\s\S]*overflow:\s*hidden/);
  assert.match(operationsCss, /\.crm-mobile-contact[\s\S]*bottom:\s*calc\(64px/);
});

test('invoice workspace supports the complete draft-to-issued project flow', () => {
  const invoice = readFileSync(
    new URL('../app/admin/leads/[id]/InvoiceWorkspace.tsx', import.meta.url),
    'utf8',
  );
  const editor = readFileSync(
    new URL('../app/admin/leads/[id]/LeadEditor.tsx', import.meta.url),
    'utf8',
  );

  assert.match(invoice, /createInvoiceDraftAction/);
  assert.match(invoice, /updateInvoiceDraftAction/);
  assert.match(invoice, /issueInvoiceAction/);
  assert.match(invoice, /voidInvoiceAction/);
  assert.match(invoice, /Create invoice draft/);
  assert.match(invoice, /Save draft/);
  assert.match(invoice, /Issue invoice/);
  assert.match(invoice, /Add line/);
  assert.match(invoice, /Open printable invoice/);
  assert.match(invoice, /window\.confirm/);
  assert.match(editor, /<InvoiceWorkspace/);
  assert.match(editor, /invoices=\{invoices\}/);
  assert.match(editor, /invoiceLines=\{invoiceLines\}/);
});

test('protects and renders a printable immutable invoice document', () => {
  const page = readFileSync(
    new URL('../app/admin/invoices/[id]/page.tsx', import.meta.url),
    'utf8',
  );
  const actions = readFileSync(
    new URL('../app/admin/invoices/[id]/InvoicePrintActions.tsx', import.meta.url),
    'utf8',
  );
  const css = readFileSync(new URL('../app/admin/invoice.css', import.meta.url), 'utf8');
  const operationActions = readFileSync(new URL('../app/admin/operations-actions.ts', import.meta.url), 'utf8');

  assert.match(page, /requireAdminMember\(\)/);
  assert.match(page, /from\('invoices'\)/);
  assert.match(page, /from\('invoice_lines'\)/);
  assert.match(page, /InvoicePrintActions/);
  assert.match(page, /WR-/);
  assert.match(page, /Amount due/);
  assert.match(page, /WeReact agency/);
  assert.doesNotMatch(page, /\b(?:ICE|IF|RC|VAT)\b/);
  assert.match(actions, /window\.print\(\)/);
  assert.match(page, /recipientEmail=\{client\?\.email\?\.trim\(\) \|\| customer\.email\}/);
  assert.match(actions, /sendInvoiceEmailAction/);
  assert.match(actions, /Email invoice/);
  assert.match(operationActions, /export async function sendInvoiceEmailAction/);
  assert.match(operationActions, /https:\/\/api\.resend\.com\/emails/);
  assert.match(operationActions, /kind: 'email_sent'/);
  assert.match(operationActions, /\['issued', 'paid'\]/);
  assert.match(css, /@media print/);
  assert.match(css, /\.invoice-document/);
  assert.match(css, /\.invoice-table tr,[\s\S]*break-inside: avoid/);
  assert.match(css, /\.invoice-totals,[\s\S]*page-break-inside: avoid/);
});
