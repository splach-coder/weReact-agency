import { notFound } from 'next/navigation';
import { ExcursionDetail } from '@/components/luxury/LuxuryPages';
import { excursions, getExcursion } from '@/components/luxury/data';

export function generateStaticParams() { return excursions.map(({ slug }) => ({ slug })); }

export default async function ExcursionDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!getExcursion(slug)) notFound();
  return <ExcursionDetail locale={locale} slug={slug} />;
}
