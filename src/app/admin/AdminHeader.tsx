import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import type { TeamMember } from '@/lib/crm';
import { SignOutButton } from './SignOutButton';

export function AdminHeader({ member }: { member: TeamMember }) {
  return (
    <header className="crm-header">
      <div className="crm-header__inner">
        <Link href="/admin" className="crm-brand" aria-label="WeReact CRM dashboard">
          &middot;wereact&middot;
        </Link>

        <div className="crm-header__actions">
          <Link href="/admin" className="crm-icon-link" aria-label="Dashboard" title="Dashboard">
            <LayoutDashboard size={17} />
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