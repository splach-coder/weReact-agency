import { siteConfig } from '@/config/site';
import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';
import { projects } from '@/data/projects';
import { serviceLandingPages } from '@/data/services';
import { audienceLandingPages } from '@/data/audiences';
import { freeTools } from '@/data/tools';
import { getContentLastModified } from '@/lib/site-index';

const STATIC_ROUTE_PRIORITY: Record<string, number> = {
  '': 1,
  '/contact': 0.95,
  '/work': 0.9,
  '/about': 0.8,
  '/book': 0.9,
  '/blog': 0.72,
};

// Generated from the same data as the content pages: they change when it does.
const INDEX_ROUTE_PRIORITY: Record<string, number> = {
  '/ai-info': 0.6,
  '/sitemap': 0.3,
};

/**
 * Last real change of pages whose text is not generated from the data files.
 * Google only trusts lastmod when it is "consistently and verifiably accurate",
 * so bump these by hand when the page copy changes, never on every build.
 */
const STATIC_PAGE_MODIFIED: Record<string, string> = {
  // Home: new main heading and the manifesto text fixed.
  '': '2026-11-14',
  '/contact': '2026-11-10',
  '/book': '2026-11-10',
};

const latest = (dates: readonly string[]) => dates.reduce((a, b) => (b > a ? b : a));

// The build date is accepted for backwards compatibility but no longer used:
// a lastmod that moves on every deploy makes Google ignore all of them.
export default function sitemap(_buildDate?: Date): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const routes = ['', '/contact', '/work', '/about', '/book', '/blog'];
  const contentLastModified = new Date(getContentLastModified());
  const projectsModified = latest(projects.map((project) => project.modifiedAt));
  const postsModified = latest(blogPosts.map((post) => post.modifiedAt));
  const routeModified: Record<string, Date> = {
    // The home page lists services, work, articles and the tool.
    '': new Date(latest([getContentLastModified(), STATIC_PAGE_MODIFIED['']])),
    '/work': new Date(projectsModified),
    // The about page shows recent work.
    '/about': new Date(latest([projectsModified, '2026-11-13'])),
    '/blog': new Date(postsModified),
    '/contact': new Date(STATIC_PAGE_MODIFIED['/contact']),
    '/book': new Date(STATIC_PAGE_MODIFIED['/book']),
  };

  const staticRoutes = routes.flatMap((route) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: routeModified[route],
      changeFrequency: route === '/blog' ? ('weekly' as const) : ('monthly' as const),
      priority: STATIC_ROUTE_PRIORITY[route] ?? 0.7,
    }))
  );
  const indexRoutes = Object.entries(INDEX_ROUTE_PRIORITY).flatMap(([route, priority]) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: contentLastModified,
      changeFrequency: 'monthly' as const,
      priority,
    }))
  );

  const serviceRoutes = serviceLandingPages.flatMap((page) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/${page.slug}`,
      lastModified: new Date(page.modifiedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.86,
    }))
  );


  const audienceRoutes = audienceLandingPages.flatMap((page) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/${page.slug}`,
      lastModified: new Date(page.modifiedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.88,
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
      lastModified: new Date(project.modifiedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.78,
    }))
  );

  const toolRoutes = freeTools.flatMap((tool) =>
    siteConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/outils/${tool.slug}`,
      lastModified: new Date(tool.modifiedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticRoutes, ...serviceRoutes, ...audienceRoutes, ...workRoutes, ...postRoutes, ...toolRoutes, ...indexRoutes];
}
