import type { Metadata } from 'next';
import { getProjectById, projects } from '@/data/projects';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { createLocalizedAlternates, createProjectJsonLd } from '@/lib/seo';

type WorkDetailLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
};

// Prerender every case study for each locale (the page itself is a client component).
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((project) => ({ locale, id: project.id })));
}

export async function generateMetadata({ params }: Omit<WorkDetailLayoutProps, 'children'>): Promise<Metadata> {
  const { locale, id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return { title: 'Case study' };
  }

  const isFr = locale === 'fr';
  const category = isFr ? project.categoryFr : project.category.replace(/^Studio Project: /, '');
  const title = `${project.title} - ${category}`;
  const description = isFr ? project.summaryFr : project.summary;
  const image = `${siteConfig.url}${project.imageFull ?? project.image}`;
  const path = `/${locale}/work/${id}`;

  return {
    title,
    description,
    keywords: isFr
      ? [project.title, category, 'création site web Maroc', 'agence web Marrakech', 'étude de cas']
      : [project.title, category, 'website design Morocco', 'web agency Marrakech', 'case study'],
    alternates: {
      canonical: `${siteConfig.url}${path}`,
      languages: createLocalizedAlternates(`/work/${id}`),
    },
    openGraph: {
      type: 'article',
      url: `${siteConfig.url}${path}`,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function WorkDetailLayout({ children, params }: WorkDetailLayoutProps) {
  const { locale, id } = await params;
  const project = getProjectById(id);
  const jsonLd = project ? createProjectJsonLd(project, locale) : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {children}
    </>
  );
}
