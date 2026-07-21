import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import type { TeamMember } from '@/lib/crm';
import { SignOutButton } from './SignOutButton';

export function AdminHeader({ member }: { member: TeamMember }) {
  return (
    <header className="crm-header">
      <div className="crm-header__inner">
        <Link href="/admin" className="crm-brand" aria-label="WeReact CRM dashboard">
          <span className="crm-brand__mark">W</span>
          <span>
            <strong>WeReact</strong>
            <small>Client pipeline</small>
          </span>
        </Link>

        <div className="crm-header__actions">
          <Link href="/admin" className="crm-icon-link" aria-label="Dashboard" title="Dashboard">
            <LayoutDashboard size={18} />
          </Link>
          <div className="crm-member">
            <span>{member.name ?? member.email}</span>
            <small>{member.role}</small>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
