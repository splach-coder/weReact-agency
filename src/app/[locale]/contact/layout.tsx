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
    title: isFr
      ? 'Contact – Agence web à Marrakech'
      : 'Contact - Website Design Agency in Marrakech',
    description: isFr
      ? "Contactez WeReact pour un site web rapide, crédible et optimisé SEO à Marrakech. Demandez un devis pour votre site business, tourisme, landing page ou projet web au Maroc."
      : 'Contact WeReact for fast, SEO-ready website design in Marrakech. Request a quote for business websites, tourism websites, landing pages, and web projects in Morocco.',
    path: `/${locale}/contact`,
    locale,
    keywords: isFr
      ? ['agence web Marrakech', 'création site web Marrakech', 'site internet Maroc', 'devis site web Marrakech']
      : ['contact web agency Marrakech', 'website design quote Marrakech', 'web development Morocco', 'business website Morocco'],
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}