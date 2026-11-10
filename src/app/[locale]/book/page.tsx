import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { CalBookingSection } from '@/components/CalBookingSection';
import { siteConfig } from '@/config/site';
import { getCalCopy } from '@/lib/cal';
import { createBreadcrumbJsonLd, createPageMetadata } from '@/lib/seo';

type BookPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return createPageMetadata({
    title: isFr ? 'Réserver un appel' : 'Book a call',
    description: isFr
      ? 'Réservez un appel de 30 minutes avec WeReact pour parler de votre site web, de votre budget et des prochaines étapes.'
      : 'Book a 30-minute call with WeReact to talk through your website, your budget, and the next steps.',
    path: `/${locale}/book`,
    locale,
    keywords: isFr
      ? ['réserver un appel WeReact', 'rendez-vous agence web Marrakech']
      : ['book a call WeReact', 'web agency Marrakech consultation'],
  });
}

export default async function BookPage({ params }: BookPageProps) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const copy = getCalCopy(locale);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: isFr ? 'Accueil' : 'Home', url: `/${locale}` },
    { name: copy.cta, url: `/${locale}/book` },
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] pt-28 text-[var(--color-text-main)] md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CalBookingSection
        source="book"
        locale={locale}
        headingLevel="h1"
        heading={isFr ? 'Réservez un appel de 30 minutes' : 'Book a 30-minute call'}
      />
      <p className="mx-auto max-w-2xl px-6 pb-24 text-center text-sm leading-relaxed text-[var(--color-text-muted)]">
        {isFr
          ? `Vous préférez écrire ? Écrivez-nous à ${siteConfig.business.email} ou sur WhatsApp au ${siteConfig.business.phoneDisplay}.`
          : `Prefer to write? Email ${siteConfig.business.email} or WhatsApp ${siteConfig.business.phoneDisplay}.`}
      </p>
    </div>
  );
}
