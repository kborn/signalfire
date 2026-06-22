import { chromium, expect as pwExpect, type Browser, type Page } from '@playwright/test';
import {
  startApiServer,
  startWebServer,
  stopApiServer,
  stopWebServer,
} from '../harness/browser-e2e.harness';

describe('Submission flows (browser e2e)', () => {
  jest.setTimeout(60_000);

  let browser: Browser | null = null;
  let page: Page | null = null;
  let apiServer: Awaited<ReturnType<typeof startApiServer>> | null = null;
  let webServer: Awaited<ReturnType<typeof startWebServer>> | null = null;

  beforeAll(async () => {
    browser = await chromium.launch();
    apiServer = await startApiServer();
    webServer = await startWebServer(apiServer.origin);
  });

  afterAll(async () => {
    await page?.close();
    page = null;
    await stopWebServer(webServer);
    webServer = null;
    await stopApiServer(apiServer);
    apiServer = null;
    await browser?.close();
  });

  beforeEach(async () => {
    page = await browser!.newPage();
  });

  afterEach(async () => {
    await page?.close();
    page = null;
  });

  it('submits an article through the public UI and persists the expected pending submission', async () => {
    await page!.goto(`${webServer!.origin}/submit/article`);

    await page!.getByLabel('* Title').fill('Community Solar Guide');
    await page!.getByLabel('* Summary').fill('A guide to community solar participation.');
    await page!.getByLabel('* Content').fill('Full article content for moderator review.');
    await page!.getByLabel('Climate').check();
    await page!.getByLabel('Author (optional)').fill('Jordan Lee');
    await page!.getByLabel('Submitter Name (optional)').fill('Sam Writer');
    await page!.getByLabel('Submitter Email (optional)').fill('sam.writer@example.org');
    await page!.getByLabel('Resource link 1').fill('https://example.org/source');
    await page!.getByRole('button', { name: 'Submit Article' }).click();

    await pwExpect(page!.getByText("We've got it.")).toBeVisible();

    const persistedSubmission = await jestPrisma.originalClient.submission.findFirstOrThrow({
      where: { title: 'Community Solar Guide' },
      include: {
        submissionTopics: {
          include: {
            topic: true,
          },
        },
        submissionResourceLinks: {
          include: {
            resourceLink: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    expect(persistedSubmission).toEqual(
      expect.objectContaining({
        submissionType: 'ARTICLE',
        status: 'PENDING',
        title: 'Community Solar Guide',
        summary: 'A guide to community solar participation.',
        submittedContent: 'Full article content for moderator review.',
        author: 'Jordan Lee',
        submitterName: 'Sam Writer',
        submitterEmail: 'sam.writer@example.org',
      }),
    );
    expect(persistedSubmission.submissionTopics.map((record) => record.topic.slug)).toEqual([
      'climate',
    ]);
    expect(
      persistedSubmission.submissionResourceLinks.map((record) => record.resourceLink.url),
    ).toEqual(['https://example.org/source']);
  });

  it('submits an event through the public UI and persists the expected pending submission', async () => {
    await page!.goto(`${webServer!.origin}/submit/event`);

    await page!.getByLabel('* Title').fill('Tenant Rights Rally');
    await page!
      .getByLabel('* Summary')
      .fill('Public rally supporting stronger tenant protections.');
    await page!
      .getByLabel('* Description')
      .fill('Join local organizers for a rally and speaker program.');
    await page!.getByLabel('* Event Type').selectOption('RALLY');
    await page!.getByLabel('* Start date and time').fill('2026-05-14T17:00');
    await page!.getByLabel('End date and time (optional)').fill('2026-05-14T19:00');
    await page!.getByLabel('* Location Name').fill('City Hall North Plaza');
    await page!.getByLabel('* City').fill('Philadelphia');
    await page!.getByLabel('* State').selectOption('PA');
    await page!.getByLabel('Location Description (optional)').fill('Liberty Square');
    await page!.getByLabel('Address Line 1 (optional)').fill('1400 John F Kennedy Blvd');
    await page!.getByLabel('Address Line 2 (optional)').fill('Ste 1A');
    await page!.getByLabel('* ZIP Code').fill('19107');
    await page!.getByLabel('Economic Justice').check();
    await page!.getByLabel('Contact Email (optional)').fill('press@example.org');
    await page!.getByLabel('Name (optional)').fill('Alex Rivera');
    await page!.locator('#event-submitterEmail').fill('organizer@example.org');
    await page!.getByLabel('Website URL (optional)').fill('https://example.org/event');
    await page!.getByRole('button', { name: 'Submit Event' }).click();

    await pwExpect(page!.getByText('Thanks for submitting')).toBeVisible();

    const persistedSubmission = await jestPrisma.originalClient.submission.findFirstOrThrow({
      where: { title: 'Tenant Rights Rally' },
      include: {
        submissionTopics: {
          include: {
            topic: true,
          },
        },
        submissionResourceLinks: {
          include: {
            resourceLink: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    expect(persistedSubmission).toEqual(
      expect.objectContaining({
        submissionType: 'EVENT',
        status: 'PENDING',
        title: 'Tenant Rights Rally',
        summary: 'Public rally supporting stronger tenant protections.',
        submittedContent: 'Join local organizers for a rally and speaker program.',
        submitterName: 'Alex Rivera',
        submitterEmail: 'organizer@example.org',
        eventType: 'RALLY',
        locationName: 'City Hall North Plaza',
        publicLocationDescription: 'Liberty Square',
        addressLine1: '1400 John F Kennedy Blvd',
        addressLine2: 'Ste 1A',
        city: 'Philadelphia',
        region: 'PA',
        postalCode: '19107',
        country: 'US',
        website: 'https://example.org/event',
        contactEmail: 'press@example.org',
      }),
    );
    expect(persistedSubmission.startTime?.toISOString()).toBe(
      new Date('2026-05-14T17:00').toISOString(),
    );
    expect(persistedSubmission.endTime?.toISOString()).toBe(
      new Date('2026-05-14T19:00').toISOString(),
    );
    expect(persistedSubmission.submissionTopics.map((record) => record.topic.slug)).toEqual([
      'economic-justice',
    ]);
    expect(persistedSubmission.submissionResourceLinks).toEqual([]);
  });
});
