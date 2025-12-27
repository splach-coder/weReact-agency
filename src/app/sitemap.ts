import { siteConfig } from '@/config/site';
import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.url;

    const routes = ['', '/about', '/contact', '/services', '/work', '/blog'];

    const staticRoutes = routes.flatMap((route) =>
        siteConfig.locales.map((locale) => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        }))
    );

    const postRoutes = blogPosts.flatMap((post) =>
        siteConfig.locales.map((locale) => ({
            url: `${baseUrl}/${locale}/blog/${post.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }))
    );

    return [...staticRoutes, ...postRoutes];
}
