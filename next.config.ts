import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const withNextIntl = createNextIntlPlugin();

// Makes Cloudflare bindings/env available via getCloudflareContext() when
// running `next dev`. No-op in production builds.
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    // On Cloudflare, sharp can't run — optimize via Cloudflare Image
    // Transformations through a custom loader (see image-loader.ts).
    loader: 'custom',
    loaderFile: './image-loader.ts',
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'your-morocco.com',
        pathname: '/**',
      },
      // We add the Sanity CDN hostname now to be ready for the future
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
    // Images are now optimized using Sharp
  },
};

export default withNextIntl(nextConfig);