import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'À propos' : 'About',
    description: isFr
      ? "Découvrez WeReact, l'agence web moderne du Maroc : notre histoire, nos valeurs et notre façon de concevoir des sites qui convertissent."
      : "Meet WeReact, Morocco's modern web agency — our story, our values, and how we build websites that convert.",
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: '/en/about', fr: '/fr/about', 'x-default': '/en/about' },
    },
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
