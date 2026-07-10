import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import LuxuryHeader from '@/components/luxury/LuxuryHeader';
import LuxuryFooter from '@/components/luxury/LuxuryFooter';
import { siteConfig } from '@/config/site';
import { nohemi } from '@/app/fonts';

const languageNames: Record<string, string> = { en: 'English', fr: 'French', es: 'Spanish', it: 'Italian', de: 'German' };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: { default: `${siteConfig.name} | Premium Private Transfers in Agadir`, template: `%s | ${siteConfig.name}` },
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.creator, url: siteConfig.url }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    keywords: [...siteConfig.seo.keywords, ...siteConfig.seo.geoKeywords],
    alternates: { canonical: `/${locale}`, languages: Object.fromEntries(siteConfig.locales.map((code) => [code, `/${code}`])) },
    openGraph: { type: 'website', locale, url: `${siteConfig.url}/${locale}`, siteName: siteConfig.name, title: siteConfig.name, description: siteConfig.description, images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }] },
    twitter: { card: 'summary_large_image', title: siteConfig.name, description: siteConfig.description, images: [siteConfig.ogImage], creator: siteConfig.twitterHandle },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound();
  const messages = await getMessages();
  const businessJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TravelAgency'],
    '@id': `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    logo: `${siteConfig.url}/images/luxury/logo.svg`,
    telephone: siteConfig.business.phoneInternational,
    email: siteConfig.business.email,
    address: { '@type': 'PostalAddress', streetAddress: siteConfig.business.addressDisplay, addressLocality: siteConfig.business.city, postalCode: siteConfig.business.postalCode, addressCountry: siteConfig.business.country },
    geo: { '@type': 'GeoCoordinates', latitude: siteConfig.business.latitude, longitude: siteConfig.business.longitude },
    openingHours: siteConfig.business.openingHours,
    areaServed: siteConfig.business.areaServed.map((name) => ({ '@type': 'Place', name })),
    availableLanguage: siteConfig.locales.map((code) => languageNames[code]),
    sameAs: siteConfig.business.sameAs,
    makesOffer: siteConfig.business.services.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service } })),
  };
  return <html lang={locale}><body className={nohemi.variable}><NextIntlClientProvider messages={messages}><LuxuryHeader locale={locale} /><main>{children}</main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} /><LuxuryFooter locale={locale} /></NextIntlClientProvider></body></html>;
}
