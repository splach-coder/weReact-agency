import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'Réalisations' : 'Work',
    description: isFr
      ? 'Une sélection de sites créés par WeReact pour des marques de tourisme, d’hôtellerie et locales au Maroc et au-delà.'
      : 'A selection of websites WeReact has built for tourism, hospitality, and local brands across Morocco and beyond.',
    alternates: {
      canonical: `/${locale}/work`,
      languages: { en: '/en/work', fr: '/fr/work', 'x-default': '/en/work' },
    },
  };
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
