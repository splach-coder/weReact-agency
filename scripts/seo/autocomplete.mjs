// Keyword discovery from Google Autocomplete (free, no key). Zero dependencies.
//
//   node scripts/seo/autocomplete.mjs --seeds seeds.tsv --out suggestions.csv [--expand] [--gl ma]
//
// seeds.tsv: one seed per line as "<segment><TAB><lang><TAB><seed>", e.g.
//   tour-operators	fr	site web agence de voyage
// --expand also queries "<seed> a" ... "<seed> z" (the classic "alphabet soup").
// Output: segment, lang, seed, suggestion, depth (0 = direct suggestion, 1 = from an expansion).
// Polite by design: one request at a time with a pause between requests.

import { readFileSync, writeFileSync } from 'node:fs';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const expand = process.argv.includes('--expand');
const gl = arg('gl', 'ma');
const pause = Number(arg('pause', '350'));

const seeds = readFileSync(arg('seeds'), 'utf8')
  .split(/\r?\n/)
  .map((l) => l.split('\t'))
  .filter((p) => p.length === 3 && p[2].trim());

const rows = [];
const seen = new Set();
for (const [segment, lang, seed] of seeds) {
  const queries = [[seed, 0]];
  if (expand) for (const c of 'abcdefghijklmnopqrstuvwxyz') queries.push([`${seed} ${c}`, 1]);
  for (const [q, depth] of queries) {
    for (const s of await suggest(q, lang)) {
      const key = `${segment}|${s}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push([segment, lang, seed, s, depth]);
    }
    await new Promise((r) => setTimeout(r, pause));
  }
  process.stdout.write('.');
}

const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
writeFileSync(
  arg('out', 'suggestions.csv'),
  '﻿' + ['segment,lang,seed,suggestion,depth', ...rows.map((r) => r.map(cell).join(','))].join('\n') + '\n'
);
console.log(`\n${rows.length} suggestions from ${seeds.length} seeds`);

async function suggest(q, hl) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&q=${encodeURIComponent(q)}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10_000) });
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 5000 * (attempt + 1))); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      // The endpoint answers in the charset of the hl locale; UTF-8 for fr/en/ar with client=firefox.
      const data = JSON.parse(buf.toString('utf8'));
      return (data[1] || []).map((s) => s.toLowerCase().trim());
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return [];
}
