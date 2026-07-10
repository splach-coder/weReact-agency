import { PrivateDriverPage } from '@/components/luxury/LuxuryPages';

export default async function PrivateDriverRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PrivateDriverPage locale={locale} />;
}
