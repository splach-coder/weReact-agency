'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

type Item = { q: string; a: string };

export default function Faq() {
  const t = useTranslations('Home.faq');
  const items = t.raw('items') as Item[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[var(--color-background-main)] py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:px-16">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <SectionHeading index="06" eyebrow={t('eyebrow')} title={t('title')} />
          </div>
        </div>

        <div className="divide-y divide-[rgba(58,90,64,0.15)] border-y border-[rgba(58,90,64,0.15)] md:col-span-8">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  >
                    <span className="text-lg font-bold text-[var(--color-text-main)]">{item.q}</span>
                    <Plus
                      size={20}
                      aria-hidden="true"
                      className={`shrink-0 text-[var(--color-primary)] transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-base leading-relaxed text-[var(--color-text-secondary)]">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
