import { chromium } from 'playwright';

const OUT = process.argv[2];
const URL = process.argv[3] || 'http://localhost:3101/en';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// Find the gallery heading and capture as it scrolls past center.
const target = await page.evaluate(() => {
  const el = Array.from(document.querySelectorAll('section')).find((s) =>
    /Real work|made by humans/i.test(s.textContent || '')
  );
  if (!el) return null;
  const top = el.getBoundingClientRect().top + window.scrollY;
  return top;
});

if (target == null) {
  console.log('gallery not found');
} else {
  const positions = [target - 600, target - 200, target + 150, target + 450];
  for (let i = 0; i < positions.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), positions[i]);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/gal-${i}.png` });
  }
  console.log('done', target);
}
await browser.close();
