import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'Services' : 'Services',
    description: isFr
      ? 'Sites vitrines, landing pages, e-commerce, SEO et maintenance — tout ce dont votre présence web a besoin, en français et en anglais.'
      : 'Business websites, landing pages, e-commerce, SEO, and maintenance — everything your web presence needs, in English and French.',
    alternates: {
      canonical: `/${locale}/services`,
      languages: { en: '/en/services', fr: '/fr/services', 'x-default': '/en/services' },
    },
  };
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
