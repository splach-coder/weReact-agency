'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { featuredProjects } from '@/data/projects';

export default function SelectedProjects() {
  const t = useTranslations('Home.projects');

  return (
    <section className="bg-[var(--color-background-main)] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        {/* Header */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-mono mb-4 text-[var(--color-accent-clay-dark)]">{t('eyebrow')}</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-main)]">
              {t('title')}
            </h2>
            <p className="mt-4 text-lg font-light text-[var(--color-text-secondary)]">
              {t('subtitle')}
            </p>
          </div>
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-mono text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            {t('viewAll')}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Project grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
            >
              <Link href={`/work/${project.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--color-background-contrast)] shadow-[var(--shadow-sm)] transition-shadow duration-500 group-hover:shadow-[var(--shadow-xl)]">
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.category}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-[var(--color-accent-clay)] px-4 py-2 text-mono text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {t('viewCase')}
                    <ArrowUpRight size={14} />
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-text-main)]">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {project.category}
                    </p>
                  </div>
                  <span className="text-mono text-[var(--color-text-muted)]">{project.year}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
