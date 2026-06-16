import { blogPosts } from '../src/data/blog';
import { projects } from '../src/data/projects';
import { siteConfig } from '../src/config/site';

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

console.log(`GreenOps content verified: ${projects.length} projects, ${blogPosts.length} posts.`);
