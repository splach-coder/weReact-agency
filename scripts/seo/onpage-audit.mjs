// On-page SEO audit of every URL in the sitemap. Zero dependencies (Node 22+).
//
//   node scripts/seo/onpage-audit.mjs [base-url]      default https://www.wereact.agency
//
// Checks per page: HTTP status, <title> and meta description length, duplicates across the site,
// one <h1>, self canonical, hreflang en/fr/x-default present and reciprocal, html lang, robots meta,
// Open Graph title/description/image (and that the image loads), JSON-LD that parses, images without
// alt text or without width/height, main-content word count. Writes docs/seo/onpage-audit.md + .json.

import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = (process.argv[2] || 'https://www.wereact.agency').replace(/\/$/, '');
const CANON = 'https://www.wereact.agency';
const UA = 'Mozilla/5.0 (compatible; WeReactAudit/1.0)';
const toLocal = (u) => u.replace(CANON, BASE);
const toCanon = (u) => u.replace(BASE, CANON);

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const attr = (tag, name) => {
  const m = new RegExp(`${name}="([^"]*)"`, 'i').exec(tag);
  return m ? decode(m[1]) : null;
};

const sitemap = await (await fetch(`${BASE}/sitemap.xml`, { headers: { 'User-Agent': UA } })).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const pages = [];
const imageCache = new Map();

for (const url of urls) {
  const res = await fetch(toLocal(url), { headers: { 'User-Agent': UA }, redirect: 'manual' });
  const html = res.status === 200 ? await res.text() : '';
  const head = (html.match(/<head[\s\S]*?<\/head>/i) || [''])[0];
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  const meta = (key) => {
    const tag = metas.find((t) => attr(t, 'name') === key || attr(t, 'property') === key);
    return tag ? attr(tag, 'content') : null;
  };
  const title = decode((head.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '');
  const canonical = links.map((l) => (attr(l, 'rel') === 'canonical' ? attr(l, 'href') : null)).find(Boolean) || null;
  const hreflang = Object.fromEntries(
    links.filter((l) => attr(l, 'rel') === 'alternate' && attr(l, 'hreflang')).map((l) => [attr(l, 'hreflang'), attr(l, 'href')]),
  );
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const main = (body.match(/<main[\s\S]*<\/main>/i) || [body])[0];
  const words = decode(main.replace(/<[^>]+>/g, ' ')).split(/\s+/).filter(Boolean).length;
  const h1 = (main.match(/<h1\b/gi) || []).length;
  const imgs = [...main.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => attr(t, 'alt') === null).length;
  const noSize = imgs.filter((t) => !attr(t, 'width') && !/fill|absolute/.test(attr(t, 'style') || '') && !/data-nimg="fill"/.test(t)).length;
  const ld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => {
    try {
      const j = JSON.parse(m[1]);
      return { ok: true, type: j['@type'] || (j['@graph'] ? 'graph' : '?') };
    } catch (e) {
      return { ok: false, error: e.message.slice(0, 80) };
    }
  });
  const ogImage = meta('og:image');
  if (ogImage && !imageCache.has(ogImage)) {
    const r = await fetch(toLocal(ogImage), { method: 'HEAD', headers: { 'User-Agent': UA } }).catch(() => null);
    imageCache.set(ogImage, r ? `${r.status} ${r.headers.get('content-type') || ''} ${r.headers.get('content-length') || '?'}B` : 'error');
  }
  pages.push({
    url, status: res.status, title, titleLen: title.length, description: meta('description') || '', descLen: (meta('description') || '').length,
    canonical, hreflang, lang: (html.match(/<html[^>]*\blang="([^"]+)"/i) || [])[1] || null, robots: meta('robots'),
    ogTitle: meta('og:title'), ogDescription: meta('og:description'), ogImage, ogImageStatus: ogImage ? imageCache.get(ogImage) : null,
    h1, words, images: imgs.length, noAlt, noSize, ld,
  });
}

// ---------- findings ----------
const issues = [];
const add = (severity, url, issue) => issues.push({ severity, url: url.replace(CANON, ''), issue });
const titleCount = new Map();
const descCount = new Map();
for (const p of pages) {
  titleCount.set(p.title, (titleCount.get(p.title) || 0) + 1);
  descCount.set(p.description, (descCount.get(p.description) || 0) + 1);
}
const byUrl = new Map(pages.map((p) => [p.url, p]));
for (const p of pages) {
  const loc = p.url.match(/wereact\.agency\/(en|fr)/)?.[1];
  if (p.status !== 200) add('critical', p.url, `HTTP ${p.status}`);
  if (!p.title) add('critical', p.url, 'missing <title>');
  else if (p.titleLen > 65) add('warning', p.url, `title ${p.titleLen} chars (Google shows ~60): "${p.title}"`);
  else if (p.titleLen < 25) add('info', p.url, `short title (${p.titleLen}): "${p.title}"`);
  if (titleCount.get(p.title) > 1) add('warning', p.url, `duplicate title: "${p.title}"`);
  if (!p.description) add('critical', p.url, 'missing meta description');
  else if (p.descLen > 165) add('info', p.url, `meta description ${p.descLen} chars (Google shows ~155)`);
  else if (p.descLen < 70) add('warning', p.url, `short meta description (${p.descLen})`);
  if (p.description && descCount.get(p.description) > 1) add('warning', p.url, 'duplicate meta description');
  if (p.h1 !== 1) add('warning', p.url, `${p.h1} <h1> in main`);
  if (toCanon(p.canonical || '') !== p.url) add('critical', p.url, `canonical is ${p.canonical}`);
  if (p.robots && /noindex/i.test(p.robots)) add('critical', p.url, `robots meta: ${p.robots}`);
  if (loc && p.lang !== loc) add('warning', p.url, `html lang="${p.lang}"`);
  for (const k of ['en', 'fr', 'x-default']) if (!p.hreflang[k]) add('warning', p.url, `no hreflang ${k}`);
  for (const k of ['en', 'fr']) {
    const target = p.hreflang[k] && byUrl.get(toCanon(p.hreflang[k]));
    if (p.hreflang[k] && target && !Object.values(target.hreflang).map(toCanon).includes(p.url)) add('warning', p.url, `hreflang ${k} not reciprocal`);
    if (p.hreflang[k] && !byUrl.has(toCanon(p.hreflang[k]))) add('warning', p.url, `hreflang ${k} points outside the sitemap: ${p.hreflang[k]}`);
  }
  if (!p.ogImage) add('warning', p.url, 'no og:image');
  else if (!/^200 image\//.test(p.ogImageStatus || '')) add('warning', p.url, `og:image not loading as an image: ${p.ogImageStatus}`);
  if (!p.ogTitle || !p.ogDescription) add('info', p.url, 'og:title or og:description missing');
  for (const l of p.ld) if (!l.ok) add('critical', p.url, `JSON-LD does not parse: ${l.error}`);
  if (p.noAlt) add('warning', p.url, `${p.noAlt} image(s) without alt`);
  if (p.words < 250 && !/\/(contact|book|sitemap)$/.test(p.url)) add('info', p.url, `thin main content (${p.words} words)`);
}

mkdirSync('docs/seo', { recursive: true });
writeFileSync('docs/seo/onpage-audit.json', JSON.stringify({ base: BASE, generatedAt: new Date().toISOString(), pages, issues }, null, 1));
const order = { critical: 0, warning: 1, info: 2 };
issues.sort((a, b) => order[a.severity] - order[b.severity] || a.url.localeCompare(b.url));
const counts = issues.reduce((c, i) => ({ ...c, [i.severity]: (c[i.severity] || 0) + 1 }), {});
const md = [
  '# On-page SEO audit',
  '',
  `Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')}Z by \`scripts/seo/onpage-audit.mjs\` against \`${BASE}\`, ${pages.length} URLs from the sitemap.`,
  '',
  `**Critical:** ${counts.critical || 0} · **Warnings:** ${counts.warning || 0} · **Info:** ${counts.info || 0}`,
  '',
  '| Severity | Page | Issue |',
  '|---|---|---|',
  ...issues.map((i) => `| ${i.severity} | ${i.url} | ${i.issue.replace(/\|/g, '\\|')} |`),
  '',
  '## Pages',
  '',
  '| Page | Title (chars) | Description (chars) | H1 | Words | Images (no alt) | JSON-LD |',
  '|---|---|---|---|---|---|---|',
  ...pages.map((p) => `| ${p.url.replace(CANON, '')} | ${p.titleLen} | ${p.descLen} | ${p.h1} | ${p.words} | ${p.images} (${p.noAlt}) | ${p.ld.map((l) => (l.ok ? l.type : 'ERR')).join(', ')} |`),
  '',
];
writeFileSync('docs/seo/onpage-audit.md', md.join('\n'));
console.log(`${pages.length} pages · critical ${counts.critical || 0} · warnings ${counts.warning || 0} · info ${counts.info || 0}`);
