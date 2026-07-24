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
import SalesChat from '@/components/SalesChat';
import { siteConfig } from '@/config/site';
import { nohemi } from '@/app/fonts';
import { createLocalizedAlternates } from '@/lib/seo';

const OG_LOCALE: Record<string, string> = { en: 'en_US', fr: 'fr_FR' };
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const defaultTitle = isFr
    ? `${siteConfig.name} | Création de sites web à Marrakech`
    : `${siteConfig.name} | Website Design in Marrakech`;
  const description = isFr
    ? `WeReact agency est une agence web basée à Marrakech qui crée des sites business rapides, des landing pages, des fondations SEO et des expériences web sur mesure pour des clients au Maroc et à l'international. WeReact agency aide les entreprises de Marrakech, du Maroc et des marchés internationaux à lancer des sites web rapides, optimisés pour le SEO, avec des parcours de conversion clairs.`
    : `${siteConfig.description} WeReact agency helps businesses in Marrakech, Morocco, and international markets launch fast, SEO-friendly websites with clear conversion paths.`;
  const keywords = [...siteConfig.seo.keywords, ...siteConfig.seo.geoKeywords];

  return {
    title: {
      default: defaultTitle,
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
      languages: createLocalizedAlternates('/'),
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
      title: defaultTitle,
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
      title: defaultTitle,
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
            <Footer />
            <SalesChat locale={locale} />
          </TransitionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
