import { ContactPage } from '@/components/luxury/LuxuryPages';

export default async function ContactRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ContactPage locale={locale} />;
}
