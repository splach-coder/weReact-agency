import MarrakechHome from '@/components/luxury/MarrakechHome';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <MarrakechHome locale={locale} />;
}
