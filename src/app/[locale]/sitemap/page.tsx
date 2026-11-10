import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ENTITY_IDS, createBreadcrumbJsonLd, createPageMetadata, createWebPageJsonLd } from '@/lib/seo';
import { getContentLastModified, getSitemapSections, pageTitles, toLanguage } from '@/lib/site-index';

type SitemapPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function getCopy(locale: string) {
  const language = toLanguage(locale);
  return language === 'fr'
    ? {
        title: pageTitles.sitemap.fr,
        description: 'Plan du site WeReact : toutes les pages services, les parcours par audience, les études de cas, les guides et les pages de l’agence.',
        lead: 'Toutes les pages du site, regroupées par sujet. La liste est générée à partir des données du site : une nouvelle page y apparaît automatiquement.',
        pages: (count: number) => `${count} pages`,
        xml: 'Version XML pour les moteurs de recherche',
      }
    : {
        title: pageTitles.sitemap.en,
        description: 'WeReact sitemap: every service page, audience path, case study, guide, and company page on the site.',
        lead: 'Every page on the site, grouped by topic. The list is generated from the site data, so a new page shows up here on its own.',
        pages: (count: number) => `${count} pages`,
        xml: 'XML version for search engines',
      };
}

export async function generateMetadata({ params }: SitemapPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCopy(locale);

  return createPageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/sitemap`,
    locale,
    keywords: locale === 'fr' ? ['plan du site WeReact'] : ['WeReact sitemap'],
  });
}

export default async function SitemapPage({ params }: SitemapPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getCopy(locale);
  const sections = getSitemapSections(locale);
  const isFr = locale === 'fr';

  const pageJsonLd = createWebPageJsonLd({
    type: 'CollectionPage',
    path: `/${locale}/sitemap`,
    name: copy.title,
    description: copy.description,
    locale,
    dateModified: getContentLastModified(),
    about: { '@id': ENTITY_IDS.website },
  });
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: isFr ? 'Accueil' : 'Home', url: `/${locale}` },
    { name: copy.title, url: `/${locale}/sitemap` },
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] pt-28 text-[var(--color-text-main)] md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="px-6 pb-16 pt-12 md:px-16 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-mono flex items-center gap-3 text-[var(--color-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" aria-hidden="true" />
            WeReact agency
          </p>
          <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.4rem,5.2vw,5rem)] leading-[0.96]">{copy.title}</h1>
          <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
            {copy.lead}
          </p>
        </div>
      </section>

      {sections.map((section, index) => (
        <section
          key={section.id}
          aria-labelledby={`sitemap-${section.id}`}
          className={
            index % 2 === 0
              ? 'border-y border-[rgba(58,90,64,0.16)] bg-white px-6 py-16 md:px-16 md:py-20'
              : 'px-6 py-16 md:px-16 md:py-20'
          }
        >
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
            <div>
              <h2 id={`sitemap-${section.id}`} className="font-display text-3xl leading-tight md:text-4xl">
                {section.title}
              </h2>
              <p className="mt-3 text-mono text-[var(--color-primary)]">{copy.pages(section.links.length)}</p>
            </div>
            <ul className="grid gap-x-10 gap-y-5 md:grid-cols-2">
              {section.links.map((link) => (
                <li key={link.href} className="border-t border-[rgba(58,90,64,0.16)] pt-5">
                  <Link href={link.href} className="group block">
                    {link.meta && <span className="mb-2 block text-mono text-[var(--color-primary)]">{link.meta}</span>}
                    <span className="block text-lg font-bold leading-tight text-[var(--color-text-main)] underline decoration-[rgba(58,90,64,0.3)] underline-offset-4 transition-colors group-hover:text-[var(--color-primary)]">
                      {link.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="px-6 pb-20 pt-4 md:px-16 md:pb-28">
        <div className="mx-auto max-w-7xl border-t border-[rgba(58,90,64,0.18)] pt-8">
          <a
            href="/sitemap.xml"
            className="text-sm text-[var(--color-text-secondary)] underline decoration-[rgba(58,90,64,0.3)] underline-offset-4 transition-colors hover:text-[var(--color-primary)]"
          >
            {copy.xml}
          </a>
        </div>
      </section>
    </div>
  );
}
