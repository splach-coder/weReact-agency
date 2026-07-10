import { ExcursionListing } from '@/components/luxury/LuxuryPages';

export default async function ExcursionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ExcursionListing locale={locale} />;
}
