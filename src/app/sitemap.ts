import { siteConfig } from '@/config/site';
import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';
import { projects } from '@/data/projects';

const STATIC_ROUTE_PRIORITY: Record<string, number> = {
  '': 1,
  '/contact': 0.95,
  '/work': 0.9,
  '/blog': 0.72,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();
  const routes = ['', '/contact', '/work', '/blog'];

  const staticRoutes = routes.flatMap((route) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: now,
      changeFrequency: route === '/blog' ? ('weekly' as const) : ('monthly' as const),
      priority: STATIC_ROUTE_PRIORITY[route] ?? 0.7,
    }))
  );

  const postRoutes = blogPosts.flatMap((post) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.62,
    }))
  );

  const workRoutes = projects.flatMap((project) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/work/${project.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.78,
    }))
  );

  return [...staticRoutes, ...workRoutes, ...postRoutes];
}