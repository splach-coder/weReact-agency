'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, MousePointerClick, SearchX, TimerReset } from 'lucide-react';
import OpsPanel from '@/components/greenops/OpsPanel';
import SectionHeader from '@/components/greenops/SectionHeader';

const diagnostics = [
  {
    icon: SearchX,
    label: 'Visibility fault',
    title: 'Invisible in search',
    detail: 'Your offer exists, but Google and local customers cannot read the signal clearly.',
    severity: 'High',
  },
  {
    icon: TimerReset,
    label: 'Speed drag',
    title: 'Slow first impression',
    detail: 'Heavy pages cost attention before your visitor understands why you matter.',
    severity: 'Medium',
  },
  {
    icon: MousePointerClick,
    label: 'Conversion leak',
    title: 'No clear next action',
    detail: 'Visitors scan, hesitate, and leave because the path to contact is buried.',
    severity: 'High',
  },
];

export default function Problem() {
  return (
    <section className="relative overflow-hidden px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <SectionHeader
          eyebrow="Diagnostic layer"
          title={<>Most websites fail before the first conversation.</>}
          copy="A website is not just a page. It is your public operating system for trust, search, speed, and conversion."
        />

        <div className="grid gap-4">
          {diagnostics.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <OpsPanel className="p-5 md:p-6">
                <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-white">
                    <item.icon size={25} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      {item.label}
                    </p>
                    <h3 className="mt-2 text-2xl font-black uppercase leading-none text-[var(--color-primary)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {item.detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-[6px] border border-[var(--color-primary)]/14 bg-[var(--color-background-main)] px-3 py-2">
                    <AlertTriangle size={15} />
                    <span className="text-[10px] font-black uppercase tracking-[0.14em]">{item.severity}</span>
                  </div>
                </div>
              </OpsPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
