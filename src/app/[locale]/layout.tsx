import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';
import { nohemi } from '@/app/fonts';
import { createServiceJsonLd } from '@/lib/seo';

const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${siteConfig.url}/#business`,
  name: siteConfig.business.legalName,
  alternateName: siteConfig.shortName,
  description: siteConfig.description,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  logo: `${siteConfig.url}/images/logo.webp`,
  telephone: siteConfig.business.phoneInternational,
  email: siteConfig.business.email,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: siteConfig.business.city,
    postalCode: siteConfig.business.postalCode,
    addressCountry: siteConfig.business.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: siteConfig.business.latitude,
    longitude: siteConfig.business.longitude,
  },
  openingHours: siteConfig.business.openingHours,
  areaServed: siteConfig.business.areaServed,
  sameAs: siteConfig.business.sameAs,
  makesOffer: siteConfig.business.services.map((service) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: service,
    },
  })),
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Website Design in Marrakech`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.description} WeReact agency helps businesses in Marrakech, Morocco, and international markets launch fast, SEO-friendly websites with clear conversion paths.`,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
  },

  metadataBase: new URL(siteConfig.url),
};

const serviceJsonLd = createServiceJsonLd();

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${nohemi.variable} min-h-screen flex flex-col bg-slate-50 text-slate-900`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
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
            dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
          />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
