#!/usr/bin/env node
/**
 * Internal link audit (zero dependencies, Node 24).
 *
 *   node scripts/seo/link-audit.mjs http://127.0.0.1:3233 [--out docs/seo] [--count-index-pages]
 *
 * Reads /sitemap.xml from the base URL, fetches every page (the canonical host
 * https://www.wereact.agency is mapped to the base URL) and extracts the links
 * inside <main> only: header, footer and navigation links are site-wide, so
 * they do not count as contextual links. Then it reports, per page:
 *
 *   - contextual in-links (how many pages link to it, and which),
 *   - contextual out-links,
 *   - links that point at a redirect (3xx) or a broken URL (4xx / 5xx),
 *   - orphans: pages with no contextual in-link.
 *
 * Links from the HTML sitemap (/[locale]/sitemap) and the AI info page
 * (/[locale]/ai-info) list every page by design, so they are reported as
 * "index links" and do not count as contextual in-links (pass
 * --count-index-pages to count them). Query strings and #fragments are ignored
 * when matching a link to a page; a page linking to itself is ignored.
 *
 * Writes docs/seo/link-audit.md and docs/seo/link-audit.csv.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CANONICAL_ORIGIN = 'https://www.wereact.agency';
const APEX_HOST = 'wereact.agency';
const INDEX_PAGE = /^\/(en|fr)\/(sitemap|ai-info)$/;
const CONCURRENCY = 6;

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const baseArg = args.find((arg) => !arg.startsWith('--'));
const outIndex = args.indexOf('--out');
const outDir = path.resolve(outIndex >= 0 ? args[outIndex + 1] : path.join(scriptDir, '..', '..', 'docs', 'seo'));
const countIndexPages = args.includes('--count-index-pages');

if (!baseArg) {
  console.error('Usage: node scripts/seo/link-audit.mjs <base-url> [--out <dir>] [--count-index-pages]');
  process.exit(1);
}

const base = new URL(baseArg);
const internalHosts = new Set([base.host, new URL(CANONICAL_ORIGIN).host, APEX_HOST]);

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

/** Path used to match a link to a page: no query, no fragment, no trailing slash. */
function pagePath(url) {
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

/** Map a canonical / apex URL onto the base URL so it can be fetched locally. */
function toLocal(url) {
  return new URL(url.pathname + url.search, base);
}

async function fetchWithStatus(url) {
  try {
    const response = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'wereact-link-audit/1.0' } });
    const location = response.headers.get('location');
    const body = response.status === 200 ? await response.text() : (await response.arrayBuffer(), '');
    return { status: response.status, location, body };
  } catch (error) {
    return { status: 0, location: null, body: '', error: String(error) };
  }
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

/** Return the HTML between `start` (just after an opening tag) and its matching closing tag. */
function balancedInner(html, start, tag) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = start;
  let depth = 1;
  let match;
  while ((match = re.exec(html))) {
    depth += match[1] ? -1 : 1;
    if (depth === 0) return { inner: html.slice(start, match.index), end: re.lastIndex };
  }
  return { inner: html.slice(start), end: html.length };
}

/**
 * React streams Suspense content out of order: the boundary sits in place as
 * `<template id="B:0">` and its content arrives later, outside <main>, as
 * `<div hidden id="S:0">…</div>` plus a `$RC("B:0","S:0")` script. Put the
 * segments back where they belong so links inside Suspense boundaries count.
 */
function resolveStreamedSegments(html) {
  const segmentForBoundary = new Map();
  for (const match of html.matchAll(/\$RC\("([^"]+)","([^"]+)"\)/g)) segmentForBoundary.set(match[1], match[2]);

  const segments = new Map();
  const opener = /<div hidden id="(S:[^"]+)">/g;
  let match;
  while ((match = opener.exec(html))) {
    const { inner, end } = balancedInner(html, opener.lastIndex, 'div');
    segments.set(match[1], inner);
    opener.lastIndex = end;
  }

  const fill = (fragment, depth = 0) =>
    depth > 20
      ? fragment
      : fragment.replace(/<template id="(B:[^"]+)"><\/template>/g, (whole, boundaryId) => {
          const segmentId = segmentForBoundary.get(boundaryId) ?? boundaryId.replace(/^B:/, 'S:');
          const segment = segments.get(segmentId);
          return segment === undefined ? whole : fill(segment, depth + 1);
        });

  return fill;
}

/** The content of the outermost <main> (pages may nest one inside the layout's), segments resolved. */
function extractMain(html) {
  const open = /<main\b[^>]*>/i.exec(html);
  if (!open) return '';
  const { inner } = balancedInner(html, open.index + open[0].length, 'main');
  const fill = resolveStreamedSegments(html);
  // Script and style text can contain markup-like strings (RSC payload, JSON-LD).
  return fill(inner).replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
}

function extractHrefs(fragment) {
  const hrefs = [];
  for (const match of fragment.matchAll(/<a\b[^>]*?\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    hrefs.push(decodeEntities(match[1] ?? match[2] ?? match[3] ?? ''));
  }
  return hrefs;
}

const csvCell = (value) => {
  const text = String(value ?? '');
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/* ------------------------------------------------------------------------ */
/* Crawl                                                                     */
/* ------------------------------------------------------------------------ */

const sitemapResponse = await fetchWithStatus(new URL('/sitemap.xml', base));
if (sitemapResponse.status !== 200) {
  console.error(`Could not read ${new URL('/sitemap.xml', base)} (HTTP ${sitemapResponse.status}).`);
  process.exit(1);
}

const sitemapUrls = [...sitemapResponse.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => new URL(decodeEntities(m[1])));
const pages = new Map(); // path -> page record
for (const url of sitemapUrls) {
  const key = pagePath(url);
  if (!pages.has(key)) {
    pages.set(key, {
      path: key,
      canonical: `${CANONICAL_ORIGIN}${key === '/' ? '' : key}`,
      status: null,
      inSources: new Set(),
      indexSources: new Set(),
      outTargets: new Set(),
      externalCount: 0,
      redirectLinks: [],
      brokenLinks: [],
    });
  }
}

console.log(`Sitemap: ${pages.size} pages. Fetching…`);

const links = []; // { source, target, href, host }
await mapLimit([...pages.values()], CONCURRENCY, async (page) => {
  const response = await fetchWithStatus(toLocal(new URL(page.path, CANONICAL_ORIGIN)));
  page.status = response.status;
  page.location = response.location;
  if (response.status !== 200) return;
  for (const href of extractHrefs(extractMain(response.body))) {
    if (!href || href.startsWith('#') || /^(mailto|tel|javascript|sms|whatsapp):/i.test(href)) continue;
    let url;
    try {
      url = new URL(href, new URL(page.path, CANONICAL_ORIGIN));
    } catch {
      continue;
    }
    if (!/^https?:$/.test(url.protocol)) continue;
    if (!internalHosts.has(url.host)) {
      page.externalCount += 1;
      continue;
    }
    links.push({ source: page.path, target: pagePath(url), href, host: url.host });
  }
});

/* ------------------------------------------------------------------------ */
/* Check every internal target once                                          */
/* ------------------------------------------------------------------------ */

const targetStatus = new Map(); // path -> { status, location }
const targetsToCheck = [...new Set(links.map((link) => link.target))].filter((target) => !pages.get(target)?.status);
await mapLimit(targetsToCheck, CONCURRENCY, async (target) => {
  const response = await fetchWithStatus(toLocal(new URL(target, CANONICAL_ORIGIN)));
  targetStatus.set(target, { status: response.status, location: response.location });
});
for (const page of pages.values()) targetStatus.set(page.path, { status: page.status, location: page.location });

const redirects = [];
const broken = [];
const notInSitemap = new Map(); // target -> Set(source)

for (const link of links) {
  const source = pages.get(link.source);
  const status = targetStatus.get(link.target) ?? { status: 0, location: null };
  const isApex = link.host === APEX_HOST;

  if (isApex || (status.status >= 300 && status.status < 400)) {
    const location = isApex ? `${CANONICAL_ORIGIN}${link.target}` : status.location;
    const entry = { source: link.source, href: link.href, status: isApex ? 308 : status.status, location };
    redirects.push(entry);
    source.redirectLinks.push(entry);
    continue;
  }
  if (status.status === 0 || status.status >= 400) {
    const entry = { source: link.source, href: link.href, status: status.status };
    broken.push(entry);
    source.brokenLinks.push(entry);
    continue;
  }
  if (link.target === link.source) continue; // self-link

  const target = pages.get(link.target);
  if (!target) {
    if (!notInSitemap.has(link.target)) notInSitemap.set(link.target, new Set());
    notInSitemap.get(link.target).add(link.source);
    continue;
  }
  source.outTargets.add(link.target);
  if (INDEX_PAGE.test(link.source) && !countIndexPages) target.indexSources.add(link.source);
  else target.inSources.add(link.source);
}

/* ------------------------------------------------------------------------ */
/* Report                                                                    */
/* ------------------------------------------------------------------------ */

const rows = [...pages.values()].sort(
  (a, b) => a.inSources.size - b.inSources.size || a.indexSources.size - b.indexSources.size || a.path.localeCompare(b.path),
);
const orphans = rows.filter((page) => page.inSources.size === 0);
const failedPages = rows.filter((page) => page.status !== 200);
const contextualPairs = rows.reduce((sum, page) => sum + page.inSources.size, 0);
const generatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const uniqueBy = (items, key) => [...new Map(items.map((item) => [key(item), item])).values()];
const redirectList = uniqueBy(redirects, (r) => `${r.source} ${r.href}`);
const brokenList = uniqueBy(broken, (b) => `${b.source} ${b.href}`);

const md = [];
md.push('# Internal link audit', '');
md.push(`Generated ${generatedAt} by \`scripts/seo/link-audit.mjs\` against \`${base.origin}\` (canonical host \`${CANONICAL_ORIGIN}\`), from the ${pages.size} URLs in \`/sitemap.xml\`.`, '');
md.push(
  'A contextual link is an `<a href>` inside `<main>`. Header, footer and navigation links are on every page and are ignored. ' +
    (countIndexPages
      ? 'Links from the HTML sitemap and AI info pages are counted like any other page (`--count-index-pages`). '
      : 'Links from the HTML sitemap (`/[locale]/sitemap`) and AI info page (`/[locale]/ai-info`) list every page by design, so they are shown as "index in-links" and do not count. ') +
    'Query strings and `#fragments` are ignored when matching a link to a page, and a page linking to itself is ignored. In-links count linking pages, not repeated links from the same page.',
  '',
);
md.push('## Summary', '');
md.push(`- Pages audited: **${pages.size}**${failedPages.length ? ` (${failedPages.length} did not return 200: ${failedPages.map((p) => `\`${p.path}\` ${p.status}`).join(', ')})` : ''}`);
md.push(`- Contextual page-to-page links: **${contextualPairs}**`);
md.push(`- Orphans (0 contextual in-links): **${orphans.length}**${orphans.length ? '' : ' — none'}`);
for (const page of orphans) md.push(`  - \`${page.path}\`${page.indexSources.size ? ` (only linked from ${[...page.indexSources].map((s) => `\`${s}\``).join(', ')})` : ''}`);
md.push(`- Links pointing at a redirect: **${redirectList.length}**${redirectList.length ? '' : ' — none'}`);
for (const entry of redirectList) md.push(`  - \`${entry.source}\` → \`${entry.href}\` (${entry.status} → \`${entry.location ?? '?'}\`)`);
md.push(`- Broken internal links: **${brokenList.length}**${brokenList.length ? '' : ' — none'}`);
for (const entry of brokenList) md.push(`  - \`${entry.source}\` → \`${entry.href}\` (${entry.status || 'no response'})`);
if (notInSitemap.size) {
  md.push(`- Internal targets that work but are not in the sitemap: **${notInSitemap.size}**`);
  for (const [target, sources] of notInSitemap) md.push(`  - \`${target}\` (from ${[...sources].map((s) => `\`${s}\``).join(', ')})`);
}
md.push('', '## Pages by contextual in-links (fewest first)', '');
md.push('| Page | In-links | Index in-links | Out-links | Redirect / broken links | Linked from |');
md.push('| --- | ---: | ---: | ---: | ---: | --- |');
for (const page of rows) {
  const from = [...page.inSources].sort().map((s) => `\`${s}\``).join(', ') || '—';
  md.push(`| \`${page.path}\` | ${page.inSources.size} | ${page.indexSources.size} | ${page.outTargets.size} | ${page.redirectLinks.length + page.brokenLinks.length} | ${from} |`);
}
md.push('', 'CSV with the same data: `link-audit.csv`.', '');

const csv = [
  ['url', 'path', 'status', 'contextual_inlinks', 'index_inlinks', 'contextual_outlinks', 'external_links', 'redirect_links', 'broken_links', 'inlink_sources', 'redirect_targets', 'broken_targets'].join(','),
  ...rows.map((page) =>
    [
      page.canonical,
      page.path,
      page.status,
      page.inSources.size,
      page.indexSources.size,
      page.outTargets.size,
      page.externalCount,
      page.redirectLinks.length,
      page.brokenLinks.length,
      [...page.inSources].sort().join(';'),
      uniqueBy(page.redirectLinks, (r) => r.href).map((r) => r.href).join(';'),
      uniqueBy(page.brokenLinks, (b) => b.href).map((b) => b.href).join(';'),
    ].map(csvCell).join(','),
  ),
].join('\n');

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'link-audit.md'), md.join('\n'));
await writeFile(path.join(outDir, 'link-audit.csv'), `${csv}\n`);

console.log(`Pages: ${pages.size} | contextual links: ${contextualPairs} | orphans: ${orphans.length} | redirect links: ${redirectList.length} | broken links: ${brokenList.length}`);
if (orphans.length) console.log(`Orphans:\n${orphans.map((p) => `  ${p.path}`).join('\n')}`);
if (redirectList.length) console.log(`Redirect links:\n${redirectList.map((r) => `  ${r.source} -> ${r.href} (${r.status} -> ${r.location})`).join('\n')}`);
if (brokenList.length) console.log(`Broken links:\n${brokenList.map((b) => `  ${b.source} -> ${b.href} (${b.status})`).join('\n')}`);
console.log(`Fewest contextual in-links:\n${rows.slice(0, 12).map((p) => `  ${String(p.inSources.size).padStart(3)}  ${p.path}`).join('\n')}`);
console.log(`Wrote ${path.join(outDir, 'link-audit.md')} and link-audit.csv`);
