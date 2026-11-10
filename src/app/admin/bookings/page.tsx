import { requireAdminMember } from '@/lib/admin-auth';
import type { CrmLead } from '@/lib/crm';
import { AdminShell } from '../AdminShell';
import { RealtimeRefresh } from '../RealtimeRefresh';
import { BookingsWorkspace } from './BookingsWorkspace';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const { supabase, member } = await requireAdminMember();
  const { data: leads, error } = await supabase
    .from('leads')
    .select('id,created_at,updated_at,client_id,name,email,company,phone,whatsapp,message,status,source,attribution,notes,assigned_to,estimated_value,next_follow_up,last_contacted_at')
    .eq('source', 'cal_booking')
    .order('created_at', { ascending: false });
  if (error) console.error('Bookings query failed.', error);
  const bookings = (leads ?? []).map((lead) => ({ ...lead, email: lead.email ?? '', phone: lead.phone ?? '' })) as CrmLead[];
  return <AdminShell member={member}><BookingsWorkspace bookings={bookings} /><RealtimeRefresh tables={['leads']} /></AdminShell>;
}
