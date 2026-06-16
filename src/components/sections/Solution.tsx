'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Layers3, Radar, Rocket, ShieldCheck } from 'lucide-react';
import OpsPanel from '@/components/greenops/OpsPanel';
import SectionHeader from '@/components/greenops/SectionHeader';

const response = [
  { icon: Radar, title: 'Map the signal', copy: 'We clarify your offer, audience, search intent, and conversion path.' },
  { icon: Layers3, title: 'Design the system', copy: 'We shape pages, content blocks, and UI panels around business outcomes.' },
  { icon: Rocket, title: 'Launch clean', copy: 'We build fast, responsive, structured websites with SEO foundations included.' },
  { icon: ShieldCheck, title: 'Keep it useful', copy: 'We leave you with a scalable digital base and clear support paths.' },
];

export default function Solution() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-primary)] px-4 py-16 text-white md:px-6 md:py-24">
      <div className="absolute inset-0 greenops-dark-grid opacity-40" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <SectionHeader
          dark
          eyebrow="Response protocol"
          title={<>That is where WeReact takes over.</>}
          copy="We turn vague online presence into a focused system for credibility, speed, search visibility, and action."
        />

        <div className="grid gap-4">
          {response.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <OpsPanel dark className="p-5 md:p-6">
                <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[6px] bg-white text-[var(--color-primary)]">
                    <item.icon size={25} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                      Step {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 text-2xl font-black uppercase leading-none text-white">{item.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">{item.copy}</p>
                  </div>
                  <ArrowRight className="hidden text-white/45 md:block" />
                </div>
              </OpsPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
