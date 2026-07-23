import { requireAdminMember } from '@/lib/admin-auth';
import type { FinanceTransaction } from '@/lib/operations';
import { AdminShell } from '../AdminShell';
import { FinanceWorkspace } from './FinanceWorkspace';
import { RealtimeRefresh } from '../RealtimeRefresh';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
  const { supabase, member } = await requireAdminMember();
  const [transactionResult, projectResult] = await Promise.all([
    supabase.from('finance_transactions').select('id,created_at,occurred_on,type,status,amount,category,description,reference,client_id,project_id,source,created_by').order('occurred_on', { ascending: false }).order('created_at', { ascending: false }),
    supabase.from('crm_projects').select('id,project_name').is('deleted_at', null).order('project_name'),
  ]);
  if (transactionResult.error && transactionResult.error.code !== '42P01') console.error('Finance query failed.', transactionResult.error);
  return <AdminShell member={member}><FinanceWorkspace transactions={(transactionResult.data ?? []) as FinanceTransaction[]} projects={projectResult.data ?? []} /><RealtimeRefresh tables={['finance_transactions']} /></AdminShell>;
}
