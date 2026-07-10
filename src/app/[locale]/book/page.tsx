import { BookPage } from '@/components/luxury/LuxuryPages';

export default async function BookRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <BookPage locale={locale} />;
}
