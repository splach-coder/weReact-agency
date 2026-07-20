// Custom Next.js image loader for Cloudflare Image Transformations.
//
// Cloudflare's /cdn-cgi/image/ resizing only works on a zone that has Image
// Transformations enabled (i.e. once wereact.agency is on Cloudflare). It is
// NOT available in `next dev` or on *.workers.dev. So we gate on
// NEXT_PUBLIC_CF_IMAGES: until it's set to "1" (on the production zone) we
// return the raw src and images serve unoptimized — correct for local dev and
// the workers.dev preview.
type LoaderParams = { src: string; width: number; quality?: number };

const CF_ENABLED = process.env.NEXT_PUBLIC_CF_IMAGES === '1';

export default function cloudflareImageLoader({ src, width, quality }: LoaderParams): string {
  if (!CF_ENABLED) return src;

  const params = [`width=${width}`, `quality=${quality ?? 75}`, 'format=auto'].join(',');
  const base = `/cdn-cgi/image/${params}`;

  // Absolute remote URLs (e.g. Unsplash) go after the options as-is;
  // local /public paths keep their leading slash.
  if (/^https?:\/\//.test(src)) return `${base}/${src}`;
  return `${base}${src.startsWith('/') ? src : `/${src}`}`;
}
