'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowUpRight, Code2, FileText, LayoutDashboard, RefreshCw, Search, Smartphone } from 'lucide-react';
import OpsPanel from '@/components/greenops/OpsPanel';
import SectionHeader from '@/components/greenops/SectionHeader';

const services = [
  {
    icon: LayoutDashboard,
    title: 'Business websites',
    copy: 'Structured websites that explain, prove, and convert.',
    output: 'Brand system + pages',
    span: 'md:col-span-2',
  },
  {
    icon: FileText,
    title: 'Landing pages',
    copy: 'Campaign pages with a clean offer and fast path to action.',
    output: 'Lead capture',
    span: '',
  },
  {
    icon: RefreshCw,
    title: 'Redesigns',
    copy: 'Turn slow, outdated pages into a modern digital asset.',
    output: 'Refresh protocol',
    span: '',
  },
  {
    icon: Smartphone,
    title: 'Mobile optimization',
    copy: 'Interfaces built for tourists, local buyers, and busy decision makers.',
    output: 'Responsive QA',
    span: 'md:col-span-2',
  },
  {
    icon: Search,
    title: 'SEO foundations',
    copy: 'Metadata, structure, speed, and local signals from the start.',
    output: 'Search base',
    span: '',
  },
  {
    icon: Code2,
    title: 'Custom development',
    copy: 'Special workflows, content systems, and integrations when the project needs more.',
    output: 'Custom node',
    span: '',
  },
];

export default function Services() {
  const locale = useLocale();

  return (
    <section id="services" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Service matrix"
            title={<>Build blocks for a stronger online presence.</>}
            copy="Pick one service or combine them into a complete launch system."
          />
          <Link
            href={`/${locale}/services`}
            className="group inline-flex w-fit items-center gap-3 rounded-[6px] bg-[var(--color-primary)] px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5"
          >
            Explore services
            <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <OpsPanel key={service.title} className={`min-h-[260px] p-6 ${service.span}`}>
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-white">
                    <service.icon size={23} />
                  </span>
                  <span className="rounded-[6px] border border-[var(--color-primary)]/14 bg-[var(--color-background-main)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-primary)]">
                    {service.output}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase leading-none text-[var(--color-primary)]">{service.title}</h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-text-secondary)]">{service.copy}</p>
                </div>
              </div>
            </OpsPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
