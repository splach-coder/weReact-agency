import { siteConfig } from '@/config/site';
import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';
import { projects } from '@/data/projects';
import { serviceLandingPages } from '@/data/services';

const SITE_LAST_MODIFIED = new Date('2026-07-12');
const STATIC_ROUTE_PRIORITY: Record<string, number> = {
  '': 1,
  '/contact': 0.95,
  '/work': 0.9,
  '/blog': 0.72,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const routes = ['', '/contact', '/work', '/blog'];

  const staticRoutes = routes.flatMap((route) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: route === '/blog' ? ('weekly' as const) : ('monthly' as const),
      priority: STATIC_ROUTE_PRIORITY[route] ?? 0.7,
    }))
  );

  const serviceRoutes = serviceLandingPages.flatMap((page) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/${page.slug}`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.86,
    }))
  );

  const postRoutes = blogPosts.flatMap((post) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.modifiedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.68,
    }))
  );

  const workRoutes = projects.flatMap((project) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/work/${project.id}`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.78,
    }))
  );

  return [...staticRoutes, ...serviceRoutes, ...workRoutes, ...postRoutes];
}
