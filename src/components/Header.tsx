'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowUpRight, CircleDot } from 'lucide-react';
import { siteConfig } from '@/config/site';

const StaggeredMenu = dynamic(() => import('./StaggeredMenu'), { ssr: false });

export default function Header() {
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 28);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: `/${locale}/about` },
    { label: 'Services', href: `/${locale}/services` },
    { label: 'Work', href: `/${locale}/work` },
    { label: 'Blog', href: `/${locale}/blog` },
  ];

  return (
    <header className="fixed left-0 top-0 z-[100] w-full px-4 pt-4 md:px-6">
      <div
        className={`mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center gap-3 rounded-[8px] border px-3 py-3 transition duration-300 md:grid-cols-[1fr_auto_1fr] md:px-4 ${
          scrolled
            ? 'border-[var(--color-primary)]/18 bg-white/86 shadow-[0_18px_70px_rgba(58,90,64,0.16)] backdrop-blur-xl'
            : 'border-[var(--color-primary)]/12 bg-[var(--color-background-main)]/72 backdrop-blur-lg'
        }`}
      >
        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-[6px] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--color-primary)]/74 transition hover:bg-[var(--color-primary)] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={`/${locale}`}
          className="group flex items-center gap-3 text-[var(--color-primary)]"
          aria-label="WeReact homepage"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-[var(--color-background-main)]">
            <CircleDot size={18} strokeWidth={2.5} />
          </span>
          <span className="text-xl font-black uppercase leading-none tracking-normal md:text-2xl">-WeReact-</span>
        </Link>

        <div className="hidden items-center justify-end gap-3 md:flex">
          <div className="hidden items-center gap-2 rounded-[6px] border border-[var(--color-primary)]/12 bg-white/60 px-3 py-2 lg:flex">
            <span className="h-2 w-2 animate-pulse rounded-sm bg-[var(--color-primary)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-primary)]/70">
              Marrakech / Open 24h
            </span>
          </div>
          <Link
            href={siteConfig.business.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[var(--color-primary)] px-5 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-[0_14px_40px_rgba(58,90,64,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)]"
          >
            Start project
            <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="flex justify-end md:hidden">
          <div className="relative h-10 w-10">
            <StaggeredMenu
              items={[
                { label: 'Home', ariaLabel: 'Home', link: `/${locale}/` },
                { label: 'About', ariaLabel: 'About Us', link: `/${locale}/about` },
                { label: 'Services', ariaLabel: 'Our Services', link: `/${locale}/services` },
                { label: 'Work', ariaLabel: 'Our Work', link: `/${locale}/work` },
                { label: 'Blog', ariaLabel: 'Our Blog', link: `/${locale}/blog` },
                { label: 'Contact', ariaLabel: 'Contact Us', link: `/${locale}/contact` },
              ]}
              socialItems={[
                { label: 'Instagram', link: 'https://www.instagram.com/wereact.agency' },
                { label: 'Twitter', link: 'https://twitter.com/wereact' },
                { label: 'Facebook', link: siteConfig.business.facebook },
              ]}
              className="mobile-menu-override"
              staticPosition={true}
              menuButtonColor="#3A5A40"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
