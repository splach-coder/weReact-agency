import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink } from 'lucide-react';
import OpsBadge from '@/components/greenops/OpsBadge';
import OpsPanel from '@/components/greenops/OpsPanel';
import ProjectVisual from '@/components/greenops/ProjectVisual';
import SectionHeader from '@/components/greenops/SectionHeader';
import { getProjectById, projects } from '@/data/projects';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({
      locale,
      id: project.id,
    }))
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] px-4 pb-16 pt-28 text-[var(--color-primary)] md:px-6 md:pt-32">
      <section className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <OpsPanel className="p-6 md:p-10">
          <Link
            href={`/${locale}/work`}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={15} />
            Back to work
          </Link>
          <div className="mt-7">
            <OpsBadge tone={project.status === 'indexed' ? 'warning' : 'success'}>{project.category}</OpsBadge>
            <h1 className="mt-7 text-5xl font-black uppercase leading-[0.86] tracking-normal md:text-7xl lg:text-8xl">
              {project.title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">{project.summary}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[6px] bg-[var(--color-primary)] px-6 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5"
            >
              Visit live site
              <ExternalLink size={16} />
            </a>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[6px] border border-[var(--color-primary)]/18 bg-white/70 px-6 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)] transition hover:-translate-y-0.5"
            >
              Build similar
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </OpsPanel>

        <ProjectVisual project={project} priority />
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] md:mt-24">
        <div className="grid gap-5 md:grid-cols-3">
          {project.metrics.map((metric) => (
            <OpsPanel key={metric.label} className="p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{metric.label}</p>
              <p className="mt-3 text-5xl font-black uppercase leading-none">{metric.value}</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{metric.detail}</p>
            </OpsPanel>
          ))}
          <OpsPanel className="p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Year</p>
            <p className="mt-3 text-5xl font-black uppercase leading-none">{project.year}</p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{project.domain}</p>
          </OpsPanel>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-[1400px] gap-6 lg:grid-cols-[1fr_0.85fr] md:mt-24">
        <OpsPanel className="p-6 md:p-8">
          <SectionHeader
            eyebrow="Case logic"
            title={<>Challenge, response, outcome.</>}
            copy="Each project is treated as a system: what needed to change, how the digital experience responded, and what useful output the client gets."
          />
          <div className="mt-10 grid gap-5">
            <div>
              <h2 className="text-2xl font-black uppercase leading-none">Challenge</h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{project.caseStudy.challenge}</p>
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase leading-none">Response</h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{project.caseStudy.response}</p>
            </div>
          </div>
        </OpsPanel>

        <OpsPanel className="p-6 md:p-8">
          <h2 className="text-2xl font-black uppercase leading-none">Outcome signals</h2>
          <div className="mt-6 grid gap-3">
            {project.caseStudy.outcome.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[6px] border border-[var(--color-primary)]/12 bg-[var(--color-background-main)] p-4">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <span className="text-sm font-bold text-[var(--color-text-secondary)]">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span key={service} className="rounded-[6px] border border-[var(--color-primary)]/12 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em]">
                {service}
              </span>
            ))}
          </div>
        </OpsPanel>
      </section>

      {project.imageFull && (
        <section className="mx-auto mt-16 max-w-[1400px] md:mt-24">
          <OpsPanel className="p-3">
            <div className="relative min-h-[520px] overflow-hidden rounded-[6px] border border-[var(--color-primary)]/12 bg-white md:min-h-[1100px]">
              <Image
                src={project.imageFull}
                alt={`${project.title} full page screenshot`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </OpsPanel>
        </section>
      )}
    </div>
  );
}
