import { notFound } from 'next/navigation';
import { FleetDetail } from '@/components/luxury/LuxuryPages';
import { fleet, getFleetItem } from '@/components/luxury/data';

export function generateStaticParams() { return fleet.map(({ slug }) => ({ slug })); }

export default async function FleetDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!getFleetItem(slug)) notFound();
  return <FleetDetail locale={locale} slug={slug} />;
}
