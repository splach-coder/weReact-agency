'use client';

import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import OpsBadge from '@/components/greenops/OpsBadge';
import OpsPanel from '@/components/greenops/OpsPanel';

const contacts = [
  { icon: Mail, label: 'Email', value: siteConfig.business.email, href: `mailto:${siteConfig.business.email}` },
  { icon: Phone, label: 'Phone', value: siteConfig.business.phoneDisplay, href: `tel:${siteConfig.business.phoneTel}` },
  { icon: MapPin, label: 'Base', value: siteConfig.business.addressDisplay, href: siteConfig.business.googleMapsUrl, external: true },
];

export default function Contact() {
  return (
    <section id="contact" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <OpsPanel className="overflow-hidden bg-[var(--color-primary)] p-6 text-white md:p-10 lg:p-12" dark>
          <div className="absolute inset-0 greenops-dark-grid opacity-35" aria-hidden="true" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <OpsBadge tone="dark">Available for new projects</OpsBadge>
              <h2 className="mt-7 max-w-4xl text-5xl font-black uppercase leading-[0.86] tracking-normal md:text-7xl lg:text-8xl">
                Ready to deploy a better website?
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/68 md:text-xl">
                Send us your idea, current website, or business goal. We will map the cleanest path from digital noise to a working online system.
              </p>
            </div>

            <div className="grid gap-4">
              <Link
                href={siteConfig.business.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-20 items-center justify-between gap-5 rounded-[8px] bg-white p-5 text-[var(--color-primary)] transition hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-white">
                    <MessageCircle size={23} />
                  </span>
                  <span>
                    <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      Primary channel
                    </span>
                    <span className="mt-1 block text-2xl font-black uppercase">Start on WhatsApp</span>
                  </span>
                </span>
                <ArrowUpRight size={22} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <div className="grid gap-3">
                {contacts.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 rounded-[6px] border border-white/12 bg-white/10 p-4 transition hover:bg-white/15"
                  >
                    <item.icon size={18} className="text-white/65" />
                    <span>
                      <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-white/40">{item.label}</span>
                      <span className="block text-sm font-bold text-white/82">{item.value}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </OpsPanel>
      </div>
    </section>
  );
}
