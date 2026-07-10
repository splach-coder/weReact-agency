import { chromium } from 'playwright';

const OUT = process.argv[2] || '.';
const URL = process.argv[3] || 'http://localhost:3100/en';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const total = await page.evaluate(() => document.body.scrollHeight);
const vh = 900;
const steps = Math.min(12, Math.max(3, Math.ceil(total / vh)));

for (let i = 0; i < steps; i++) {
  const y = Math.round((i * (total - vh)) / (steps - 1));
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/shot-${String(i).padStart(2, '0')}.png` });
}

console.log(JSON.stringify({ total, steps }));
await browser.close();
