'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mail, PanelsTopLeft, WalletCards } from 'lucide-react';
import type { TeamMember } from '@/lib/crm';
import { SignOutButton } from './SignOutButton';

const navigation = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/pipeline', label: 'Pipeline', icon: PanelsTopLeft },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/finance', label: 'Finance', icon: WalletCards },
] as const;

function isActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === href : pathname.startsWith(href) || (href === '/admin/pipeline' && pathname.startsWith('/admin/leads'));
}

export function AdminShell({ member, children }: { member: TeamMember; children: React.ReactNode }) {
  const pathname = usePathname();
  const name = member.name?.trim() || member.email.split('@')[0];
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="ops-shell">
      <aside className="ops-sidebar">
        <Link href="/admin" className="ops-brand" aria-label="WeReact operations overview">&middot;wereact&middot;</Link>
        <nav className="ops-nav" aria-label="Agency workspace">
          <span className="ops-nav__label">Workspace</span>
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link href={href} className={isActive(pathname, href) ? 'is-active' : ''} aria-current={isActive(pathname, href) ? 'page' : undefined} key={href}>
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="ops-sidebar__footer">
          <div className="ops-member" title={member.email}>
            <span className="ops-member__avatar">{initial}</span>
            <span><strong>{name}</strong><small>{member.role}</small></span>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <div className="ops-app">
        <header className="ops-mobile-header">
          <Link href="/admin" className="ops-brand">&middot;wereact&middot;</Link>
          <span>{navigation.find(({ href }) => isActive(pathname, href))?.label ?? 'Workspace'}</span>
        </header>
        {children}
      </div>

      <nav className="ops-mobile-nav" aria-label="Agency workspace">
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link href={href} className={isActive(pathname, href) ? 'is-active' : ''} aria-current={isActive(pathname, href) ? 'page' : undefined} key={href}>
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
