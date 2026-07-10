import { notFound } from 'next/navigation';
import { TransferDetail } from '@/components/luxury/LuxuryPages';
import { getRoute, routes } from '@/components/luxury/data';

export function generateStaticParams() { return routes.map(({ slug }) => ({ slug })); }

export default async function TransferDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!getRoute(slug)) notFound();
  return <TransferDetail locale={locale} slug={slug} />;
}
