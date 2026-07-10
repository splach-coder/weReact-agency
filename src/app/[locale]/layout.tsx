import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/transition/Preloader';
import TransitionProvider from '@/components/transition/TransitionProvider';
import GoogleTag from '@/components/analytics/GoogleTag';
import GoogleConsentDefaults from '@/components/analytics/GoogleConsentDefaults';
import CookieConsent from '@/components/analytics/CookieConsent';
import { siteConfig } from '@/config/site';
import { nohemi } from '@/app/fonts';
import { createServiceJsonLd } from '@/lib/seo';

const OG_LOCALE: Record<string, string> = { en: 'en_US', fr: 'fr_FR' };
const areaServedJsonLd = siteConfig.business.areaServed.map((area) => ({ '@type': 'Place', name: area }));

const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${siteConfig.url}/#business`,
  name: siteConfig.business.legalName,
  alternateName: siteConfig.shortName,
  description: siteConfig.description,
  slogan: 'Fast websites for Moroccan businesses that need leads.',
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  logo: `${siteConfig.url}/images/logo.webp`,
  telephone: siteConfig.business.phoneInternational,
  email: siteConfig.business.email,
  priceRange: '$$',
  currenciesAccepted: siteConfig.campaign.leadCurrency,
  paymentAccepted: 'Bank transfer, card, cash',
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
  openingHours: siteConfig.business.openingHours,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  areaServed: areaServedJsonLd,
  knowsAbout: [...siteConfig.seo.keywords, ...siteConfig.seo.geoKeywords],
  audience: siteConfig.seo.audience.map((name) => ({ '@type': 'Audience', audienceType: name })),
  availableLanguage: siteConfig.seo.languages,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: siteConfig.business.phoneInternational,
      email: siteConfig.business.email,
      areaServed: siteConfig.business.country,
      availableLanguage: siteConfig.seo.languages,
    },
  ],
  sameAs: siteConfig.business.sameAs,
  makesOffer: siteConfig.business.services.map((service) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: service,
      provider: { '@id': `${siteConfig.url}/#business` },
      areaServed: areaServedJsonLd,
    },
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Website design and lead generation services',
    itemListElement: siteConfig.business.services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service,
      },
    })),
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}/#website`,
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteConfig.url,
  inLanguage: siteConfig.locales,
  publisher: { '@id': `${siteConfig.url}/#business` },
  about: { '@id': `${siteConfig.url}/#business` },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = `${siteConfig.description} WeReact agency helps businesses in Marrakech, Morocco, and international markets launch fast, SEO-friendly websites with clear conversion paths.`;
  const keywords = [...siteConfig.seo.keywords, ...siteConfig.seo.geoKeywords];

  return {
    title: {
      default: `${siteConfig.name} | Website Design in Marrakech`,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.creator, url: siteConfig.url }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    category: siteConfig.business.category,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        fr: '/fr',
        'x-default': '/en',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale] ?? 'en_US',
      alternateLocale: Object.values(OG_LOCALE).filter((l) => l !== (OG_LOCALE[locale] ?? 'en_US')),
      url: `${siteConfig.url}/${locale}`,
      title: `${siteConfig.name} | Website Design in Marrakech`,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteConfig.name} | Website Design in Marrakech`,
      description,
      images: [`${siteConfig.url}${siteConfig.ogImage}`],
      creator: siteConfig.twitterHandle,
    },
    icons: {
      icon: '/logo_icon.ico',
      apple: '/logo_icon.ico',
    },
    other: {
      'geo.region': 'MA',
      'geo.placename': 'Marrakech, Morocco',
      'geo.position': `${siteConfig.business.latitude};${siteConfig.business.longitude}`,
      ICBM: `${siteConfig.business.latitude}, ${siteConfig.business.longitude}`,
    },
  };
}

const serviceJsonLd = createServiceJsonLd();

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${nohemi.variable} min-h-screen flex flex-col bg-[var(--color-background-main)] text-[var(--color-text-main)]`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <GoogleConsentDefaults />
          <GoogleTag />
          <CookieConsent locale={locale} />
          <SmoothScroll />
          <Preloader />
          <TransitionProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
            />
            <Footer />
          </TransitionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
