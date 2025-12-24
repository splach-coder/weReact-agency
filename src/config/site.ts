export const siteConfig = {
    name: 'Boilerplate App',
    description: 'Clean boilerplate ready for your content.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    // SEO specifics
    ogImage: '/images/og-image.jpg', // You should create a default og-image in public/images
    twitterHandle: '@yourhandle',
    creator: 'Your Name or Agency',
};

export type SiteConfig = typeof siteConfig;
