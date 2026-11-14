import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import type { ServiceFaq, ServiceLocaleCopy, ServicePricingTier } from '@/data/services';
import type { Project } from '@/data/projects';
import type { BlogPost } from '@/data/blog';
import { areaEntities, entitySameAs, knowsAboutTopics } from '@/lib/entities';
import { stripInlineLinks } from '@/lib/inline-links';

/**
 * Stable identifiers of the site-wide entities. Every other node (Service,
 * OfferCatalog, CreativeWork, BlogPosting, AboutPage...) points at these by
 * `@id` instead of repeating the business details, so the business is
 * described in exactly one place: createBusinessJsonLd().
 * Never change these values. docs/seo/entity-map.html documents the graph.
 *
 * This module is also imported by a client component (home FAQ), so it must
 * not import the data modules: pass data in as arguments instead.
 */
export const ENTITY_IDS = {
  business: `${siteConfig.url}/#business`,
  website: `${siteConfig.url}/#website`,
  logo: `${siteConfig.url}/#logo`,
} as const;

const businessRef = { '@id': ENTITY_IDS.business };
const websiteRef = { '@id': ENTITY_IDS.website };

type Language = 'en' | 'fr';
const toLanguage = (locale?: string): Language => (locale === 'fr' ? 'fr' : 'en');

export function createLocalizedAlternates(path: string) {
  const withoutLocale = path.replace(/^\/(en|fr)(?=\/|$)/, '');
  const cleanPath = withoutLocale.replace(/\/$/, '');
  const suffix = cleanPath && cleanPath !== '/'
    ? (cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath)
    : '';

  return {
    en: siteConfig.url + '/en' + suffix,
    fr: siteConfig.url + '/fr' + suffix,
    'x-default': siteConfig.url + '/en' + suffix,
  };
}

type ServiceSchemaPage = {
  slug: string;
  keywords: readonly string[];
  copy: Record<'en' | 'fr', ServiceLocaleCopy>;
  /** When true the page also renders the pricing OfferCatalog (`#pricing`). */
  showPricing?: boolean;
};

/** A landing page listed in the business offer catalog. */
type CatalogPage = {
  slug: string;
  copy: Record<'en' | 'fr', { title: string }>;
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  locale?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  image = siteConfig.ogImage,
  locale = 'en',
  type = 'website',
  publishedTime,
  authors,
  keywords = [],
}: PageMetadataOptions): Metadata {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${siteConfig.url}${normalizedPath}`;
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return {
    title,
    description,
    keywords: [...siteConfig.seo.keywords, ...keywords],
    alternates: {
      canonical: url,
      languages: createLocalizedAlternates(normalizedPath),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && authors ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

/** `areaServed`: cities and the country as entities linked to Wikidata / Wikipedia; anything else stays text. */
export function createAreaServedJsonLd() {
  return siteConfig.business.areaServed.map((area) => {
    const entity = areaEntities[area];
    if (!entity) return area;
    return { '@type': entity.type, name: entity.name, sameAs: entitySameAs(entity) };
  });
}

/** `knowsAbout`: topics as `Thing`s with verified Wikidata / Wikipedia links, plain text otherwise. */
export function createKnowsAboutJsonLd() {
  return knowsAboutTopics.map((topic) => {
    const sameAs = entitySameAs(topic);
    return sameAs.length ? { '@type': 'Thing', name: topic.name, sameAs } : topic.name;
  });
}

export function createLogoJsonLd() {
  // The "-WR-" mark used on the Business Profile and LinkedIn: square, 512 px,
  // readable on white (Google: at least 112 px). /images/logo.webp is a client's
  // logo (Your Morocco) and must never represent WeReact.
  const url = `${siteConfig.url}/wereact-avatar.png`;
  return {
    '@type': 'ImageObject',
    '@id': ENTITY_IDS.logo,
    url,
    contentUrl: url,
    width: 512,
    height: 512,
    caption: siteConfig.name,
  };
}

type BusinessJsonLdOptions = {
  /** Language of the offer catalog names and service page URLs. Defaults to English. */
  locale?: string;
  /** Service landing pages to list in the offer catalog (by their `#service` @id). */
  servicePages?: readonly CatalogPage[];
};

/** The one full description of the business. Everything else references `ENTITY_IDS.business`. */
export function createBusinessJsonLd({ locale, servicePages = [] }: BusinessJsonLdOptions = {}) {
  const language = toLanguage(locale);
  const offers = servicePages.length
    ? servicePages.map((page) => {
        const url = `${siteConfig.url}/${language}/${page.slug}`;
        return {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', '@id': `${url}#service`, name: page.copy[language].title, url, provider: businessRef },
        };
      })
    : siteConfig.business.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service, provider: businessRef },
      }));

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': ENTITY_IDS.business,
    name: siteConfig.business.legalName,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    logo: createLogoJsonLd(),
    telephone: siteConfig.business.phoneInternational,
    email: siteConfig.business.email,
    currenciesAccepted: siteConfig.campaign.leadCurrency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.business.addressDisplay,
      addressLocality: siteConfig.business.city,
      addressRegion: siteConfig.business.region,
      postalCode: siteConfig.business.postalCode,
      addressCountry: siteConfig.business.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.business.latitude,
      longitude: siteConfig.business.longitude,
    },
    hasMap: siteConfig.business.googleMapsUrl,
    openingHoursSpecification: siteConfig.business.openingHoursSpecification.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      ...hours,
    })),
    areaServed: createAreaServedJsonLd(),
    knowsAbout: createKnowsAboutJsonLd(),
    audience: siteConfig.seo.audience.map((audienceType) => ({ '@type': 'Audience', audienceType })),
    availableLanguage: siteConfig.seo.languages,
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: siteConfig.business.phoneInternational,
      email: siteConfig.business.email,
      areaServed: siteConfig.business.country,
      availableLanguage: siteConfig.seo.languages,
    }],
    sameAs: siteConfig.business.sameAs,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: language === 'fr' ? 'Création de sites web et services de croissance' : 'Website design and growth services',
      itemListElement: offers,
    },
  };
}

export function createWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ENTITY_IDS.website,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    inLanguage: siteConfig.locales,
    publisher: businessRef,
    about: businessRef,
  };
}

/** The general website design service shown on the home page. */
export function createServiceJsonLd(locale?: string) {
  const contactUrl = `${siteConfig.url}/${toLanguage(locale)}/contact`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteConfig.url}/#website-design-service`,
    name: 'Website design and development in Marrakech',
    alternateName: ['Web agency Marrakech', 'Website designer Morocco', 'SEO-ready business websites'],
    description: siteConfig.description,
    serviceType: siteConfig.business.services,
    category: siteConfig.business.category,
    provider: businessRef,
    areaServed: createAreaServedJsonLd(),
    audience: siteConfig.seo.audience.map((audienceType) => ({ '@type': 'Audience', audienceType })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: contactUrl,
      servicePhone: { '@type': 'ContactPoint', telephone: siteConfig.business.phoneInternational },
      availableLanguage: siteConfig.seo.languages,
    },
    offers: siteConfig.business.services.map((service) => ({
      '@type': 'Offer',
      name: service,
      availability: 'https://schema.org/InStock',
      priceCurrency: siteConfig.campaign.leadCurrency,
      url: contactUrl,
      offeredBy: businessRef,
    })),
  };
}

export function createServicePageJsonLd(page: ServiceSchemaPage, locale: string) {
  const copy = page.copy[toLanguage(locale)];
  const url = `${siteConfig.url}/${locale}/${page.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: copy.title,
    description: stripInlineLinks(copy.description),
    url,
    serviceType: page.keywords,
    provider: businessRef,
    areaServed: createAreaServedJsonLd(),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${siteConfig.url}/${locale}/contact`,
      availableLanguage: locale === 'fr' ? ['French', 'English'] : ['English', 'French'],
    },
    ...(page.showPricing ? { hasOfferCatalog: { '@id': `${url}#pricing` } } : {}),
  };
}

export function createPricingJsonLd(tiers: readonly ServicePricingTier[], locale: string, pageUrl: string) {
  const pricedTiers = tiers.filter((tier) => tier.fromMad !== null);
  if (!pricedTiers.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${pageUrl}#pricing`,
    name: locale === 'fr' ? 'Tarifs de création de site web' : 'Website build pricing',
    inLanguage: locale === 'fr' ? 'fr' : 'en',
    provider: businessRef,
    itemListElement: pricedTiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      description: tier.note,
      url: pageUrl,
      availability: 'https://schema.org/InStock',
      offeredBy: businessRef,
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: tier.fromMad,
        priceCurrency: 'MAD',
        valueAddedTaxIncluded: false,
      },
    })),
  };
}

export function createFaqJsonLd(faqs: readonly ServiceFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: stripInlineLinks(faq.question),
      acceptedAnswer: { '@type': 'Answer', text: stripInlineLinks(faq.answer) },
    })),
  };
}

type WebPageJsonLdOptions = {
  type?: 'WebPage' | 'AboutPage' | 'CollectionPage';
  /** Locale-prefixed path, e.g. `/fr/ai-info`. */
  path: string;
  name: string;
  description: string;
  locale: string;
  dateModified?: string;
  /** What the page is about. Defaults to the business. */
  about?: { '@id': string };
  mainEntity?: { '@id': string };
};

/** A page of this site, tied into the graph: part of `#website`, published by and about `#business`. */
export function createWebPageJsonLd({
  type = 'WebPage',
  path,
  name,
  description,
  locale,
  dateModified,
  about = businessRef,
  mainEntity,
}: WebPageJsonLdOptions) {
  const url = `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;

  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: toLanguage(locale),
    isPartOf: websiteRef,
    about,
    ...(mainEntity ? { mainEntity } : {}),
    publisher: businessRef,
    ...(dateModified ? { dateModified } : {}),
  };
}

export function createAboutPageJsonLd(locale: string, name: string, description: string) {
  const url = `${siteConfig.url}/${locale}/about`;

  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${url}#about`,
    url,
    name,
    description,
    inLanguage: locale === 'fr' ? 'fr' : 'en',
    isPartOf: websiteRef,
    about: businessRef,
    mainEntity: businessRef,
    publisher: businessRef,
  };
}

export function createBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

export function createProjectJsonLd(project: Project, locale: string) {
  const language = toLanguage(locale);
  const url = `${siteConfig.url}/${language}/work/${project.id}`;
  const image = project.imageFull ?? project.image;
  // Studio-owned projects are WeReact's own websites: it also holds and publishes them.
  const ownership = project.relationship === 'studio-owned'
    ? { copyrightHolder: businessRef, publisher: businessRef }
    : {};

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    name: project.title,
    description: language === 'fr' ? project.summaryFr : project.summary,
    url,
    image: image.startsWith('http') ? image : `${siteConfig.url}${image}`,
    dateCreated: project.year,
    dateModified: project.modifiedAt,
    creator: businessRef,
    ...ownership,
    inLanguage: language,
    sameAs: project.externalUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

/**
 * BlogPosting for a (localized) post, with the business as author and
 * publisher by `@id`. Pass the result of getLocalizedPost().
 */
export function createBlogPostingJsonLd(post: BlogPost, locale: string) {
  const language = toLanguage(locale);
  const url = `${siteConfig.url}/${language}/blog/${post.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.image.startsWith('http') ? post.image : `${siteConfig.url}${post.image}`,
    url,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    author: businessRef,
    publisher: businessRef,
    isPartOf: websiteRef,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: language,
  };
}
