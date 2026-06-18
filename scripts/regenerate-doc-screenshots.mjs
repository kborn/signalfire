import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const repoRoot = path.resolve(scriptDir, '..');
const require = createRequire(import.meta.url);
const playwrightModulePath = require.resolve('@playwright/test', {
  paths: [process.cwd(), repoRoot, path.resolve(repoRoot, 'node_modules')],
});
const playwright = await import(pathToFileURL(playwrightModulePath).href);
const chromium = playwright.chromium ?? playwright.default?.chromium;

const baseUrl = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:3000';
const adminEmail = process.env.SCREENSHOT_ADMIN_EMAIL ?? 'admin@example.com';
const adminPassword = process.env.SCREENSHOT_ADMIN_PASSWORD ?? 'FindYourFight1';

const outputDir = path.resolve(repoRoot, 'docs/screenshots');

const screenshotCaptures = {
  '01-home.png': async (page) => {
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, '01-home.png') });
  },
  '01b-home-lower.png': async (page) => {
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() =>
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'instant' }),
    );
    await page.screenshot({ path: path.join(outputDir, '01b-home-lower.png') });
  },
  '02-topics-index.png': async (page) => {
    await page.goto(`${baseUrl}/topics`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, '02-topics-index.png') });
  },
  '03-topic-detail.png': async (page) => {
    await page.goto(`${baseUrl}/topics/climate`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, '03-topic-detail.png') });
  },
  '04-article-detail.png': async (page) => {
    await page.goto(
      `${baseUrl}/articles/building-a-local-campaign-from-first-meeting-to-public-pressure`,
      { waitUntil: 'networkidle' },
    );
    await page.screenshot({ path: path.join(outputDir, '04-article-detail.png') });
  },
  '04b-action-detail.png': async (page) => {
    await page.goto(`${baseUrl}/actions/join-neighborhood-climate-coalition`, {
      waitUntil: 'networkidle',
    });
    await page.screenshot({ path: path.join(outputDir, '04b-action-detail.png') });
  },
  '05-events-index.png': async (page) => {
    await page.goto(`${baseUrl}/events`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, '05-events-index.png') });
  },
  '06-submit-entry.png': async (page) => {
    await page.goto(`${baseUrl}/submit`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outputDir, '06-submit-entry.png') });
  },
};

async function loginToAdmin(page) {
  await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' });
  await page.getByLabel('Email').fill(adminEmail);
  await page.getByLabel('Password').fill(adminPassword);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL(/\/admin(\/.*)?$/, { timeout: 15_000 });
  await waitForAdminSessionCookie(page);
}

async function waitForAdminSessionCookie(page, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const cookies = await page.context().cookies();
    if (cookies.some((cookie) => cookie.name === 'signal-fire-admin-session')) {
      return;
    }
    await page.waitForTimeout(250);
  }

  throw new Error('Timed out waiting for the admin session cookie after login.');
}

async function captureAdminScreenshots(page) {
  await loginToAdmin(page);

  await page.goto(`${baseUrl}/admin/submissions?status=PENDING`, { waitUntil: 'networkidle' });
  const queuePath = path.join(outputDir, '07-admin-submissions-queue.png');
  const queueTempPath = queuePath.replace(/\.png$/, '.tmp.png');
  await page.screenshot({ path: queueTempPath });

  const pendingLink = page.locator('a.adminTableRecordLink').first();
  const pendingCount = await pendingLink.count();
  if (pendingCount === 0) {
    await fs.rm(queueTempPath, { force: true });
    throw new Error(
      'Screenshot capture expected at least one pending submission in /admin/submissions?status=PENDING. Reseed demo data before regenerating screenshots.',
    );
  }

  await pendingLink.waitFor({ state: 'visible', timeout: 15_000 });
  await pendingLink.click();
  await page.waitForLoadState('networkidle');
  const reviewPath = path.join(outputDir, '08-submission-review.png');
  const reviewTempPath = reviewPath.replace(/\.png$/, '.tmp.png');
  await page.screenshot({ path: reviewTempPath });

  await page.goto(`${baseUrl}/admin/submissions?status=APPROVED`, { waitUntil: 'networkidle' });
  const approvedLink = page.locator('a.adminTableRecordLink').first();
  const approvedCount = await approvedLink.count();
  if (approvedCount === 0) {
    await fs.rm(queueTempPath, { force: true });
    await fs.rm(reviewTempPath, { force: true });
    throw new Error(
      'Screenshot capture expected at least one approved submission in /admin/submissions?status=APPROVED. Reseed demo data before regenerating screenshots.',
    );
  }

  await approvedLink.waitFor({ state: 'visible', timeout: 15_000 });
  await approvedLink.click();
  await page.waitForLoadState('networkidle');

  const decisionPath = path.join(outputDir, '09-submission-review-decision.png');
  const decisionTempPath = decisionPath.replace(/\.png$/, '.tmp.png');
  const outcomePanel = page
    .locator('section.adminPanel')
    .filter({ has: page.getByRole('heading', { name: 'Review outcome' }) });
  await outcomePanel.screenshot({
    path: decisionTempPath,
  });

  await fs.rename(queueTempPath, queuePath);
  await fs.rename(reviewTempPath, reviewPath);
  await fs.rename(decisionTempPath, decisionPath);
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    colorScheme: 'dark',
  });

  try {
    for (const capture of Object.values(screenshotCaptures)) {
      await capture(page);
    }
    await captureAdminScreenshots(page);
  } finally {
    await page.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
