import assert from 'node:assert/strict';
import test from 'node:test';
import { serviceLandingPages } from '@/data/services';
import { audienceLandingPages } from '@/data/audiences';
import { projects } from '@/data/projects';
import { blogPosts } from '@/data/blog';
import { siteConfig } from '@/config/site';
import { buildLlmsTxt } from './llms-txt';

const text = buildLlmsTxt();
const lines = text.split('\n');

test('follows the llms.txt format: H1, blockquote summary, H2 sections', () => {
  assert.equal(lines[0], '# WeReact agency');
  assert.equal(lines[2], `> ${siteConfig.description}`);
  const sections = lines.filter((line) => line.startsWith('## ')).map((line) => line.slice(3));
  for (const section of ['Pricing', 'Services', 'Audience paths', 'About and work', 'Contact', 'Sitemap']) {
    assert.ok(sections.includes(section), `missing section ${section}`);
  }
  for (const line of lines.filter((l) => l.startsWith('- ['))) {
    assert.match(line, /^- \[[^\]]+\]\(https:\/\/[^)\s]+\)(: .+)?$/, `malformed link item: ${line}`);
  }
});

test('lists every page from the data with its canonical URL', () => {
  for (const page of [...serviceLandingPages, ...audienceLandingPages]) {
    assert.ok(text.includes(`(https://www.wereact.agency/en/${page.slug})`), page.slug);
  }
  for (const project of projects) assert.ok(text.includes(`(https://www.wereact.agency/en/work/${project.id})`), project.id);
  for (const post of blogPosts) assert.ok(text.includes(`(https://www.wereact.agency/en/blog/${post.slug})`), post.slug);
  assert.ok(text.includes('(https://www.wereact.agency/en/ai-info)'));
  assert.ok(text.includes('https://www.wereact.agency/sitemap.xml'));
});

test('states prices and contact details from the site data', () => {
  assert.ok(text.includes('from 2,000 MAD'));
  assert.ok(text.includes('from 3,500 MAD'));
  assert.ok(text.includes(siteConfig.business.email));
  assert.ok(text.includes(siteConfig.business.phoneDisplay));
  assert.ok(text.includes('https://maps.google.com/?cid=906947470338054436'));
});

test('labels the portfolio as client work (owner confirmed every site is a client site)', () => {
  const trustDrivers = lines.find((line) => line.includes('/en/work/trust-drivers'));
  assert.ok(trustDrivers?.includes('Client work'));
  assert.ok(!text.includes('WeReact studio project'));
});

test('never leaks inline link markup', () => {
  assert.ok(!/\]\(\/[^)]*\)/.test(text), 'relative markdown link found');
});
