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

function patternLines(opacity = 0.14) {
  return `<g opacity="${opacity}">
    ${Array.from({ length: 30 }, (_, i) => `<path d="M${-180 + i * 58} 0L${-420 + i * 58} 720" stroke="${colors.primary}" stroke-width="1"/>`).join('')}
  </g>`;
}

function mapRoute(points, stroke = colors.primary, width = 5) {
  return `<path d="${points}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 18" opacity=".72"/>`;
}

function pin(x, y, label) {
  return `<g transform="translate(${x} ${y})">
    <path d="M0 -44C-28 -44 -50 -23 -50 5C-50 43 0 86 0 86S50 43 50 5C50 -23 28 -44 0 -44Z" fill="${colors.primary}"/>
    <circle cx="0" cy="4" r="18" fill="${colors.bg}"/>
    ${label ? `<text x="0" y="130" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="17" font-weight="900" letter-spacing="3">${label}</text>` : ''}
  </g>`;
}

function browserWindow({ x, y, w, h, title, lines = [] }) {
  return `<g transform="translate(${x} ${y})">
    <rect width="${w}" height="${h}" rx="18" fill="${colors.white}" stroke="${colors.primary}" stroke-opacity=".18"/>
    <rect x="0" y="0" width="${w}" height="56" rx="18" fill="${colors.primary}"/>
    <rect x="0" y="36" width="${w}" height="20" fill="${colors.primary}"/>
    <circle cx="${w - 86}" cy="28" r="7" fill="${colors.sage}"/>
    <circle cx="${w - 58}" cy="28" r="7" fill="${colors.light}"/>
    <circle cx="${w - 30}" cy="28" r="7" fill="${colors.bg}"/>
    <text x="28" y="36" fill="${colors.bg}" font-family="Arial, sans-serif" font-size="17" font-weight="900" letter-spacing="3">${title}</text>
    ${lines.map((line, i) => `<rect x="34" y="${92 + i * 46}" width="${line}" height="18" rx="9" fill="${i === 0 ? colors.primary : colors.sage}" opacity="${i === 0 ? '.86' : '.5'}"/>`).join('')}
  </g>`;
}

function blogCover({ eyebrow, titleTop, titleBottom, subtitle, scene, steps }) {
  const scenic =
    scene === 'marrakech'
      ? `<g transform="translate(690 114)">
          <path d="M82 396V190C82 104 151 34 236 34C322 34 392 104 392 190V396Z" fill="${colors.primary}"/>
          <path d="M137 396V201C137 145 181 100 236 100C291 100 337 145 337 201V396Z" fill="${colors.bg}" opacity=".93"/>
          <path d="M180 396V229C180 199 204 175 236 175C267 175 292 199 292 229V396Z" fill="${colors.sage}" opacity=".72"/>
          <rect x="36" y="324" width="438" height="110" rx="12" fill="${colors.dark}"/>
          <rect x="75" y="354" width="125" height="18" rx="9" fill="${colors.bg}" opacity=".9"/>
          <rect x="75" y="389" width="205" height="15" rx="8" fill="${colors.sage}" opacity=".7"/>
          ${pin(408, 134, '')}
        </g>`
      : `<g transform="translate(650 96)">
          <path d="M30 418L218 176L330 318L428 126L574 418Z" fill="${colors.primary}"/>
          <path d="M218 176L257 225L184 225Z" fill="${colors.bg}" opacity=".9"/>
          <path d="M428 126L465 175L396 175Z" fill="${colors.bg}" opacity=".9"/>
          <path d="M64 468C178 405 276 480 396 415C474 372 544 382 624 432" fill="none" stroke="${colors.sage}" stroke-width="18" stroke-linecap="round" opacity=".78"/>
          ${mapRoute('M70 520C185 448 300 552 418 470C500 413 564 430 638 492', colors.bg, 7)}
          ${pin(116, 172, '')}
        </g>`;

  return `<svg width="1200" height="720" viewBox="0 0 1200 720" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="${colors.primary}" flood-opacity=".14"/>
      </filter>
      <linearGradient id="fade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${colors.white}"/>
        <stop offset="100%" stop-color="${colors.light}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="720" fill="${colors.bg}"/>
    ${patternLines(.1)}
    <circle cx="1038" cy="92" r="230" fill="${colors.sage}" opacity=".2"/>
    <circle cx="120" cy="650" r="260" fill="${colors.primary}" opacity=".06"/>

    <rect x="54" y="52" width="1092" height="616" rx="26" fill="url(#fade)" stroke="${colors.primary}" stroke-opacity=".16" filter="url(#shadow)"/>
    <rect x="86" y="86" width="1028" height="58" rx="14" fill="${colors.primary}"/>
    <text x="118" y="124" fill="${colors.bg}" font-family="Arial, sans-serif" font-size="18" font-weight="900" letter-spacing="4">${eyebrow}</text>
    <circle cx="1042" cy="115" r="7" fill="${colors.sage}"/>
    <circle cx="1070" cy="115" r="7" fill="${colors.light}"/>
    <circle cx="1098" cy="115" r="7" fill="${colors.bg}"/>

    <g transform="translate(102 220)">
      <text x="0" y="0" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="74" font-weight="900" letter-spacing="-2">${titleTop}</text>
      <text x="0" y="82" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="74" font-weight="900" letter-spacing="-2">${titleBottom}</text>
      <text x="4" y="136" fill="${colors.muted}" font-family="Arial, sans-serif" font-size="27">${subtitle}</text>
    </g>

    <g transform="translate(104 440)">
      ${steps.map((step, i) => `<g transform="translate(${i * 190} 0)">
        <rect width="152" height="122" rx="14" fill="${colors.white}" stroke="${colors.primary}" stroke-opacity=".14"/>
        <text x="24" y="42" fill="${colors.muted}" font-family="Arial, sans-serif" font-size="14" font-weight="900" letter-spacing="3">STEP ${String(i + 1).padStart(2, '0')}</text>
        <text x="24" y="88" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="32" font-weight="900">${step}</text>
      </g>`).join('')}
    </g>

    ${scenic}
    ${browserWindow({
      x: 802,
      y: 442,
      w: 286,
      h: 150,
      title: scene === 'marrakech' ? 'LOCAL SEARCH' : 'BOOKING PATH',
      lines: [196, 150],
    })}
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
    blogCover({
      eyebrow: 'MARRAKECH LOCAL SEO',
      titleTop: 'Web Design',
      titleBottom: 'Marrakech',
      subtitle: 'Local visibility, trust, speed and client inquiries',
      scene: 'marrakech',
      steps: ['FIND', 'TRUST', 'LEADS'],
    })
  )
)
  .png({ quality: 92 })
  .toFile(path.join(blogDir, 'marrakech-web-design.png'));

await sharp(
  Buffer.from(
    blogCover({
      eyebrow: 'MOROCCO TOURISM SEO',
      titleTop: 'Tourism SEO',
      titleBottom: 'Morocco',
      subtitle: 'Destination pages, trust signals and direct bookings',
      scene: 'tourism',
      steps: ['SEARCH', 'PLAN', 'BOOK'],
    })
  )
)
  .png({ quality: 92 })
  .toFile(path.join(blogDir, 'morocco-tourism-seo.png'));

console.log('Generated GreenOps assets.');
