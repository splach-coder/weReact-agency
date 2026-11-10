import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getProjectById } from '@/data/projects';
import { getServiceLandingPage, serviceLandingPages, servicePricing } from '@/data/services';
import { audienceLandingPages, getAudienceLandingPage } from '@/data/audiences';
import { GrowthCtas, GrowthContactCta } from '@/components/GrowthCtas';
import { CalBookingSection } from '@/components/CalBookingSection';
import { createBreadcrumbJsonLd, createFaqJsonLd, createPageMetadata, createPricingJsonLd, createServicePageJsonLd } from '@/lib/seo';
import { siteConfig } from '@/config/site';
import { blogPosts, getLocalizedPost } from '@/data/blog';

type RelatedLink = { href: string; title: string; description: string };

const linkablePages = [...serviceLandingPages, ...audienceLandingPages];

/** Internal links to other growth pages, skipping the current page and unknown slugs. */
function getRelatedPages(slugs: readonly string[], currentSlug: string, locale: string): RelatedLink[] {
  const language = locale === 'fr' ? 'fr' : 'en';

  return slugs
    .filter((slug) => slug !== currentSlug)
    .map((slug) => {
      const page = linkablePages.find((candidate) => candidate.slug === slug);
      if (!page) return null;
      const copy = page.copy[language];
      return { href: `/${locale}/${page.slug}`, title: copy.title, description: copy.description };
    })
    .filter((link): link is RelatedLink => link !== null);
}

/** Internal links to related blog guides, localized. */
function getRelatedPosts(slugs: readonly string[], locale: string): RelatedLink[] {
  return slugs
    .map((slug) => {
      const post = blogPosts.find((candidate) => candidate.slug === slug);
      if (!post) return null;
      const localized = getLocalizedPost(post, locale);
      return { href: `/${locale}/blog/${post.slug}`, title: localized.title, description: localized.excerpt };
    })
    .filter((link): link is RelatedLink => link !== null);
}

const growthLandingPages = [...serviceLandingPages, ...audienceLandingPages];
const getGrowthLandingPage = (slug: string) => getServiceLandingPage(slug) ?? getAudienceLandingPage(slug);

type ServicePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    growthLandingPages.map((page) => ({ locale, slug: page.slug }))
  );
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getGrowthLandingPage(slug);

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
  const page = getGrowthLandingPage(slug);

  if (!page) notFound();

  const language = locale === 'fr' ? 'fr' : 'en';
  const copy = page.copy[language];
  const projectCards = page.relatedProjectIds
    .map((projectId) => getProjectById(projectId))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));
  const contactHref = `/${locale}/contact?from=${page.slug}`;
  const pricing = 'showPricing' in page && page.showPricing ? servicePricing[language] : null;
  const relatedPages = getRelatedPages(
    'relatedPageSlugs' in page ? page.relatedPageSlugs : page.relatedServiceSlugs,
    page.slug,
    locale,
  );
  const relatedPosts = getRelatedPosts(page.relatedPostSlugs, locale);
  const relatedLabels =
    locale === 'fr'
      ? { pages: 'À explorer aussi', posts: 'Guides à lire' }
      : { pages: 'Explore next', posts: 'Guides to read' };
  const serviceJsonLd = createServicePageJsonLd(page, locale);
  const faqJsonLd = createFaqJsonLd(copy.faqs);
  const pricingJsonLd = pricing
    ? createPricingJsonLd(pricing.tiers, locale, `${siteConfig.url}/${locale}/${page.slug}`)
    : null;
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: locale === 'fr' ? 'Accueil' : 'Home', url: `/${locale}` },
    { name: copy.title, url: `/${locale}/${page.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] pt-28 text-[var(--color-text-main)] md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {pricingJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }} />
      )}

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

      {pricing && (
        <section className="px-6 py-20 md:px-16 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-mono text-[var(--color-primary)]">{pricing.title}</p>
              <p className="mt-5 text-xl font-light leading-relaxed text-[var(--color-text-secondary)] md:text-2xl">{pricing.lead}</p>
            </div>
            <dl className="mt-12 grid gap-px overflow-hidden bg-[rgba(58,90,64,0.16)] md:grid-cols-3">
              {pricing.tiers.map((tier) => (
                <div key={tier.name} className="bg-white p-6 md:p-8">
                  <dt className="text-mono text-[var(--color-primary)]">{tier.name}</dt>
                  <dd className="mt-4">
                    <p className="font-display text-4xl leading-none text-[var(--color-text-main)]">
                      {tier.fromMad === null
                        ? language === 'fr' ? 'Sur devis' : 'On quote'
                        : `${language === 'fr' ? 'dès ' : 'from '}${tier.fromMad.toLocaleString(language === 'fr' ? 'fr-MA' : 'en-US')} MAD`}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{tier.note}</p>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)]">{pricing.footnote}</p>
          </div>
        </section>
      )}

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

      {(relatedPages.length > 0 || relatedPosts.length > 0) && (
        <section className="border-t border-[rgba(58,90,64,0.16)] bg-white px-6 py-16 md:px-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
            {relatedPages.length > 0 && (
              <div>
                <p className="text-mono text-[var(--color-primary)]">{relatedLabels.pages}</p>
                <ul className="mt-6 space-y-5">
                  {relatedPages.map((link) => (
                    <li key={link.href} className="border-t border-[rgba(58,90,64,0.16)] pt-5">
                      <Link href={link.href} className="group block">
                        <h2 className="text-lg font-bold leading-tight text-[var(--color-text-main)] underline decoration-[rgba(58,90,64,0.3)] underline-offset-4 transition-colors group-hover:text-[var(--color-primary)]">
                          {link.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{link.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedPosts.length > 0 && (
              <div>
                <p className="text-mono text-[var(--color-primary)]">{relatedLabels.posts}</p>
                <ul className="mt-6 space-y-5">
                  {relatedPosts.map((link) => (
                    <li key={link.href} className="border-t border-[rgba(58,90,64,0.16)] pt-5">
                      <Link href={link.href} className="group block">
                        <h2 className="text-lg font-bold leading-tight text-[var(--color-text-main)] underline decoration-[rgba(58,90,64,0.3)] underline-offset-4 transition-colors group-hover:text-[var(--color-primary)]">
                          {link.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{link.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <CalBookingSection source={page.slug} locale={locale} />

      <section className="px-6 pb-16 md:px-16 md:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-t border-[rgba(58,90,64,0.18)] pt-10 md:flex-row md:items-end">
          <div>
            <p className="text-mono text-[var(--color-primary)]">WeReact agency</p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[0.96] md:text-5xl">
              {locale === 'fr' ? 'Vous préférez écrire ?' : 'Prefer to write instead?'}
            </h2>
          </div>
          <GrowthContactCta cta={copy.cta} contactHref={contactHref} slug={page.slug} />
        </div>
      </section>
    </div>
  );
}
