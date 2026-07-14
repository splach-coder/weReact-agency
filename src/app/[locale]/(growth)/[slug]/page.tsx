import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getProjectById } from '@/data/projects';
import { getServiceLandingPage, serviceLandingPages } from '@/data/services';
import { GrowthCtas, GrowthContactCta } from '@/components/GrowthCtas';
import { createFaqJsonLd, createPageMetadata, createServicePageJsonLd } from '@/lib/seo';

type ServicePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceLandingPages.map((page) => ({ locale, slug: page.slug }))
  );
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getServiceLandingPage(slug);

  if (!page) return { title: 'Page not found' };

  const copy = page.copy[locale === 'fr' ? 'fr' : 'en'];
  return createPageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/${page.slug}`,
    locale,
    keywords: [...page.keywords, page.primaryKeyword],
  });
}

export default async function ServiceLandingPage({ params }: ServicePageProps) {
  const { locale, slug } = await params;
  const page = getServiceLandingPage(slug);

  if (!page) notFound();

  const copy = page.copy[locale === 'fr' ? 'fr' : 'en'];
  const projectCards = page.relatedProjectIds
    .map((projectId) => getProjectById(projectId))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));
  const contactHref = `/${locale}/contact`;
  const serviceJsonLd = createServicePageJsonLd(page, locale);
  const faqJsonLd = createFaqJsonLd(copy.faqs);

  return (
    <main className="min-h-screen bg-[var(--color-background-main)] pt-28 text-[var(--color-text-main)] md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="px-6 pb-20 pt-12 md:px-16 md:pb-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_0.15fr] lg:gap-16">
          <div>
            <p className="text-mono flex items-center gap-3 text-[var(--color-primary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" aria-hidden="true" />
              {copy.eyebrow}
            </p>
            <h1 className="mt-7 max-w-5xl font-display text-[clamp(2.55rem,5.7vw,5.8rem)] leading-[0.94] text-[var(--color-text-main)]">
              {copy.heading}
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
              {copy.lead}
            </p>
            <GrowthCtas cta={copy.cta} contactHref={contactHref} locale={locale} slug={page.slug} />
            <p className="mt-4 text-sm text-[var(--color-text-muted)]">{copy.ctaNote}</p>
          </div>
          <p className="self-end border-l border-[rgba(58,90,64,0.18)] pl-5 text-sm leading-relaxed text-[var(--color-text-secondary)] lg:mb-3">
            {locale === 'fr' ? 'Marrakech · Maroc · Projets internationaux' : 'Marrakech · Morocco · International projects'}
          </p>
        </div>
      </section>

      <section className="border-y border-[rgba(58,90,64,0.16)] bg-white px-6 py-16 md:px-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
          <div>
            <p className="text-mono text-[var(--color-primary)]">{copy.outcomesTitle}</p>
          </div>
          <ul className="grid gap-6 md:grid-cols-2">
            {copy.outcomes.map((outcome, index) => (
              <li key={outcome} className="border-t border-[rgba(58,90,64,0.16)] pt-5">
                <div className="flex items-start gap-4">
                  <span className="text-mono text-[var(--color-accent-sage)]">0{index + 1}</span>
                  <p className="text-lg leading-snug text-[var(--color-text-main)]">{outcome}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-mono text-[var(--color-primary)]">{copy.proofTitle}</p>
            <p className="mt-5 text-xl font-light leading-relaxed text-[var(--color-text-secondary)] md:text-2xl">{copy.proof}</p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden bg-[rgba(58,90,64,0.16)] md:grid-cols-3">
            {projectCards.map((project) => (
              <Link key={project.id} href={`/${locale}/work/${project.id}`} className="group bg-[var(--color-background-main)] p-5 transition-colors hover:bg-white md:p-6">
                <div className="relative aspect-[5/3] overflow-hidden bg-[var(--color-accent-warm)]">
                  <Image src={project.image} alt={`${project.title} web design case study`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <p className="mt-5 text-mono text-[var(--color-primary)]">{project.category}</p>
                <h2 className="mt-2 text-2xl font-bold leading-tight text-[var(--color-text-main)]">{project.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{project.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-primary-dark)] px-6 py-20 text-white md:px-16 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.36fr_0.64fr] lg:gap-16">
          <div>
            <p className="text-mono text-[var(--color-accent-sage)]">FAQ</p>
            <h2 className="mt-5 max-w-sm font-display text-4xl leading-[0.96] md:text-5xl">
              {locale === 'fr' ? 'Les questions avant de démarrer.' : 'Questions before we start.'}
            </h2>
          </div>
          <div className="divide-y divide-white/20">
            {copy.faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                  {faq.question}
                  <Check size={18} className="shrink-0 text-[var(--color-accent-sage)] transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="max-w-2xl pt-4 leading-relaxed text-white/72">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-16 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-t border-[rgba(58,90,64,0.18)] pt-10 md:flex-row md:items-end">
          <div>
            <p className="text-mono text-[var(--color-primary)]">WeReact agency</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[0.96] md:text-5xl">
              {locale === 'fr' ? 'Votre prochaine demande peut commencer ici.' : 'Your next enquiry can start here.'}
            </h2>
          </div>
          <GrowthContactCta cta={copy.cta} contactHref={contactHref} slug={page.slug} />
        </div>
      </section>
    </main>
  );
}
