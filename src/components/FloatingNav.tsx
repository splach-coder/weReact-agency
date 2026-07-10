'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { smoothEasing } from '@/lib/animations';
import { trackContactIntent } from '@/lib/analytics';

/**
 * Floating pill navigation — the editorial reference's signature bottom-centered
 * capsule. Dark glass, logo + links + a contrasting "Start project" button.
 */
export default function FloatingNav() {
  const locale = useLocale();
  const t = useTranslations('Nav');

  const links = [
    { label: t('work'), href: `/${locale}/work` },
    { label: t('blog'), href: `/${locale}/blog` },
  ];

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.7, ease: smoothEasing }}
      className="fixed inset-x-0 bottom-5 z-[100] flex justify-center px-4"
    >
      <div className="flex items-center gap-2 rounded-full border border-white/12 bg-black/55 p-2 pl-5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <Link
          href={`/${locale}`}
          className="mr-1 text-lg font-black tracking-tighter text-white"
          aria-label="WeReact home"
        >
          -WeReact-
        </Link>

        <ul className="hidden items-center md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/75 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={`/${locale}/contact`}
          onClick={() => trackContactIntent('floating_nav_start_project', { destination: 'contact' })}
          className="rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#0d0f0c] transition-colors hover:bg-[var(--color-accent-sage)]"
        >
          {t('startProject')}
        </Link>
      </div>
    </motion.nav>
  );
}
