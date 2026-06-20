import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'Contact' : 'Contact',
    description: isFr
      ? "Parlez-nous de votre projet ou réservez un appel découverte gratuit avec WeReact, l'agence web de Marrakech."
      : 'Tell us about your project or book a free intro call with WeReact, the Marrakech web agency.',
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: '/en/contact', fr: '/fr/contact', 'x-default': '/en/contact' },
    },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
