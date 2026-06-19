import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const screenshotDir = path.join(rootDir, 'docs', 'screenshots');
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:3000';
const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'FindYourFight1';
const requireFromApi = createRequire(path.join(rootDir, 'apps', 'api', 'package.json'));
const { chromium } = requireFromApi('@playwright/test');

await mkdir(screenshotDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1200 },
  colorScheme: 'dark',
});
const page = await context.newPage();

async function waitForPage() {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(750);
}

async function capture(name, route, options = {}) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  await waitForPage();

  if (options.beforeScreenshot) {
    await options.beforeScreenshot();
    await page.waitForTimeout(500);
  }

  await page.screenshot({
    path: path.join(screenshotDir, name),
    fullPage: false,
  });
}

// Public pages
await capture('01-home.png', '/');
await capture('02-topics.png', '/topics');
await capture('03-events.png', '/events');
await capture('04-action-detail.png', '/actions/join-statewide-day-of-action-turnout-team');

// Admin — requires login
await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' });
await waitForPage();
await page.getByLabel('Email').fill(adminEmail);
await page.getByLabel('Password').fill(adminPassword);
await page.getByRole('button', { name: 'Log in' }).click();
await page.waitForURL('**/admin');
await waitForPage();

await capture('05-submission-review.png', '/admin/submissions/34');

await browser.close();
