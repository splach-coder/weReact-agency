import Link from 'next/link';
import { ArrowUpRight, Code2, FileText, Globe2, LayoutDashboard, RefreshCw, Search, Smartphone } from 'lucide-react';
import OpsBadge from '@/components/greenops/OpsBadge';
import OpsPanel from '@/components/greenops/OpsPanel';
import SectionHeader from '@/components/greenops/SectionHeader';

const services = [
  {
    icon: LayoutDashboard,
    title: 'Business websites',
    copy: 'Professional websites for local businesses, service companies, and brands that need trust and clear conversion.',
    details: ['Custom structure', 'Offer clarity', 'Fast pages', 'Contact paths'],
  },
  {
    icon: Globe2,
    title: 'Tourism and hospitality websites',
    copy: 'Destination, hotel, tour, and experience websites built for mobile travelers and international search.',
    details: ['Travel UX', 'Local trust signals', 'Inquiry flow', 'Image-led pages'],
  },
  {
    icon: FileText,
    title: 'Landing pages',
    copy: 'Focused campaign pages for offers, launches, lead generation, and paid or organic traffic.',
    details: ['Single goal', 'Lead capture', 'Proof blocks', 'Fast delivery'],
  },
  {
    icon: RefreshCw,
    title: 'Website redesigns',
    copy: 'Modernize slow or outdated websites without losing the business knowledge already inside them.',
    details: ['UX audit', 'Content cleanup', 'Performance pass', 'Modern interface'],
  },
  {
    icon: Smartphone,
    title: 'Mobile optimization',
    copy: 'Responsive interfaces for customers browsing from phones in Marrakech, Morocco, and abroad.',
    details: ['Touch targets', 'Responsive sections', 'Mobile speed', 'QA pass'],
  },
  {
    icon: Search,
    title: 'SEO foundations',
    copy: 'Technical and content structure that helps Google understand who you serve and where you operate.',
    details: ['Metadata', 'Schema', 'Sitemap', 'Local signals'],
  },
  {
    icon: Code2,
    title: 'Custom development',
    copy: 'Custom components, content systems, and integrations for websites that need more than static pages.',
    details: ['Next.js builds', 'Data structures', 'Integrations', 'Maintenance path'],
  },
];

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] px-4 pb-16 pt-28 text-[var(--color-primary)] md:px-6 md:pt-32">
      <section className="mx-auto max-w-[1400px]">
        <OpsPanel className="p-6 md:p-10">
          <OpsBadge tone="success">Services / Website systems</OpsBadge>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-5xl font-black uppercase leading-[0.86] tracking-normal md:text-7xl lg:text-8xl">
                Web design services for businesses that need traction.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
                From Marrakech business websites to Morocco tourism platforms, WeReact builds digital systems with design, performance, and SEO foundations working together.
              </p>
            </div>
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex w-fit items-center gap-3 rounded-[6px] bg-[var(--color-primary)] px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5"
            >
              Request a quote
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </OpsPanel>
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] md:mt-24">
        <SectionHeader
          eyebrow="Service matrix"
          title={<>Choose the node your business needs next.</>}
          copy="Each service can stand alone or connect into a full launch system."
          className="mb-10"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <OpsPanel key={service.title} className={index === 1 ? 'p-6 xl:col-span-2' : 'p-6'}>
              <div className="flex items-start justify-between gap-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-white">
                  <service.icon size={23} />
                </span>
                <span className="text-5xl font-black leading-none text-[var(--color-primary)]/8">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h2 className="mt-8 text-3xl font-black uppercase leading-none">{service.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{service.copy}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {service.details.map((detail) => (
                  <span key={detail} className="rounded-[6px] border border-[var(--color-primary)]/12 bg-[var(--color-background-main)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em]">
                    {detail}
                  </span>
                ))}
              </div>
            </OpsPanel>
          ))}
        </div>
      </section>
    </div>
  );
}
