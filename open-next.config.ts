import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// Every public page is prerendered at build time (SSG). The prerendered HTML /
// RSC payloads are shipped with the Worker's static assets and served from
// there through this read-only incremental cache: it uses the existing ASSETS
// binding, so no KV / R2 / D1 / Durable Object binding is needed.
//
// It is read-only on purpose: there is no ISR or on-demand revalidation for
// the public site (admin / crm / api routes stay dynamic SSR and never touch
// it). If a page ever needs `revalidate`, switch to an R2 or KV incremental
// cache instead. Paths that are not prerendered (e.g. an unknown slug) are
// still rendered on demand; the "Failed to set to read-only cache" log line
// they produce is expected and harmless.
//
// `enableCacheInterception` answers prerendered routes straight from that
// cache, after the middleware has run (so the locale / geo redirects still
// apply), without booting the Next.js server for them.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
