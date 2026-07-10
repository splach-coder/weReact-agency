import type { Metadata } from 'next';
import { getProjectById } from '@/data/projects';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return { title: 'Case study' };
  }

  const title = `${project.title} - ${project.category}`;
  const image = `${siteConfig.url}${project.imageFull ?? project.image}`;

  return {
    title,
    description: project.summary,
    keywords: [project.title, project.category, 'website design Morocco', 'web agency Marrakech', 'case study'],
    alternates: {
      canonical: `/${locale}/work/${id}`,
      languages: {
        en: `/en/work/${id}`,
        fr: `/fr/work/${id}`,
        'x-default': `/en/work/${id}`,
      },
    },
    openGraph: {
      type: 'article',
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

export default function WorkDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}