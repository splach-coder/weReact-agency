import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// No ISR / on-demand revalidation is used (all pages are SSG or dynamic SSR),
// so the default config is sufficient — no incremental cache binding needed.
// If we later add `revalidate`, wire an R2 or KV incremental cache here.
export default defineCloudflareConfig();
