'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CheckCircle2, Gauge, Globe2 } from 'lucide-react';
import { siteConfig } from '@/config/site';
import OpsBadge from '@/components/greenops/OpsBadge';
import OpsPanel from '@/components/greenops/OpsPanel';

const metrics = [
  { value: '15+', label: 'Launches shipped' },
  { value: '24H', label: 'Response window' },
  { value: 'MA+', label: 'Morocco and global' },
];

const nodes = [
  'Business websites',
  'Landing pages',
  'Tourism platforms',
  'SEO foundations',
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-14 pt-28 text-[var(--color-primary)] md:px-6 md:pt-32">
      <div className="absolute inset-0 greenops-grid opacity-50" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] max-w-[1400px] gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between gap-8 rounded-[8px] border border-[var(--color-primary)]/14 bg-[var(--color-background-main)]/70 p-5 backdrop-blur-sm md:p-8 lg:p-10"
        >
          <div>
            <OpsBadge tone="success">Marrakech website command center</OpsBadge>
            <h1 className="mt-7 max-w-5xl text-5xl font-black uppercase leading-[0.86] tracking-normal text-[var(--color-primary)] md:text-7xl lg:text-[6.7rem]">
              Websites built like growth systems.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
              WeReact designs fast, sharp, SEO-ready business websites for Marrakech, Morocco, and ambitious brands that need their digital presence to perform.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={siteConfig.business.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-[6px] bg-[var(--color-primary)] px-7 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)]"
              >
                Start a project
                <ArrowUpRight size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="#work"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[6px] border border-[var(--color-primary)]/18 bg-white/70 px-7 text-sm font-black uppercase tracking-[0.14em] text-[var(--color-primary)] transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]"
              >
                View systems
                <ArrowRight size={17} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-[6px] border border-[var(--color-primary)]/14 bg-white/60 p-3">
                  <p className="text-2xl font-black uppercase leading-none md:text-3xl">{metric.value}</p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-4"
        >
          <OpsPanel className="min-h-[360px] p-3 md:p-4">
            <div className="relative aspect-[1.55/1] overflow-hidden rounded-[6px] border border-[var(--color-primary)]/12">
              <Image
                src="/images/greenops/hero-command.webp"
                alt="WeReact GreenOps command center interface"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </OpsPanel>

          <div className="grid gap-4 md:grid-cols-2">
            <OpsPanel className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-white">
                  <Gauge size={21} />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">System status</p>
                  <p className="mt-1 text-xl font-black uppercase">Performance first</p>
                </div>
              </div>
            </OpsPanel>
            <OpsPanel className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-white">
                  <Globe2 size={21} />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Coverage</p>
                  <p className="mt-1 text-xl font-black uppercase">Local + global</p>
                </div>
              </div>
            </OpsPanel>
          </div>

          <OpsPanel className="p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {nodes.map((node) => (
                <div key={node} className="flex items-center gap-3 rounded-[6px] border border-[var(--color-primary)]/12 bg-[var(--color-background-main)] p-3">
                  <CheckCircle2 size={17} className="text-[var(--color-primary)]" />
                  <span className="text-xs font-black uppercase tracking-[0.12em]">{node}</span>
                </div>
              ))}
            </div>
          </OpsPanel>
        </motion.div>
      </div>
    </section>
  );
}
