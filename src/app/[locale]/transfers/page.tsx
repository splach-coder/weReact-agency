import { TransferListing } from '@/components/luxury/LuxuryPages';

export default async function TransfersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <TransferListing locale={locale} />;
}
