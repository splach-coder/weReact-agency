import Link from 'next/link';
import { ArrowUpRight, Gauge, Handshake, MapPin, ShieldCheck } from 'lucide-react';
import OpsBadge from '@/components/greenops/OpsBadge';
import OpsPanel from '@/components/greenops/OpsPanel';
import SectionHeader from '@/components/greenops/SectionHeader';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const stats = [
    { value: '15+', label: 'projects shipped' },
    { value: '24H', label: 'response window' },
    { value: 'MA', label: 'Morocco base' },
    { value: 'SEO', label: 'built in' },
  ];

  const principles = [
    { icon: Gauge, title: 'Performance before decoration', copy: 'Every design decision has to support speed, clarity, or conversion.' },
    { icon: MapPin, title: 'Local signals matter', copy: 'Marrakech, Morocco, service areas, contact paths, and trust cues are part of the build.' },
    { icon: Handshake, title: 'Partnership mindset', copy: 'We build systems that can grow with your business after launch.' },
    { icon: ShieldCheck, title: 'Professional trust', copy: 'Clear structure, real contact details, and polished UX make a website easier to believe.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] px-4 pb-16 pt-28 text-[var(--color-primary)] md:px-6 md:pt-32">
      <section className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <OpsPanel className="p-6 md:p-10">
          <OpsBadge tone="success">About WeReact agency</OpsBadge>
          <h1 className="mt-7 text-5xl font-black uppercase leading-[0.86] tracking-normal md:text-7xl lg:text-8xl">
            A digital studio built for useful websites.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            WeReact is a Marrakech-based website design and development agency helping businesses turn online presence into a clear, fast, search-ready system.
          </p>
        </OpsPanel>

        <OpsPanel className="p-6 md:p-8">
          <div className="grid h-full gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[6px] border border-[var(--color-primary)]/14 bg-[var(--color-background-main)] p-5">
                <p className="text-5xl font-black uppercase leading-none">{stat.value}</p>
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </OpsPanel>
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] md:mt-24">
        <SectionHeader
          eyebrow="Operating model"
          title={<>Calm design, sharp systems, measurable signals.</>}
          copy="The visual language is premium and restrained, but the work underneath is practical: structure, content, speed, SEO, and conversion."
          className="mb-10"
        />

        <div className="grid gap-5 md:grid-cols-2">
          {principles.map((item) => (
            <OpsPanel key={item.title} className="p-6 md:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-white">
                <item.icon size={23} />
              </span>
              <h2 className="mt-8 text-3xl font-black uppercase leading-none">{item.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{item.copy}</p>
            </OpsPanel>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] md:mt-24">
        <OpsPanel dark className="bg-[var(--color-primary)] p-6 text-white md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <OpsBadge tone="dark">Next signal</OpsBadge>
              <h2 className="mt-6 max-w-3xl text-4xl font-black uppercase leading-[0.9] md:text-6xl">
                Want a website that works harder than a brochure?
              </h2>
            </div>
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex w-fit items-center gap-3 rounded-[6px] bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)] transition hover:-translate-y-0.5"
            >
              Talk to WeReact
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </OpsPanel>
      </section>
    </div>
  );
}
