import { FleetListing } from '@/components/luxury/LuxuryPages';

export default async function FleetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <FleetListing locale={locale} />;
}
