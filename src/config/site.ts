export const siteConfig = {
    name: 'WeReact',
    description: 'We Design & Build Impactful Digital Experiences - Your partner for stunning websites and powerful web applications.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    // SEO specifics
    ogImage: '/og-image.png', // Professional OG image for social media sharing
    twitterHandle: '@wereact',
    creator: 'WeReact Agency',
};

export type SiteConfig = typeof siteConfig;
