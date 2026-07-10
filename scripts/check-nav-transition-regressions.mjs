import { chromium } from 'playwright';

const baseUrl = process.env.CHECK_URL ?? 'http://localhost:3000/en';

function matrixTranslateY(transform) {
  if (!transform || transform === 'none') return 0;
  const match = transform.match(/^matrix\(([^)]+)\)$/);
  if (!match) return Number.NaN;
  const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()));
  return parts[5] ?? Number.NaN;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const header = page.locator('header');
  const menuButton = header.getByRole('button', { name: 'Menu' });
  await menuButton.click();
  await page.waitForFunction(() => {
    const button = document.querySelector('header button');
    return button?.getAttribute('aria-expanded') === 'true';
  });
  await page.waitForTimeout(1400);

  const menuWordTransform = await page.locator('.menu-word').first().evaluate((el) => {
    return window.getComputedStyle(el).transform;
  });
  const menuWordY = matrixTranslateY(menuWordTransform);

  if (!Number.isFinite(menuWordY) || Math.abs(menuWordY) > 1) {
    throw new Error(`Menu word should finish at translateY(0), got ${menuWordTransform}`);
  }

  await header.getByRole('button', { name: 'Close' }).click();
  await page.waitForTimeout(900);

  await header.getByRole('link', { name: /wereact/i }).click();
  await page.waitForTimeout(1400);

  const curtainPath = await page.locator('[data-page-transition-curtain]').getAttribute('d');

  if (curtainPath !== 'M 0 0 V 0 Q 50 0 100 0 V 0 z') {
    throw new Error(`Same-route logo click should reveal the curtain, got "${curtainPath}"`);
  }
} finally {
  await browser.close();
}
