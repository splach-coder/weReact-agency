'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowUpRight, Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Twitter } from 'lucide-react';
import { siteConfig } from '@/config/site';
import OpsBadge from './greenops/OpsBadge';
import OpsPanel from './greenops/OpsPanel';

export default function Footer() {
  const locale = useLocale();

  const navLinks = [
    { name: 'Home', href: `/${locale}` },
    { name: 'About', href: `/${locale}/about` },
    { name: 'Services', href: `/${locale}/services` },
    { name: 'Work', href: `/${locale}/work` },
    { name: 'Blog', href: `/${locale}/blog` },
    { name: 'Contact', href: `/${locale}/contact` },
  ];

  const contactLinks = [
    { icon: MessageCircle, label: 'WhatsApp', value: siteConfig.business.phoneDisplay, href: siteConfig.business.whatsapp, external: true },
    { icon: Mail, label: 'Email', value: siteConfig.business.email, href: `mailto:${siteConfig.business.email}` },
    { icon: Phone, label: 'Phone', value: siteConfig.business.phoneDisplay, href: `tel:${siteConfig.business.phoneTel}` },
    { icon: MapPin, label: 'Location', value: siteConfig.business.addressDisplay, href: siteConfig.business.googleMapsUrl, external: true },
  ];

  return (
    <footer className="relative overflow-hidden bg-[var(--color-primary)] px-4 py-10 text-[var(--color-background-main)] md:px-6 md:py-16">
      <div className="absolute inset-0 greenops-dark-grid opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none text-[18vw] font-black uppercase leading-none tracking-normal text-white/[0.035]">
        {siteConfig.shortName}
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <OpsPanel dark className="p-6 md:p-8">
            <OpsBadge tone="dark">Transmission ready</OpsBadge>
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.9] tracking-normal md:text-6xl">
                  Launch a website that acts like a business system.
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/68 md:text-base">
                  WeReact designs and builds fast business websites, landing pages, SEO foundations, and custom digital experiences from Marrakech for Morocco and beyond.
                </p>
              </div>
              <Link
                href={siteConfig.business.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-3 rounded-[6px] bg-[var(--color-background-main)] px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Open WhatsApp
                <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </OpsPanel>

          <OpsPanel dark className="p-6 md:p-8">
            <div className="flex items-center gap-3">
              <Clock size={18} />
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">
                {siteConfig.business.hoursDisplay}
              </p>
            </div>
            <form className="mt-8 grid gap-4">
              <label className="grid gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Newsletter signal</span>
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  className="min-h-12 rounded-[6px] border border-white/15 bg-white/10 px-4 text-sm font-bold uppercase tracking-[0.12em] text-white placeholder:text-white/35 focus:border-white focus:outline-none"
                />
              </label>
              <button className="inline-flex min-h-12 items-center justify-center rounded-[6px] bg-white px-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)] transition hover:bg-[var(--color-background-main)]">
                Subscribe
              </button>
            </form>
          </OpsPanel>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <OpsPanel dark className="p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Contact grid</h3>
            <div className="mt-5 grid gap-3">
              {contactLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="group flex items-center justify-between gap-4 rounded-[6px] border border-white/10 bg-white/[0.06] p-3 transition hover:bg-white/12"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <item.icon size={17} className="shrink-0 text-white/65" />
                    <span className="min-w-0">
                      <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-white/38">{item.label}</span>
                      <span className="block truncate text-sm font-bold text-white/82">{item.value}</span>
                    </span>
                  </span>
                  <ArrowUpRight size={15} className="shrink-0 opacity-45 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </OpsPanel>

          <OpsPanel dark className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Navigation</h3>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="rounded-[6px] border border-white/10 bg-white/[0.06] px-3 py-3 text-xs font-black uppercase tracking-[0.14em] text-white/75 transition hover:bg-white hover:text-[var(--color-primary)]"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Service nodes</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {siteConfig.business.services.slice(0, 7).map((service) => (
                    <span key={service} className="rounded-[6px] border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/65">
                      {service}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex gap-4 text-white/70">
                  <Link href="https://twitter.com/wereact" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="transition hover:text-white">
                    <Twitter size={20} />
                  </Link>
                  <Link href="https://www.instagram.com/wereact.agency" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-white">
                    <Instagram size={20} />
                  </Link>
                  <Link href={siteConfig.business.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-white">
                    <Facebook size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </OpsPanel>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] font-black uppercase tracking-[0.18em] text-white/45 md:flex-row">
          <p>&copy; {siteConfig.business.legalName} 2026. All rights reserved.</p>
          <p>{siteConfig.business.city}, {siteConfig.business.country} / {siteConfig.business.openingHours}</p>
        </div>
      </div>
    </footer>
  );
}
