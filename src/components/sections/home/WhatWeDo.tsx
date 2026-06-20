'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Globe, Rocket, Search, ShoppingBag, Languages, LifeBuoy } from 'lucide-react';

const ICONS = [Globe, Rocket, Search, ShoppingBag, Languages, LifeBuoy];

type ServiceItem = { title: string; text: string };

export default function WhatWeDo() {
  const t = useTranslations('Home.services');
  const items = t.raw('items') as ServiceItem[];

  return (
    <section className="bg-[var(--color-background-contrast)] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <div className="mb-14 max-w-2xl">
          <p className="text-mono mb-4 text-[var(--color-accent-clay-dark)]">{t('eyebrow')}</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-main)]">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg font-light text-[var(--color-text-secondary)]">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-[rgba(58,90,64,0.12)] bg-[rgba(58,90,64,0.12)] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
                className="group bg-[var(--color-background-contrast)] p-8 transition-colors duration-300 hover:bg-[var(--color-background-main)]"
              >
                <Icon
                  className="mb-5 h-7 w-7 text-[var(--color-primary)] transition-colors group-hover:text-[var(--color-accent-clay)]"
                  aria-hidden="true"
                />
                <h3 className="mb-2 text-lg font-bold text-[var(--color-text-main)]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
