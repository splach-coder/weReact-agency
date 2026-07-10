'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, MessageCircle, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from '@/components/transition/TransitionLink';
import { siteConfig } from '@/config/site';
import { smoothEasing } from '@/lib/animations';
import { trackLead } from '@/lib/analytics';

/**
 * Footer — inherits the exo-ape structure: a big editorial statement over a
 * hairline, a row of oversized nav links + connect + newsletter, and a
 * copyright line, all on a deep Atlas-Green field with a ghost wordmark.
 */
const wrap = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEasing } },
};
const mask = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: smoothEasing } },
};

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const year = 2026;

  const navLinks = [
    { name: tNav('work'), href: '/work' },
    { name: tNav('blog'), href: '/blog' },
    { name: tNav('contact'), href: '/contact' },
  ];

  const socials = [
    { label: 'Instagram', href: siteConfig.business.sameAs[0], icon: Instagram },
    { label: 'Facebook', href: siteConfig.business.facebook, icon: Facebook },
    { label: 'Twitter', href: siteConfig.business.sameAs[1], icon: Twitter },
    { label: 'WhatsApp', href: siteConfig.business.whatsapp, icon: MessageCircle },
    { label: 'Email', href: `mailto:${siteConfig.business.email}`, icon: Mail },
  ];

  return (
    <footer className="relative overflow-hidden bg-[var(--color-primary-dark)] text-[var(--color-accent-warm)]">
      {/* Ghost wordmark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[4vw] left-1/2 -translate-x-1/2 select-none text-[26vw] font-black leading-none tracking-tighter text-white opacity-[0.04]"
      >
        ·wereact·
      </span>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-16">
        {/* Statement */}
        <motion.div
          variants={wrap}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="border-b border-white/15 py-16 md:py-24"
        >
          <span className="block max-w-3xl overflow-hidden pb-[0.12em]">
            <motion.h2
              variants={mask}
              className="font-display text-4xl leading-[1.05] tracking-tight text-white md:text-6xl"
            >
              {t('statement')}
            </motion.h2>
          </span>
          <motion.p variants={fade} className="mt-8 max-w-md text-white/55">
            {t('tagline')}
          </motion.p>
        </motion.div>

        {/* Links / connect / newsletter */}
        <div className="grid gap-14 py-16 md:grid-cols-12">
          {/* Explore — oversized nav links */}
          <nav className="md:col-span-6">
            <p className="text-mono mb-7 text-white/40">{t('explore')}</p>
            <ul className="flex flex-col gap-1.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block text-3xl font-black uppercase leading-tight tracking-tight text-[var(--color-accent-warm)] transition-colors hover:text-white md:text-4xl"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="md:col-span-3">
            <p className="text-mono mb-7 text-white/40">{t('connect')}</p>
            <ul className="flex flex-col gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={() => {
                      if (s.label === 'WhatsApp') trackLead('whatsapp', { page: 'footer', location: 'footer_connect' });
                      if (s.label === 'Email') trackLead('email', { page: 'footer', location: 'footer_connect' });
                    }}
                    className="group inline-flex items-center gap-3 text-white/70 transition-colors hover:text-white"
                  >
                    <s.icon size={16} aria-hidden="true" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <p className="text-mono mb-7 text-white/40">{t('newsletterTitle')}</p>
            <p className="mb-6 text-sm text-white/55">{t('newsletterText')}</p>
            <form className="flex flex-col gap-4">
              <label htmlFor="footer-email" className="sr-only">
                {t('emailPlaceholder')}
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder={t('emailPlaceholder')}
                className="text-mono border-b border-white/30 bg-transparent py-3 text-sm text-white placeholder-white/40 transition-colors focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-fit bg-[var(--color-accent-warm)] px-7 py-3 text-mono text-[var(--color-primary-dark)] transition-colors hover:bg-white"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-mono flex flex-col gap-2 border-t border-white/15 py-8 text-white/45 md:flex-row md:items-center md:justify-between">
          <span>© WeReact {year} — {t('copyright')}</span>
          <span>Marrakech · Morocco</span>
        </div>
      </div>
    </footer>
  );
}
