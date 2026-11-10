import { siteConfig } from '@/config/site';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
            {
                userAgent: 'bingbot',
                allow: '/',
            },
            {
                userAgent: 'msnbot',
                allow: '/',
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: 'OAI-SearchBot',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            {
                userAgent: 'Claude-SearchBot',
                allow: '/',
            },
            {
                userAgent: 'Applebot',
                allow: '/',
            },
            {
                userAgent: 'Applebot-Extended',
                allow: '/',
            },
            {
                userAgent: 'CCBot',
                allow: '/',
            },
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`,
    };
}
