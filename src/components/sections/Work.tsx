'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import ProjectVisual from '@/components/greenops/ProjectVisual';
import SectionHeader from '@/components/greenops/SectionHeader';
import { projects } from '@/data/projects';

export default function Work() {
  const locale = useLocale();

  return (
    <section id="work" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Showcase nodes"
            title={<>Websites, platforms, and local search systems.</>}
            copy="A mix of live projects, destination platforms, and domain systems shaped for tourism, hospitality, local businesses, and growth."
          />
          <Link
            href={`/${locale}/work`}
            className="group inline-flex w-fit items-center gap-3 rounded-[6px] bg-[var(--color-primary)] px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5"
          >
            Full work index
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectVisual
              key={project.id}
              project={project}
              href={`/${locale}/work/${project.id}`}
              priority={index < 2}
              className={index === 0 ? 'xl:col-span-2' : ''}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
