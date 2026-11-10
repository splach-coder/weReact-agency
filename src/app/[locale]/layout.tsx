import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/transition/Preloader';
import PreloaderBoot from '@/components/transition/PreloaderBoot';
import TransitionProvider from '@/components/transition/TransitionProvider';
import GoogleTag from '@/components/analytics/GoogleTag';
import GoogleConsentDefaults from '@/components/analytics/GoogleConsentDefaults';
import CookieConsent from '@/components/analytics/CookieConsent';
import SalesChat from '@/components/SalesChat';
import { siteConfig } from '@/config/site';
import { nohemi } from '@/app/fonts';
import { createLocalizedAlternates } from '@/lib/seo';

const OG_LOCALE: Record<string, string> = { en: 'en_US', fr: 'fr_FR' };

// Every public page is prerendered at build time for each locale. Nothing in
// this tree may read request data (headers, cookies, searchParams) on the
// server, or the pages silently fall back to per-request rendering.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
    ? "WeReact, agence web à Marrakech : sites business rapides, landing pages et fondations SEO pour des clients au Maroc et à l'international."
    : 'WeReact is a Marrakech web agency building fast, SEO-ready business websites, landing pages, and custom web experiences for clients in Morocco and beyond.';
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
    verification: {
      ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
        ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
        : {}),
      other: { 'msvalidate.01': '9FDECA5DF1D21C7ED48087BF4BDDF560' },
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

  // Tells next-intl the locale without reading request headers (keeps the page static).
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${nohemi.variable} min-h-screen flex flex-col bg-[var(--color-background-main)] text-[var(--color-text-main)]`} suppressHydrationWarning>
        <PreloaderBoot />
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
