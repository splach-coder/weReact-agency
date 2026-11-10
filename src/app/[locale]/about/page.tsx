import type { Metadata } from 'next';
import Link from 'next/link';
import { routing } from '@/i18n/routing';
import { projects } from '@/data/projects';
import { siteConfig } from '@/config/site';
import { getAboutCopy } from '@/data/about';
import { serviceLandingPages } from '@/data/services';
import { createAboutPageJsonLd, createBreadcrumbJsonLd, createPageMetadata } from '@/lib/seo';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getAboutCopy(locale);

  return createPageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/about`,
    locale,
    keywords:
      locale === 'fr'
        ? ['studio web Marrakech', 'agence web Maroc', 'à propos WeReact']
        : ['Marrakech web studio', 'Morocco web agency', 'about WeReact'],
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const copy = getAboutCopy(locale);
  const isFr = locale === 'fr';
  const aboutJsonLd = createAboutPageJsonLd(locale, copy.title, copy.description);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: isFr ? 'Accueil' : 'Home', url: `/${locale}` },
    { name: copy.title, url: `/${locale}/about` },
  ]);
  const recentProjects = projects.slice(0, 3);
  const servicePages = serviceLandingPages.filter((page) => page.showPricing).slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] pt-28 text-[var(--color-text-main)] md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="px-6 pb-20 pt-12 md:px-16 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-mono flex items-center gap-3 text-[var(--color-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.4rem,5.2vw,5rem)] leading-[0.96]">{copy.heading}</h1>
          <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
            {copy.lead}
          </p>
        </div>
      </section>

      <section className="border-y border-[rgba(58,90,64,0.16)] bg-white px-6 py-16 md:px-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-mono text-[var(--color-primary)]">{copy.factsTitle}</p>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {copy.facts.map((fact) => (
              <div key={fact.label} className="border-t border-[rgba(58,90,64,0.16)] pt-5">
                <dt className="text-sm text-[var(--color-text-muted)]">{fact.label}</dt>
                <dd className="mt-2 font-display text-3xl leading-none text-[var(--color-text-main)]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
          {copy.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-3xl leading-tight md:text-4xl">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-5 leading-relaxed text-[var(--color-text-secondary)]">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[rgba(58,90,64,0.16)] bg-white px-6 py-16 md:px-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
          <div>
            <p className="text-mono text-[var(--color-primary)]">{copy.howWeWorkTitle}</p>
          </div>
          <ol className="grid gap-6 md:grid-cols-2">
            {copy.howWeWork.map((step, index) => (
              <li key={step} className="border-t border-[rgba(58,90,64,0.16)] pt-5">
                <div className="flex items-start gap-4">
                  <span className="text-mono text-[var(--color-accent-sage)]">0{index + 1}</span>
                  <p className="leading-snug text-[var(--color-text-main)]">{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-20 md:px-16 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-mono text-[var(--color-primary)]">{isFr ? 'Nos services' : 'What we build'}</p>
          <ul className="mt-8 grid gap-px overflow-hidden bg-[rgba(58,90,64,0.16)] md:grid-cols-3">
            {servicePages.map((page) => {
              const pageCopy = page.copy[isFr ? 'fr' : 'en'];
              return (
                <li key={page.slug} className="bg-[var(--color-background-main)] p-6 md:p-8">
                  <Link href={`/${locale}/${page.slug}`} className="group block">
                    <h2 className="text-xl font-bold leading-tight underline decoration-[rgba(58,90,64,0.3)] underline-offset-4 transition-colors group-hover:text-[var(--color-primary)]">
                      {pageCopy.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{pageCopy.description}</p>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-16 text-mono text-[var(--color-primary)]">{isFr ? 'Projets récents' : 'Recent work'}</p>
          <ul className="mt-8 grid gap-px overflow-hidden bg-[rgba(58,90,64,0.16)] md:grid-cols-3">
            {recentProjects.map((project) => (
              <li key={project.id} className="bg-[var(--color-background-main)] p-6 md:p-8">
                <Link href={`/${locale}/work/${project.id}`} className="group block">
                  <p className="text-mono text-[var(--color-primary)]">{project.category}</p>
                  <h2 className="mt-2 text-xl font-bold leading-tight underline decoration-[rgba(58,90,64,0.3)] underline-offset-4 transition-colors group-hover:text-[var(--color-primary)]">
                    {project.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{project.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[var(--color-primary-dark)] px-6 py-20 text-white md:px-16 md:py-28">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-mono text-[var(--color-accent-sage)]">WeReact agency</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-[0.96] md:text-5xl">{copy.ctaTitle}</h2>
            <p className="mt-5 text-white/72">
              {siteConfig.business.city}, {isFr ? 'Maroc' : 'Morocco'} · {siteConfig.business.email}
            </p>
          </div>
          <Link
            href={`/${locale}/contact?from=about`}
            className="inline-flex min-h-12 items-center gap-3 bg-white px-6 py-4 text-mono text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-sage)] hover:text-white"
          >
            {copy.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
