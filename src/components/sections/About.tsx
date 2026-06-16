'use client';

import { Handshake, PiggyBank, ShieldCheck, Zap } from 'lucide-react';
import OpsPanel from '@/components/greenops/OpsPanel';
import SectionHeader from '@/components/greenops/SectionHeader';

const principles = [
  {
    icon: PiggyBank,
    title: 'Accessible premium',
    copy: 'Sharp design and performance without agency bloat or confusing retainers.',
  },
  {
    icon: Handshake,
    title: 'Long-term partner',
    copy: 'We build relationships and scalable systems, not one-off pages that age badly.',
  },
  {
    icon: Zap,
    title: 'Performance driven',
    copy: 'Speed, structure, and conversion are part of the design, not afterthoughts.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust by default',
    copy: 'Clear content, real contact paths, local signals, and professional polish.',
  },
];

export default function About() {
  return (
    <section id="about" className="bg-[var(--color-background-contrast)] px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeader
          eyebrow="Operating principles"
          title={<>A small team with a serious delivery system.</>}
          copy="WeReact is built for businesses that need a website to become a working asset: clear, fast, local-aware, and easy to act on."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((item, index) => (
            <OpsPanel key={item.title} className="p-6">
              <div className="flex items-start justify-between gap-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-white">
                  <item.icon size={22} />
                </span>
                <span className="text-5xl font-black leading-none text-[var(--color-primary)]/8">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-black uppercase leading-none text-[var(--color-primary)]">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{item.copy}</p>
            </OpsPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
