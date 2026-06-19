import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const repoRoot = path.resolve(scriptDir, '..');
const playwrightModulePath = require.resolve('@playwright/test', {
  paths: [process.cwd(), repoRoot, path.resolve(repoRoot, 'apps/api')],
});
const playwright = await import(pathToFileURL(playwrightModulePath).href);
const chromium = playwright.chromium ?? playwright.default?.chromium;

const baseUrl = process.env.RC_BASE_URL ?? 'http://localhost:3000';
const apiUrl = process.env.RC_API_URL ?? 'http://localhost:3001';
const adminEmail = process.env.RC_ADMIN_EMAIL ?? 'admin@example.com';
const adminPassword = process.env.RC_ADMIN_PASSWORD ?? 'FindYourFight1';

const failures = [];

function record(ok, label, detail = '') {
  const prefix = ok ? 'PASS' : 'FAIL';
  console.log(`${prefix} ${label}${detail ? ` - ${detail}` : ''}`);
  if (!ok) {
    failures.push(`${label}${detail ? ` - ${detail}` : ''}`);
  }
}

async function expectJson(label, path, check) {
  const response = await fetch(`${apiUrl}${path}`);
  if (!response.ok) {
    record(false, label, `HTTP ${response.status}`);
    return null;
  }

  const json = await response.json();
  const detail = check(json);
  record(detail === true, label, detail === true ? '' : detail);
  return json;
}

async function loginAdmin() {
  const response = await fetch(`${apiUrl}/admin/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
    }),
    redirect: 'manual',
  });

  if (!response.ok) {
    record(false, 'Admin API login', `HTTP ${response.status}`);
    return null;
  }

  const setCookie = response.headers.get('set-cookie');
  if (!setCookie) {
    record(false, 'Admin API login', 'missing session cookie');
    return null;
  }

  record(true, 'Admin API login');
  return setCookie.split(';', 1)[0];
}

async function expectAdminJson(label, path, cookie, check) {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: { cookie },
  });

  if (!response.ok) {
    record(false, label, `HTTP ${response.status}`);
    return null;
  }

  const json = await response.json();
  const detail = check(json);
  record(detail === true, label, detail === true ? '' : detail);
  return json;
}

async function expectPage(page, label, path, text) {
  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' });
  if (!response || !response.ok()) {
    record(false, label, `HTTP ${response?.status() ?? 'no response'}`);
    return;
  }

  const html = await page.content();
  if (!html.includes(text)) {
    record(false, label, `missing text: ${text}`);
    return;
  }

  record(true, label);
}

async function expectAuthedPage(page, label, path, text) {
  await expectPage(page, label, path, text);
  if (page.url().includes('/admin/login')) {
    record(false, label, 'redirected to admin login');
  }
}

async function waitForAdminCookie(page, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const cookies = await page.context().cookies();
    if (cookies.some((cookie) => cookie.name === 'signal-fire-admin-session')) {
      return true;
    }
    await page.waitForTimeout(250);
  }

  return false;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  try {
    await expectJson('API health', '/health/live', (json) =>
      json.status === 'ok' ? true : 'status was not ok',
    );

    const topics = await expectJson('Topics API', '/topics', (json) =>
      Array.isArray(json.items) && json.items.length > 0 ? true : 'no topics returned',
    );
    const articles = await expectJson('Articles API', '/articles', (json) =>
      Array.isArray(json.items) && json.items.length > 0 ? true : 'no articles returned',
    );
    const actions = await expectJson('Actions API', '/actions', (json) =>
      Array.isArray(json.items) && json.items.length > 0 ? true : 'no actions returned',
    );
    const events = await expectJson('Events API', '/events?pageSize=1', (json) =>
      Array.isArray(json.items) && json.items.length > 0 ? true : 'no events returned',
    );

    const topicSlug = topics?.items?.some((item) => item.slug === 'climate')
      ? 'climate'
      : topics?.items?.[0]?.slug;
    const articleSlug = articles?.items?.some(
      (item) => item.slug === 'building-a-local-campaign-from-first-meeting-to-public-pressure',
    )
      ? 'building-a-local-campaign-from-first-meeting-to-public-pressure'
      : articles?.items?.[0]?.slug;
    const actionSlug = actions?.items?.some(
      (item) => item.slug === 'join-neighborhood-climate-coalition',
    )
      ? 'join-neighborhood-climate-coalition'
      : actions?.items?.[0]?.slug;
    const eventId = events?.items?.[0]?.id;

    await expectPage(page, 'Public home', '/', 'Choose an issue.');
    await expectPage(page, 'Public about', '/about', 'Why This Site Exists');
    await expectPage(page, 'Public topics index', '/topics', 'Issues');
    await expectPage(page, 'Public topic detail', `/topics/${topicSlug}`, 'Step 2 — Read');
    await expectPage(page, 'Public articles index', '/articles', 'Articles');
    await expectPage(page, 'Public article detail', `/articles/${articleSlug}`, 'Author');
    await expectPage(page, 'Public actions index', '/actions', 'Take Action');
    await expectPage(page, 'Public action detail', `/actions/${actionSlug}`, 'Action Type');
    await expectPage(
      page,
      'Public events index',
      '/events',
      'Browse upcoming events by issue, location, and date',
    );
    await expectPage(page, 'Public event detail', `/events/${eventId}`, 'Location');
    await expectPage(page, 'Public submit entry', '/submit', 'Contribute to Find Your Fight');
    await expectPage(page, 'Public submit article', '/submit/article', 'Submit an Article');
    await expectPage(page, 'Public submit event', '/submit/event', 'Submit an Event');

    const adminCookie = await loginAdmin();
    if (!adminCookie) {
      throw new Error('Admin login failed');
    }

    const session = await expectAdminJson(
      'Admin session API',
      '/admin/auth/session',
      adminCookie,
      (json) => (json.authenticated ? true : 'session unauthenticated'),
    );
    const pendingSubmissions = await expectAdminJson(
      'Admin pending submissions API',
      '/admin/submissions?status=PENDING',
      adminCookie,
      (json) =>
        Array.isArray(json.items) && json.items.length > 0 ? true : 'no pending submissions',
    );
    const approvedSubmissions = await expectAdminJson(
      'Admin approved submissions API',
      '/admin/submissions?status=APPROVED',
      adminCookie,
      (json) =>
        Array.isArray(json.items) && json.items.length > 0 ? true : 'no approved submissions',
    );
    const adminArticles = await expectAdminJson(
      'Admin articles API',
      '/admin/articles',
      adminCookie,
      (json) => (Array.isArray(json.items) && json.items.length > 0 ? true : 'no admin articles'),
    );
    const adminActions = await expectAdminJson(
      'Admin actions API',
      '/admin/actions',
      adminCookie,
      (json) => (Array.isArray(json.items) && json.items.length > 0 ? true : 'no admin actions'),
    );
    const adminEvents = await expectAdminJson(
      'Admin events API',
      '/admin/events',
      adminCookie,
      (json) => (Array.isArray(json.items) && json.items.length > 0 ? true : 'no admin events'),
    );

    await page.goto(`${baseUrl}/admin/login`, { waitUntil: 'networkidle' });
    await page.getByLabel('Email').fill(adminEmail);
    await page.getByLabel('Password').fill(adminPassword);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL(/\/admin(\/.*)?$/, { timeout: 15_000 });
    const hasAdminCookie = await waitForAdminCookie(page);
    if (!hasAdminCookie) {
      record(false, 'Admin browser login', 'session cookie was not present after login');
    } else {
      record(true, 'Admin browser login');
    }

    const pendingSubmissionId = pendingSubmissions?.items?.[0]?.id;
    const approvedSubmissionId = approvedSubmissions?.items?.[0]?.id;
    const adminArticleSlug = adminArticles?.items?.find(
      (item) => item.status === 'PUBLISHED',
    )?.slug;
    const adminActionSlug = adminActions?.items?.find((item) => item.status === 'PUBLISHED')?.slug;
    const adminEventId = adminEvents?.items?.find((item) => item.status === 'PUBLISHED')?.id;

    await expectAuthedPage(
      page,
      'Admin dashboard',
      '/admin',
      'Review submissions and manage published content.',
    );
    await expectAuthedPage(
      page,
      'Admin submissions queue',
      '/admin/submissions',
      'Submission records',
    );
    await expectAuthedPage(
      page,
      'Admin pending submission review',
      `/admin/submissions/${pendingSubmissionId}`,
      'Approve and Publish',
    );
    await expectAuthedPage(
      page,
      'Admin approved submission review',
      `/admin/submissions/${approvedSubmissionId}`,
      'Review outcome',
    );
    await expectAuthedPage(
      page,
      'Admin articles index',
      '/admin/articles',
      'Create and maintain curated public articles.',
    );
    await expectAuthedPage(
      page,
      'Admin article editor',
      `/admin/articles/${adminArticleSlug}`,
      'Edit Article',
    );
    await expectAuthedPage(
      page,
      'Admin actions index',
      '/admin/actions',
      'Create and maintain curated public actions.',
    );
    await expectAuthedPage(
      page,
      'Admin action editor',
      `/admin/actions/${adminActionSlug}`,
      'Edit Action',
    );
    await expectAuthedPage(
      page,
      'Admin events index',
      '/admin/events',
      'Create and maintain curated public events.',
    );
    await expectAuthedPage(
      page,
      'Admin event editor',
      `/admin/events/${adminEventId}`,
      'Edit Event',
    );

    if (session?.adminUser?.email !== adminEmail) {
      record(
        false,
        'Admin session identity',
        `expected ${adminEmail}, got ${session?.adminUser?.email}`,
      );
    } else {
      record(true, 'Admin session identity');
    }
  } finally {
    await page.close();
    await browser.close();
  }

  if (failures.length > 0) {
    console.error(`\nRC smoke failed with ${failures.length} issue(s).`);
    process.exitCode = 1;
    return;
  }

  console.log('\nRC smoke passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
