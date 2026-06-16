import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/data/projects';
import OpsBadge from './OpsBadge';

type ProjectVisualProps = {
  project: Project;
  href?: string;
  priority?: boolean;
  className?: string;
};

export default function ProjectVisual({ project, href, priority = false, className = '' }: ProjectVisualProps) {
  const card = (
    <article
      className={`group relative flex h-full min-h-[420px] min-w-0 flex-col overflow-hidden rounded-[8px] border border-[var(--color-primary)]/15 bg-white text-[var(--color-primary)] shadow-[0_20px_70px_rgba(58,90,64,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/35 ${className}`.trim()}
    >
      <div className="relative min-h-[240px] flex-1 overflow-hidden bg-[var(--color-background-main)]">
        <Image
          src={project.image}
          alt={`${project.title} ${project.category} visual`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/55 via-transparent to-transparent" />
        <div className="absolute left-4 top-4">
          <OpsBadge tone={project.status === 'indexed' ? 'warning' : 'dark'}>
            {project.status === 'indexed' ? 'Domain node' : 'Case study'}
          </OpsBadge>
        </div>
      </div>
      <div className="grid gap-5 border-t border-[var(--color-primary)]/12 p-5 md:p-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              {project.domain}
            </p>
            <h3 className="mt-2 break-words text-2xl font-black uppercase leading-none tracking-normal">
              {project.title}
            </h3>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-white transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{project.summary}</p>
        <div className="grid grid-cols-2 gap-3">
          {project.metrics.slice(0, 2).map((metric) => (
            <div key={metric.label} className="rounded-[6px] border border-[var(--color-primary)]/12 bg-[var(--color-background-main)] p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                {metric.label}
              </p>
              <p className="mt-1 text-xl font-black uppercase">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );

  if (!href) {
    return card;
  }

  return (
    <Link href={href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
      {card}
    </Link>
  );
}
