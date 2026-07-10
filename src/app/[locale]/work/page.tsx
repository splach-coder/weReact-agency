'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import Link from '@/components/transition/TransitionLink';
import { projects, featuredProjects } from '@/data/projects';
import BookCall from '@/components/sections/home/BookCall';

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

export default function WorkPage() {
  const t = useTranslations('Work');

  const stats = [
    { value: `${projects.length}+`, label: t('statProjects') },
    { value: 'EN / FR', label: t('statLanguages') },
    { value: 'Morocco', label: t('statBased') },
  ];

  const filters = ['Featured', 'Tourism', 'Hospitality', 'Local SEO'];

  return (
    <main className="bg-[var(--color-background-main)] text-[var(--color-text-main)]">
      <section className="relative isolate min-h-[92svh] overflow-hidden px-5 pb-10 pt-32 sm:px-8 md:px-12 lg:px-16">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_18%,rgba(163,177,138,0.34),transparent_28%),linear-gradient(135deg,#F6F6F2_0%,#F6F6F2_58%,#E3E3DC_58.2%,#E3E3DC_100%)]" />
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
          className="absolute inset-y-0 right-0 -z-10 hidden w-[46vw] origin-right bg-[var(--color-primary)] lg:block"
        />

        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <motion.p
              variants={reveal}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-mono text-[var(--color-primary)]"
            >
              {t('eyebrow')} / {projects.length.toString().padStart(2, '0')} case studies
            </motion.p>
            <motion.h1
              variants={reveal}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-5xl text-[clamp(4.2rem,15vw,14rem)] font-black uppercase leading-[0.78] tracking-tight text-[var(--color-primary)]"
            >
              Selected<br />Work
            </motion.h1>
          </div>

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl justify-self-start lg:justify-self-end"
          >
            <p className="text-xl leading-snug text-[var(--color-text-main)]">
              {t('subtitle')}
            </p>
            <div className="mt-8 grid grid-cols-3 border-y border-[rgba(58,90,64,0.22)]">
              {stats.map((stat) => (
                <div key={stat.label} className="border-r border-[rgba(58,90,64,0.22)] py-5 pr-4 last:border-r-0">
                  <div className="text-2xl font-black text-[var(--color-primary)]">{stat.value}</div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-mono text-[var(--color-primary)]/70 sm:left-8 sm:right-8 md:left-12 md:right-12 lg:left-16 lg:right-16">
          <span className="hidden md:inline">Scroll / Index</span>
          <span className="ml-auto max-w-[12rem] text-right">Digital systems for places, travel and local brands</span>
        </div>
      </section>

      <section className="relative border-t border-[rgba(58,90,64,0.16)] bg-[var(--color-background-contrast)] px-5 py-20 sm:px-8 md:px-12 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="text-mono text-[var(--color-primary)]">Project index</div>
            <p className="mt-5 max-w-[18rem] text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Featured builds shaped around discovery, trust, multilingual content and high-intent conversion paths.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {filters.map((filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-[rgba(58,90,64,0.24)] bg-[var(--color-background-main)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]"
                >
                  {filter}
                </span>
              ))}
            </div>
          </aside>

          <div className="space-y-8 md:space-y-14">
            {projects.map((project, index) => {
              const isEven = index % 2 === 0;
              const isFeatured = featuredProjects.some((featured) => featured.id === project.id);

              return (
                <motion.article
                  key={project.id}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className="group border-t border-[rgba(58,90,64,0.18)] pt-8 md:pt-10"
                >
                  <Link
                    href={`/work/${project.id}`}
                    className={`grid cursor-pointer gap-6 lg:grid-cols-12 lg:gap-10 ${isEven ? '' : 'lg:[&_.project-media]:order-2 lg:[&_.project-copy]:order-1'}`}
                  >
                    <div className="project-media min-w-0 lg:col-span-7">
                      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-accent-warm)] md:aspect-[16/9]">
                        <Image
                          src={project.image}
                          alt={`${project.title} - ${project.category}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="object-cover object-top transition duration-[900ms] ease-out group-hover:scale-[1.06] group-hover:rotate-[0.4deg]"
                          priority={index < 2}
                        />
                        <div className="absolute inset-0 bg-[var(--color-primary)]/0 mix-blend-multiply transition-colors duration-500 group-hover:bg-[var(--color-primary)]/28" />
                        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-[var(--color-primary)] px-5 py-4 text-mono text-white transition-transform duration-500 ease-out group-hover:translate-y-0">
                          <span>{t('viewCase')}</span>
                          <ArrowUpRight size={18} aria-hidden="true" />
                        </div>
                        <span className="absolute left-4 top-4 rounded-full bg-[var(--color-background-main)]/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-primary)] shadow-sm backdrop-blur-md">
                          {isFeatured ? 'Featured' : project.status}
                        </span>
                      </div>
                    </div>

                    <div className="project-copy min-w-0 flex flex-col justify-between lg:col-span-5">
                      <div>
                        <div className="flex items-center justify-between gap-4 border-b border-[rgba(58,90,64,0.18)] pb-4 text-mono text-[var(--color-text-muted)]">
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <span>{project.year}</span>
                        </div>
                        <h2 className="mt-6 max-w-full text-[clamp(2.1rem,3.9vw,4.25rem)] font-black uppercase leading-[0.84] tracking-tight text-[var(--color-text-main)] transition-colors duration-300 group-hover:text-[var(--color-primary)]">
                          {project.title}
                        </h2>
                        <p className="mt-5 text-lg leading-snug text-[var(--color-text-secondary)] md:text-xl">
                          {project.summary}
                        </p>
                      </div>

                      <div className="mt-8 space-y-6">
                        <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 text-sm">
                          <span className="text-mono text-[var(--color-text-muted)]">Domain</span>
                          <span className="truncate text-[var(--color-text-main)]">{project.domain}</span>
                          <span className="text-mono text-[var(--color-text-muted)]">Category</span>
                          <span className="text-[var(--color-text-main)]">{project.category}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.services.map((service) => (
                            <span
                              key={service}
                              className="border border-[rgba(58,90,64,0.22)] bg-[var(--color-background-main)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)] transition-colors duration-300 group-hover:border-[var(--color-primary)] group-hover:bg-[rgba(58,90,64,0.08)]"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <BookCall />
    </main>
  );
}