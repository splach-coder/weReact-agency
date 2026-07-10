import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

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
      languages: Object.fromEntries(
        siteConfig.locales.map((siteLocale) => [
          siteLocale,
          `${siteConfig.url}/${siteLocale}${normalizedPath.replace(/^\/(en|fr)/, '')}`,
        ])
      ),
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
      creator: siteConfig.twitterHandle,
    },
  };
}

export function createServiceJsonLd() {
  const areaServed = siteConfig.business.areaServed.map((area) => ({ '@type': 'Place', name: area }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteConfig.url}/#website-design-service`,
    name: 'Website design and development in Marrakech',
    alternateName: ['Web agency Marrakech', 'Website designer Morocco', 'SEO-ready business websites'],
    description: siteConfig.description,
    serviceType: siteConfig.business.services,
    category: siteConfig.business.category,
    provider: {
      '@id': `${siteConfig.url}/#business`,
      '@type': 'ProfessionalService',
      name: siteConfig.business.legalName,
      url: siteConfig.url,
      telephone: siteConfig.business.phoneInternational,
      email: siteConfig.business.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.business.addressDisplay,
        addressLocality: siteConfig.business.city,
        addressRegion: siteConfig.business.region,
        postalCode: siteConfig.business.postalCode,
        addressCountry: siteConfig.business.country,
      },
    },
    areaServed,
    audience: siteConfig.seo.audience.map((audienceType) => ({ '@type': 'Audience', audienceType })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${siteConfig.url}/contact`,
      servicePhone: siteConfig.business.phoneInternational,
    },
    offers: siteConfig.business.services.map((service) => ({
      '@type': 'Offer',
      name: service,
      areaServed,
      availability: 'https://schema.org/InStock',
      priceCurrency: siteConfig.campaign.leadCurrency,
      url: `${siteConfig.url}/contact`,
    })),
  };
}