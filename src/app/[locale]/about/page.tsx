import { AboutPage } from '@/components/luxury/LuxuryPages';

export default async function AboutRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AboutPage locale={locale} />;
}
