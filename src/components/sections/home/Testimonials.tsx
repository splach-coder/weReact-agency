'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';

type Item = { quote: string; name: string; role: string; company: string; city: string };

export default function Testimonials() {
  const t = useTranslations('Home.testimonials');
  const items = t.raw('items') as Item[];

  return (
    <section className="bg-[var(--color-background-contrast)] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="mb-14 max-w-2xl">
          <p className="text-mono mb-4 text-[var(--color-accent-clay-dark)]">{t('eyebrow')}</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-main)]">
            {t('title')}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl border border-[rgba(58,90,64,0.12)] bg-[var(--color-background-main)] p-8"
            >
              <Quote className="mb-5 h-8 w-8 text-[var(--color-accent-clay)]" aria-hidden="true" />
              <blockquote className="flex-1 text-lg font-light leading-relaxed text-[var(--color-text-main)]">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-[rgba(58,90,64,0.12)] pt-5">
                <div className="font-bold text-[var(--color-text-main)]">{item.name}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {item.role}, {item.company} · {item.city}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
