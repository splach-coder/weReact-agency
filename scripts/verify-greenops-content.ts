import { blogPosts } from '../src/data/blog';
import { projects } from '../src/data/projects';
import { siteConfig } from '../src/config/site';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const requiredDomains = [
  'www.trustdrivers.tours',
  'www.yoomarrakech.com',
  'www.moroccoatlasguide.com',
];

const missingDomains = requiredDomains.filter(
  (domain) => !projects.some((project) => project.domain === domain)
);

if (missingDomains.length > 0) {
  throw new Error(`Missing showcase domains: ${missingDomains.join(', ')}`);
}

if (!projects.every((project) => project.metrics.length >= 2)) {
  throw new Error('Every project needs at least two metrics.');
}

if (!siteConfig.business.areaServed.includes('Marrakech')) {
  throw new Error('Marrakech must remain in areaServed for local SEO.');
}

const geoPosts = blogPosts.filter((post) =>
  `${post.title} ${post.excerpt} ${post.metaDescription ?? ''} ${post.tags.join(' ')}`
    .toLowerCase()
    .includes('marrakech')
);

if (geoPosts.length < 2) {
  throw new Error('At least two blog posts must target Marrakech/local search intent.');
}

const designPaths = ['src/app/[locale]', 'src/components'];
const allowedGreenOpsFiles = new Set([
  'src/components/greenops/OpsBadge.tsx',
  'src/components/greenops/OpsPanel.tsx',
  'src/components/greenops/ProjectVisual.tsx',
  'src/components/greenops/SectionHeader.tsx',
]);

function collectSourceFiles(path: string): string[] {
  if (!existsSync(path)) return [];
  const stats = statSync(path);
  if (stats.isFile()) return path.endsWith('.tsx') || path.endsWith('.css') ? [path] : [];

  return readdirSync(path).flatMap((entry) => collectSourceFiles(join(path, entry).replaceAll('\\', '/')));
}

const greenOpsDesignFiles = designPaths
  .flatMap(collectSourceFiles)
  .filter((path) => !allowedGreenOpsFiles.has(path))
  .filter((path) => {
    const source = readFileSync(path, 'utf8');
    return /components\/greenops|<Ops[A-Z]|greenops-/.test(source);
  });

if (greenOpsDesignFiles.length > 0) {
  throw new Error(`GreenOps design still wired into old UI: ${greenOpsDesignFiles.join(', ')}`);
}

const blogSource = readFileSync('src/data/blog.ts', 'utf8');
const staleBlogYears = blogSource.match(/\b20(?:24|25)\b/g) ?? [];

if (staleBlogYears.length > 0) {
  throw new Error(`Blog content still references stale years: ${[...new Set(staleBlogYears)].join(', ')}`);
}

const footerSource = readFileSync('src/components/Footer.tsx', 'utf8');

if (/All rights reserved/.test(footerSource) && !/new Date\(\)\.getFullYear\(\)/.test(footerSource)) {
  throw new Error('Footer copyright year must use new Date().getFullYear().');
}

console.log(`Content and old-design checks verified: ${projects.length} projects, ${blogPosts.length} posts.`);
