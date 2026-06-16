import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const outDir = path.join(process.cwd(), 'public', 'images', 'greenops');
const blogDir = path.join(process.cwd(), 'public', 'images', 'blog');

await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(blogDir, { recursive: true });

const colors = {
  primary: '#3A5A40',
  dark: '#2e4833',
  bg: '#F6F6F2',
  light: '#E3E3DC',
  sage: '#A3B18A',
  muted: '#5F5F5F',
  white: '#FFFFFF',
};

function panel({ title, label, domain, metricA, metricB, variant = 'grid' }) {
  const hatch =
    variant === 'map'
      ? `<path d="M120 420 C280 260 470 490 660 250 S970 160 1080 340" fill="none" stroke="${colors.sage}" stroke-width="18" stroke-linecap="round" opacity=".32"/>
       <path d="M170 500 C360 350 510 600 780 360 S940 300 1040 450" fill="none" stroke="${colors.primary}" stroke-width="4" stroke-dasharray="10 14" opacity=".7"/>`
      : `<g opacity=".12">${Array.from({ length: 26 }, (_, i) => `<path d="M${i * 54} 0L${i * 54 - 240} 720" stroke="${colors.primary}" stroke-width="1"/>`).join('')}</g>`;

  return `<svg width="1200" height="720" viewBox="0 0 1200 720" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="720" fill="${colors.bg}"/>
    ${hatch}
    <rect x="48" y="48" width="1104" height="624" rx="8" fill="${colors.white}" stroke="${colors.primary}" stroke-opacity=".22"/>
    <rect x="82" y="82" width="1036" height="60" rx="6" fill="${colors.primary}"/>
    <text x="112" y="121" fill="${colors.bg}" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="4">${label}</text>
    <circle cx="1050" cy="112" r="8" fill="${colors.sage}"/>
    <circle cx="1078" cy="112" r="8" fill="${colors.light}"/>
    <circle cx="1106" cy="112" r="8" fill="${colors.bg}"/>
    <text x="84" y="255" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="74" font-weight="900" letter-spacing="-3">${title}</text>
    <text x="88" y="305" fill="${colors.muted}" font-family="Arial, sans-serif" font-size="25">${domain}</text>
    <rect x="88" y="382" width="300" height="170" rx="8" fill="${colors.bg}" stroke="${colors.primary}" stroke-opacity=".18"/>
    <text x="116" y="435" fill="${colors.muted}" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="3">SIGNAL 01</text>
    <text x="116" y="498" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="56" font-weight="900">${metricA}</text>
    <rect x="422" y="382" width="300" height="170" rx="8" fill="${colors.bg}" stroke="${colors.primary}" stroke-opacity=".18"/>
    <text x="450" y="435" fill="${colors.muted}" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="3">SIGNAL 02</text>
    <text x="450" y="498" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="56" font-weight="900">${metricB}</text>
    <rect x="780" y="210" width="290" height="370" rx="8" fill="${colors.dark}"/>
    <rect x="812" y="244" width="226" height="18" rx="4" fill="${colors.light}" opacity=".9"/>
    <rect x="812" y="292" width="164" height="18" rx="4" fill="${colors.sage}" opacity=".65"/>
    <rect x="812" y="358" width="210" height="78" rx="6" fill="${colors.bg}" opacity=".92"/>
    <rect x="812" y="462" width="126" height="78" rx="6" fill="${colors.bg}" opacity=".72"/>
    <rect x="960" y="462" width="78" height="78" rx="6" fill="${colors.sage}" opacity=".85"/>
  </svg>`;
}

const assets = [
  [
    'hero-command.webp',
    panel({
      title: 'WeReact Ops',
      label: 'GREENOPS COMMAND CENTER',
      domain: 'Marrakech / Morocco / Global',
      metricA: '15+',
      metricB: '24H',
      variant: 'map',
    }),
  ],
  [
    'system-map.webp',
    panel({
      title: 'Launch Map',
      label: 'WEBSITE DELIVERY SYSTEM',
      domain: 'Strategy -> Design -> Build -> SEO',
      metricA: 'SEO',
      metricB: 'UX',
      variant: 'map',
    }),
  ],
  [
    'showcase-trustdrivers.webp',
    panel({
      title: 'Trust Drivers',
      label: 'SHOWCASE NODE',
      domain: 'www.trustdrivers.tours',
      metricA: 'TOUR',
      metricB: 'TRUST',
    }),
  ],
  [
    'showcase-yoomarrakech.webp',
    panel({
      title: 'Yoo Marrakech',
      label: 'SHOWCASE NODE',
      domain: 'www.yoomarrakech.com',
      metricA: 'LOCAL',
      metricB: 'CITY',
    }),
  ],
  [
    'showcase-atlasguide.webp',
    panel({
      title: 'Atlas Guide',
      label: 'SHOWCASE NODE',
      domain: 'www.moroccoatlasguide.com',
      metricA: 'ATLAS',
      metricB: 'GEO',
    }),
  ],
];

for (const [name, svg] of assets) {
  await sharp(Buffer.from(svg)).webp({ quality: 92 }).toFile(path.join(outDir, name));
}

await sharp(
  Buffer.from(
    panel({
      title: 'Web Design Marrakech',
      label: 'SEO BRIEFING',
      domain: 'Business websites built for local visibility',
      metricA: 'GEO',
      metricB: 'LEADS',
      variant: 'map',
    })
  )
)
  .png({ quality: 92 })
  .toFile(path.join(blogDir, 'marrakech-web-design.png'));

await sharp(
  Buffer.from(
    panel({
      title: 'Tourism SEO Morocco',
      label: 'GEO SEARCH BRIEFING',
      domain: 'Hospitality, tours, travel and local discovery',
      metricA: 'SEO',
      metricB: 'BOOK',
      variant: 'map',
    })
  )
)
  .png({ quality: 92 })
  .toFile(path.join(blogDir, 'morocco-tourism-seo.png'));

console.log('Generated GreenOps assets.');
