import type { Metadata } from 'next';
import { getProjectById } from '@/data/projects';
import { siteConfig } from '@/config/site';
import { createLocalizedAlternates, createProjectJsonLd } from '@/lib/seo';

type WorkDetailLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Omit<WorkDetailLayoutProps, 'children'>): Promise<Metadata> {
  const { locale, id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return { title: 'Case study' };
  }

  const title = `${project.title} - ${project.category}`;
  const image = `${siteConfig.url}${project.imageFull ?? project.image}`;
  const path = `/${locale}/work/${id}`;

  return {
    title,
    description: project.summary,
    keywords: [project.title, project.category, 'website design Morocco', 'web agency Marrakech', 'case study'],
    alternates: {
      canonical: `${siteConfig.url}${path}`,
      languages: createLocalizedAlternates(`/work/${id}`),
    },
    openGraph: {
      type: 'article',
      url: `${siteConfig.url}${path}`,
      title,
      description: project.summary,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: project.summary,
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
