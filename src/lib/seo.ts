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
}: PageMetadataOptions): Metadata {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${siteConfig.url}${normalizedPath}`;
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return {
    title,
    description,
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
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteConfig.url}/#website-design-service`,
    name: 'Website design and development in Marrakech',
    provider: {
      '@type': 'ProfessionalService',
      name: siteConfig.business.legalName,
      url: siteConfig.url,
      telephone: siteConfig.business.phoneInternational,
      email: siteConfig.business.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.business.city,
        postalCode: siteConfig.business.postalCode,
        addressCountry: siteConfig.business.country,
      },
    },
    areaServed: siteConfig.business.areaServed.map((area) => ({ '@type': 'Place', name: area })),
    serviceType: siteConfig.business.services,
  };
}
