import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return createPageMetadata({
    title: isFr ? 'Realisations - Sites web au Maroc' : 'Work - Website Design Case Studies in Morocco',
    description: isFr
      ? 'Decouvrez les sites web crees par WeReact pour des marques locales, tourisme, transport et hospitality au Maroc avec SEO, confiance et conversion.'
      : 'Explore WeReact website design case studies for Moroccan local brands, tourism, transport, and hospitality businesses built for trust, SEO, and conversion.',
    path: `/${locale}/work`,
    locale,
    keywords: isFr
      ? ['portfolio agence web Maroc', 'site web tourisme Maroc', 'site web Marrakech']
      : ['website design portfolio Morocco', 'Marrakech web design case studies', 'tourism website design Morocco'],
  });
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}