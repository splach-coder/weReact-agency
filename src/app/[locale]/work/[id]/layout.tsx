import type { Metadata } from 'next';
import { getProjectById } from '@/data/projects';

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

  return {
    title: `${project.title} — ${project.category}`,
    description: project.summary,
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
      title: `${project.title} — ${project.category}`,
      description: project.summary,
      images: [{ url: project.imageFull ?? project.image }],
    },
  };
}

export default function WorkDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
