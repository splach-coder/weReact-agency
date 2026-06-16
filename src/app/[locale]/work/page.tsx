import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ProjectVisual from '@/components/greenops/ProjectVisual';
import OpsBadge from '@/components/greenops/OpsBadge';
import OpsPanel from '@/components/greenops/OpsPanel';
import SectionHeader from '@/components/greenops/SectionHeader';
import { projects } from '@/data/projects';

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] px-4 pb-16 pt-28 text-[var(--color-primary)] md:px-6 md:pt-32">
      <section className="mx-auto max-w-[1400px]">
        <OpsPanel className="p-6 md:p-10">
          <OpsBadge tone="success">Work index / Showcase</OpsBadge>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <h1 className="text-5xl font-black uppercase leading-[0.86] tracking-normal md:text-7xl lg:text-8xl">
                Website systems already in motion.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
                Browse live projects, tourism platforms, hospitality websites, local brands, and generated GreenOps domain showcases.
              </p>
            </div>
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex w-fit items-center gap-3 rounded-[6px] bg-[var(--color-primary)] px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5"
            >
              Build yours
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </OpsPanel>
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] md:mt-24">
        <SectionHeader
          eyebrow="Project nodes"
          title={<>Real work, domain systems, and local search direction.</>}
          copy="Every tile is structured as a business signal: category, domain, summary, and operating metrics."
          className="mb-10"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectVisual
              key={project.id}
              project={project}
              href={`/${locale}/work/${project.id}`}
              priority={index < 2}
              className={index === 0 || index === 4 ? 'xl:col-span-2' : ''}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
