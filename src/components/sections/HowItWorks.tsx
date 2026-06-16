'use client';

import { motion } from 'framer-motion';
import { ClipboardList, DraftingCompass, Hammer, Rocket, SearchCheck } from 'lucide-react';
import OpsPanel from '@/components/greenops/OpsPanel';
import SectionHeader from '@/components/greenops/SectionHeader';

const steps = [
  { icon: SearchCheck, title: 'Discover', copy: 'Goals, audience, local search intent, and business constraints.' },
  { icon: ClipboardList, title: 'Map', copy: 'Pages, messaging hierarchy, conversion routes, and proof points.' },
  { icon: DraftingCompass, title: 'Design', copy: 'High-density interface panels with responsive UX and brand clarity.' },
  { icon: Hammer, title: 'Build', copy: 'Fast Next.js implementation, structured metadata, and production polish.' },
  { icon: Rocket, title: 'Launch', copy: 'Final QA, indexing support, handoff, and optimization path.' },
];

export default function HowItWorks() {
  return (
    <section className="bg-[var(--color-primary)] px-4 py-16 text-white md:px-6 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          dark
          align="center"
          eyebrow="Launch protocol"
          title={<>From first signal to live system.</>}
          copy="A clear process keeps the work fast, visible, and useful from day one."
          className="mb-12"
        />

        <div className="grid gap-4 lg:grid-cols-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
            >
              <OpsPanel dark className="h-full p-5">
                <div className="flex h-full flex-col justify-between gap-10">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-white text-[var(--color-primary)]">
                        <step.icon size={22} />
                      </span>
                      <span className="text-5xl font-black leading-none text-white/10">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="mt-8 text-2xl font-black uppercase leading-none">{step.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/65">{step.copy}</p>
                  </div>
                  <div className="h-1 rounded-sm bg-white/12">
                    <div className="h-full rounded-sm bg-white" style={{ width: `${(index + 1) * 20}%` }} />
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
