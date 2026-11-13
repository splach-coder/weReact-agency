import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { serviceLandingPages } from '@/data/services';
import { projects } from '@/data/projects';
import { getAboutCopy } from '@/data/about';
import { areaEntities, getAreaName, wikidataUrl } from '@/lib/entities';
import {
  ENTITY_IDS,
  createBreadcrumbJsonLd,
  createBusinessJsonLd,
  createPageMetadata,
  createWebPageJsonLd,
} from '@/lib/seo';
import {
  absoluteUrl,
  formatDate,
  getAudienceLinks,
  getContentLastModified,
  getPricing,
  getServiceLinks,
  pageTitles,
  relationshipCopy,
  toLanguage,
} from '@/lib/site-index';

type AiInfoPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const LANGUAGE_NAMES: Record<string, { en: string; fr: string }> = {
  English: { en: 'English', fr: 'Anglais' },
  French: { en: 'French', fr: 'Français' },
};

const COUNTRY_NAMES: Record<string, { en: string; fr: string }> = {
  MA: { en: 'Morocco', fr: 'Maroc' },
};

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

function getCopy(locale: string) {
  return toLanguage(locale) === 'fr'
    ? {
        title: pageTitles.aiInfo.fr,
        description: 'Fiche factuelle sur WeReact agency pour les assistants IA : activité, localisation, langues, zones desservies, tarifs, contact et études de cas.',
        lead: 'Une fiche factuelle sur WeReact agency, pour les assistants IA et pour les personnes. Elle est générée à partir des mêmes données que le reste du site. Une information absente de cette page n’est pas confirmée : demandez-la à WeReact.',
        updated: 'Dernière mise à jour',
        sections: {
          identity: 'Qui est WeReact',
          location: 'Localisation et langues',
          pricing: 'Services et tarifs de départ',
          contact: 'Contact et prise de rendez-vous',
          profiles: 'Profils officiels',
          pages: 'Pages services',
          audiences: 'Pages par audience',
          work: 'Études de cas',
          machine: 'Versions lisibles par les machines',
        },
        labels: {
          name: 'Nom',
          shortName: 'Nom court',
          category: 'Activité',
          categoryValue: 'Conception et création de sites web',
          website: 'Site officiel',
          caseStudies: 'Études de cas publiées',
          address: 'Adresse',
          coordinates: 'Coordonnées',
          map: 'Carte',
          mapLink: 'Fiche Google Maps',
          hours: 'Horaires',
          languages: 'Langues de travail',
          areas: 'Zones desservies',
          delivery: 'Délai de livraison',
          quote: 'Devis',
          email: 'E-mail',
          phone: 'Téléphone et WhatsApp',
          contactPage: 'Formulaire de contact',
          booking: 'Appel de 30 minutes',
          bookingNote: 'Google Meet, en français ou en anglais',
          liveSite: 'Site en ligne',
          caseStudy: 'Étude de cas',
          gbp: 'Fiche Google Business Profile (vérifiée)',
        },
        caseStudyCount: (total: number, client: number, studio: number, independent: number) =>
          `${total} (${plural(client, 'projet client', 'projets clients')}, ${plural(studio, 'projet du studio', 'projets du studio')}, ${plural(independent, 'projet indépendant', 'projets indépendants')})`,
        hours: (display: string) => display.replace('Mon-Fri', 'Du lundi au vendredi,'),
        machine: {
          llms: 'Résumé texte pour les modèles de langage',
          xml: 'Plan du site XML',
          html: 'Plan du site',
        },
      }
    : {
        title: pageTitles.aiInfo.en,
        description: 'Fact sheet about WeReact agency for AI assistants: what it does, location, languages, areas served, starting prices, contact and case studies.',
        lead: 'A factual summary of WeReact agency, for AI assistants and for people. It is generated from the same data as the rest of this site. If a fact is not on this page, it is not confirmed: ask WeReact.',
        updated: 'Last updated',
        sections: {
          identity: 'What WeReact is',
          location: 'Location and languages',
          pricing: 'Services and starting prices',
          contact: 'Contact and booking',
          profiles: 'Official profiles',
          pages: 'Service pages',
          audiences: 'Audience pages',
          work: 'Case studies',
          machine: 'Machine-readable versions',
        },
        labels: {
          name: 'Name',
          shortName: 'Short name',
          category: 'Business type',
          categoryValue: siteConfig.business.category,
          website: 'Official website',
          caseStudies: 'Published case studies',
          address: 'Address',
          coordinates: 'Coordinates',
          map: 'Map',
          mapLink: 'Google Maps listing',
          hours: 'Opening hours',
          languages: 'Working languages',
          areas: 'Areas served',
          delivery: 'Delivery time',
          quote: 'Quote',
          email: 'Email',
          phone: 'Phone and WhatsApp',
          contactPage: 'Contact form',
          booking: '30-minute call',
          bookingNote: 'Google Meet, in French or English',
          liveSite: 'Live site',
          caseStudy: 'Case study',
          gbp: 'Google Business Profile (verified)',
        },
        caseStudyCount: (total: number, client: number, studio: number, independent: number) =>
          `${total} (${plural(client, 'client project', 'client projects')}, ${studio} studio-owned, ${independent} independent)`,
        hours: (display: string) => display,
        machine: {
          llms: 'Plain-text summary for language models',
          xml: 'XML sitemap',
          html: 'HTML sitemap',
        },
      };
}

export async function generateMetadata({ params }: AiInfoPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCopy(locale);

  return createPageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/ai-info`,
    locale,
    keywords: locale === 'fr' ? ['WeReact fiche entreprise', 'WeReact agence web Marrakech'] : ['WeReact fact sheet', 'WeReact web agency Marrakech'],
  });
}

const linkClass =
  'underline decoration-[rgba(58,90,64,0.3)] underline-offset-4 transition-colors hover:text-[var(--color-primary)] [overflow-wrap:anywhere]';

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-[rgba(58,90,64,0.16)] pt-4">
      <dt className="text-sm text-[var(--color-text-muted)]">{label}</dt>
      <dd className="mt-1.5 leading-relaxed text-[var(--color-text-main)] [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

function Block({ id, title, tone = 'plain', children }: { id: string; title: string; tone?: 'plain' | 'band'; children: ReactNode }) {
  return (
    <section
      aria-labelledby={`ai-${id}`}
      className={
        tone === 'band'
          ? 'border-y border-[rgba(58,90,64,0.16)] bg-white px-6 py-14 md:px-16 md:py-20'
          : 'px-6 py-14 md:px-16 md:py-20'
      }
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
        <h2 id={`ai-${id}`} className="font-display text-3xl leading-tight md:text-4xl">
          {title}
        </h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

export default async function AiInfoPage({ params }: AiInfoPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const language = toLanguage(locale);
  const isFr = language === 'fr';
  const copy = getCopy(language);
  // French typography puts a (non-breaking) space before a colon.
  const colon = isFr ? ' : ' : ': ';
  const about = getAboutCopy(language);
  const pricing = getPricing(language);
  const lastModified = getContentLastModified();
  const business = siteConfig.business;
  const countryName = COUNTRY_NAMES[business.country]?.[language] ?? business.country;
  const count = (relationship: (typeof projects)[number]['relationship']) =>
    projects.filter((project) => project.relationship === relationship).length;

  const pageJsonLd = createWebPageJsonLd({
    type: 'AboutPage',
    path: `/${language}/ai-info`,
    name: copy.title,
    description: copy.description,
    locale: language,
    dateModified: lastModified,
    mainEntity: { '@id': ENTITY_IDS.business },
  });
  const businessJsonLd = createBusinessJsonLd({ locale: language, servicePages: serviceLandingPages });
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: isFr ? 'Accueil' : 'Home', url: `/${language}` },
    { name: copy.title, url: `/${language}/ai-info` },
  ]);

  const profiles = [
    { label: 'Instagram', href: business.sameAs.find((url) => url.includes('instagram.com')) },
    { label: 'Facebook', href: business.sameAs.find((url) => url.includes('facebook.com')) },
    { label: 'LinkedIn', href: business.sameAs.find((url) => url.includes('linkedin.com')) },
    { label: 'Sortlist', href: business.sameAs.find((url) => url.includes('sortlist.com')) },
    { label: copy.labels.gbp, href: business.sameAs.find((url) => url.includes('maps.google.com')) },
  ].filter((profile): profile is { label: string; href: string } => Boolean(profile.href));

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] pt-28 text-[var(--color-text-main)] md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="px-6 pb-16 pt-12 md:px-16 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-mono flex items-center gap-3 text-[var(--color-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" aria-hidden="true" />
            {siteConfig.name}
          </p>
          <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.4rem,5.2vw,5rem)] leading-[0.96]">{copy.title}</h1>
          <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-[var(--color-text-secondary)] md:text-xl">
            {copy.lead}
          </p>
          <p className="mt-6 text-sm text-[var(--color-text-muted)]">
            {copy.updated}{colon}<time dateTime={lastModified}>{formatDate(lastModified, language)}</time>
          </p>
        </div>
      </section>

      <Block id="identity" title={copy.sections.identity} tone="band">
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">{about.lead}</p>
        <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          <Fact label={copy.labels.name}>{business.legalName}</Fact>
          <Fact label={copy.labels.shortName}>{siteConfig.shortName}</Fact>
          <Fact label={copy.labels.category}>{copy.labels.categoryValue}</Fact>
          <Fact label={copy.labels.website}>
            <Link href={`/${language}`} className={linkClass}>{siteConfig.url}</Link>
          </Fact>
          <Fact label={copy.labels.caseStudies}>
            {copy.caseStudyCount(projects.length, count('client-work'), count('studio-owned'), count('independent-project'))}
          </Fact>
        </dl>
      </Block>

      <Block id="location" title={copy.sections.location}>
        <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          <Fact label={copy.labels.address}>
            {business.addressDisplay}, {business.region}, {countryName}
          </Fact>
          <Fact label={copy.labels.coordinates}>
            {business.latitude}, {business.longitude}
          </Fact>
          <Fact label={copy.labels.map}>
            <a href={business.googleMapsUrl} className={linkClass}>{copy.labels.mapLink}</a>
          </Fact>
          <Fact label={copy.labels.hours}>{copy.hours(business.hoursDisplay)}</Fact>
          <Fact label={copy.labels.languages}>
            {siteConfig.seo.languages.map((name) => LANGUAGE_NAMES[name]?.[language] ?? name).join(', ')}
          </Fact>
          <Fact label={copy.labels.areas}>
            {business.areaServed.map((area, index) => {
              const entity = areaEntities[area];
              const name = getAreaName(area, language);
              return (
                <span key={area}>
                  {index > 0 && ', '}
                  {entity ? (
                    <a href={wikidataUrl(entity.wikidata)} className={linkClass}>{name}</a>
                  ) : (
                    name
                  )}
                </span>
              );
            })}
          </Fact>
        </dl>
      </Block>

      <Block id="pricing" title={copy.sections.pricing} tone="band">
        <p className="max-w-2xl leading-relaxed text-[var(--color-text-secondary)]">{pricing.lead}</p>
        <dl className="mt-8 grid gap-px overflow-hidden bg-[rgba(58,90,64,0.16)] md:grid-cols-3">
          {pricing.tiers.map((tier) => (
            <div key={tier.name} className="bg-[var(--color-background-main)] p-6">
              <dt className="text-mono text-[var(--color-primary)]">{tier.name}</dt>
              <dd className="mt-3">
                <p className="font-display text-2xl leading-tight text-[var(--color-text-main)] first-letter:uppercase">{tier.price}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{tier.note}</p>
              </dd>
            </div>
          ))}
        </dl>
        <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          <Fact label={copy.labels.delivery}>{pricing.footnote}</Fact>
        </dl>
      </Block>

      <Block id="contact" title={copy.sections.contact}>
        <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          <Fact label={copy.labels.email}>
            <a href={`mailto:${business.email}`} className={linkClass}>{business.email}</a>
          </Fact>
          <Fact label={copy.labels.phone}>
            <a href={`tel:${business.phoneTel.replace(/[^+\d]/g, '')}`} className={linkClass}>{business.phoneDisplay}</a>
          </Fact>
          <Fact label={copy.labels.contactPage}>
            <Link href={`/${language}/contact`} className={linkClass}>{absoluteUrl(`/${language}/contact`)}</Link>
          </Fact>
          <Fact label={copy.labels.booking}>
            <Link href={`/${language}/book`} className={linkClass}>{absoluteUrl(`/${language}/book`)}</Link>
            <span className="mt-1 block text-sm text-[var(--color-text-secondary)]">{copy.labels.bookingNote}</span>
          </Fact>
        </dl>
      </Block>

      <Block id="profiles" title={copy.sections.profiles} tone="band">
        <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          <li className="border-t border-[rgba(58,90,64,0.16)] pt-4">
            <span className="block text-sm text-[var(--color-text-muted)]">{copy.labels.website}</span>
            <Link href={`/${language}`} className={`mt-1.5 inline-block ${linkClass}`}>{siteConfig.url}</Link>
          </li>
          {profiles.map((profile) => (
            <li key={profile.href} className="border-t border-[rgba(58,90,64,0.16)] pt-4">
              <span className="block text-sm text-[var(--color-text-muted)]">{profile.label}</span>
              <a href={profile.href} className={`mt-1.5 inline-block ${linkClass}`}>{profile.href}</a>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="pages" title={copy.sections.pages}>
        <ul className="grid gap-x-10 gap-y-5 md:grid-cols-2">
          {getServiceLinks(language).map((link) => (
            <li key={link.href} className="border-t border-[rgba(58,90,64,0.16)] pt-4">
              <span className="block font-bold leading-tight">{link.title}</span>
              <Link href={link.href} className={`mt-1.5 inline-block text-sm text-[var(--color-text-secondary)] ${linkClass}`}>
                {absoluteUrl(link.href)}
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="mt-12 text-mono text-[var(--color-primary)]">{copy.sections.audiences}</h3>
        <ul className="mt-5 grid gap-x-10 gap-y-5 md:grid-cols-2">
          {getAudienceLinks(language).map((link) => (
            <li key={link.href} className="border-t border-[rgba(58,90,64,0.16)] pt-4">
              <span className="block font-bold leading-tight">{link.title}</span>
              <Link href={link.href} className={`mt-1.5 inline-block text-sm text-[var(--color-text-secondary)] ${linkClass}`}>
                {absoluteUrl(link.href)}
              </Link>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="work" title={copy.sections.work} tone="band">
        <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {projects.map((project) => {
            const relationship = relationshipCopy[project.relationship][language];
            return (
              <li key={project.id} className="border-t border-[rgba(58,90,64,0.16)] pt-4">
                <span className="block text-mono text-[var(--color-primary)]">{relationship.label}</span>
                <span className="mt-2 block text-lg font-bold leading-tight">{project.title}</span>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {relationship.explanation} {isFr ? project.categoryFr : project.category.replace(/^Studio Project: /, '')}.
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  {copy.labels.caseStudy}{colon}
                  <Link href={`/${language}/work/${project.id}`} className={linkClass}>
                    {absoluteUrl(`/${language}/work/${project.id}`)}
                  </Link>
                  <br />
                  {copy.labels.liveSite}{colon}
                  <a href={project.externalUrl} className={linkClass}>{project.domain}</a>
                </p>
              </li>
            );
          })}
        </ul>
      </Block>

      <Block id="machine" title={copy.sections.machine}>
        <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          <li className="border-t border-[rgba(58,90,64,0.16)] pt-4">
            <span className="block text-sm text-[var(--color-text-muted)]">{copy.machine.llms}</span>
            <a href="/llms.txt" className={`mt-1.5 inline-block ${linkClass}`}>{absoluteUrl('/llms.txt')}</a>
          </li>
          <li className="border-t border-[rgba(58,90,64,0.16)] pt-4">
            <span className="block text-sm text-[var(--color-text-muted)]">{copy.machine.xml}</span>
            <a href="/sitemap.xml" className={`mt-1.5 inline-block ${linkClass}`}>{absoluteUrl('/sitemap.xml')}</a>
          </li>
          <li className="border-t border-[rgba(58,90,64,0.16)] pt-4">
            <span className="block text-sm text-[var(--color-text-muted)]">{copy.machine.html}</span>
            <Link href={`/${language}/sitemap`} className={`mt-1.5 inline-block ${linkClass}`}>{absoluteUrl(`/${language}/sitemap`)}</Link>
          </li>
        </ul>
        <p className="mt-12 text-sm text-[var(--color-text-muted)]">
          {copy.updated}{colon}<time dateTime={lastModified}>{formatDate(lastModified, language)}</time>
        </p>
      </Block>
    </div>
  );
}
