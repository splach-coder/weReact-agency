'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navItems } from './data';
import { siteConfig } from '@/config/site';

export default function LuxuryHeader({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => path === '' ? pathname === `/${locale}` : pathname.startsWith(`/${locale}${path}`);

  return (
    <header className="luxury-header">
      <div className="luxury-container luxury-header__bar">
        <Link href={`/${locale}`} aria-label="Just Luxury Transfers home" onClick={() => setOpen(false)}>
          <Image className="luxury-header__logo" src="/images/luxury/logo.svg" alt="Just Luxury Transfers" width={190} height={54} priority />
        </Link>
        <nav className={`luxury-header__nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.path} href={`/${locale}${item.path}`} aria-current={isActive(item.path) ? 'page' : undefined} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="luxury-header__actions">
          <details className="luxury-locale">
            <summary>{locale.toUpperCase()}</summary>
            <div className="luxury-locale__menu">
              {siteConfig.locales.map((code) => <Link key={code} href={`/${code}${pathname.replace(/^\/[^/]+/, '')}`}>{code.toUpperCase()}</Link>)}
            </div>
          </details>
          <Link className="luxury-button luxury-button--small" href={`/${locale}/book`}>Book now</Link>
          <button className="luxury-menu-button" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
