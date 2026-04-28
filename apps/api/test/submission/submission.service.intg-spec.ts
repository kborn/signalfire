import { setupIntegrationTest } from '../harness/integration.harness';
import { SubmissionModule } from '../../src/submission/submission.module';
import { SubmissionStatus } from '@prisma/client';
import { TopicModule } from '../../src/topic/topic.module';
import { createSubmission } from '../factories/submission.factory';
import { createEvent } from '../factories/event.factory';
import { createArticle } from '../factories/article.factory';
import { linkArticleToSubmission, linkEventToSubmission } from '../factories/relation.factory';
import { SubmissionService } from '../../src/submission/submission.service';

describe('', () => {
  const harness = setupIntegrationTest([SubmissionModule, TopicModule]);

  it('asserts ability to link an article to a submission', async () => {
    const submission = await createSubmission();
    const article = await createArticle();
    await linkArticleToSubmission(submission.id, article.id);
    const fetchedSubmission = await jestPrisma.client.submission.findUnique({
      where: { id: submission.id },
    });
    expect(fetchedSubmission).toEqual(expect.objectContaining({ articleId: article.id }));
  });

  it('asserts ability to link an event to a submission', async () => {
    const submission = await createSubmission();
    const event = await createEvent();
    await linkEventToSubmission(submission.id, event.id);
    const fetchedSubmission = await jestPrisma.client.submission.findUnique({
      where: { id: submission.id },
    });
    expect(fetchedSubmission).toEqual(expect.objectContaining({ eventId: event.id }));
  });

  it('asserts a submission can not link to an event and and article', async () => {
    const submission = await createSubmission();
    const event = await createEvent();
    await linkEventToSubmission(submission.id, event.id);
    const article = await createArticle();
    await expect(linkArticleToSubmission(submission.id, article.id)).rejects.toThrow(
      /submission_one_of_target_chk/,
    );
  });

  it('asserts a submission can not be approved without a linked article or event', async () => {
    const submission = await createSubmission();
    await expect(
      jestPrisma.client.submission.update({
        where: { id: submission.id },
        data: {
          status: SubmissionStatus.APPROVED,
          reviewedAt: new Date(),
        },
      }),
    ).rejects.toThrow(/submission_one_of_target_chk/);
  });

  it('asserts a multiple submissions can not link to a single article', async () => {
    const article = await createArticle();
    const submission1 = await createSubmission();
    await jestPrisma.client.submission.update({
      where: { id: submission1.id },
      data: {
        articleId: article.id,
      },
    });

    const submission2 = await createSubmission();
    await expect(
      jestPrisma.client.submission.update({
        where: { id: submission2.id },
        data: {
          articleId: article.id,
        },
      }),
    ).toThrowUniqueViolation();
  });

  it('asserts a multiple submissions can not link to a single event', async () => {
    const event = await createEvent();
    const submission1 = await createSubmission();
    await jestPrisma.client.submission.update({
      where: { id: submission1.id },
      data: {
        eventId: event.id,
      },
    });

    const submission2 = await createSubmission();
    await expect(
      jestPrisma.client.submission.update({
        where: { id: submission2.id },
        data: {
          eventId: event.id,
        },
      }),
    ).toThrowUniqueViolation();
  });

  it('create article submission', async () => {
    const submissionService = harness.module.get(SubmissionService);
    const result = await submissionService.create({
      submissionType: 'ARTICLE',
      author: 'John Doe',
      submitterEmail: 'fake@mail.com',
      submitterName: 'Jane Doe',
      payload: {
        title: 'Community Submission',
        summary: 'A short submission summary.',
        content: 'Submitted content body.',
        topicSlugs: ['democracy', 'consumer-activism'],
        resourceLinks: ['fake.com', 'fake.org'],
      },
    });
    expect('errors' in result).toBe(false);
    if ('errors' in result) {
      throw new Error(`Submission creation failed: ${JSON.stringify(result.errors)}`);
    }

    const persistedSubmission = await jestPrisma.client.submission.findUnique({
      where: { id: result.id },
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
    });

    expect(persistedSubmission).toEqual(
      expect.objectContaining({
        id: result.id,
        submissionType: 'ARTICLE',
        status: 'PENDING',
        title: 'Community Submission',
        summary: 'A short submission summary.',
        submittedContent: 'Submitted content body.',
        author: 'John Doe',
        submitterName: 'Jane Doe',
        submitterEmail: 'fake@mail.com',
      }),
    );
    const topicSlugs =
      persistedSubmission?.submissionTopics.map((record) => record.topic.slug) ?? [];
    const resourceUrls =
      persistedSubmission?.submissionResourceLinks.map((record) => record.resourceLink.url) ?? [];

    expect(topicSlugs).toEqual(expect.arrayContaining(['democracy', 'consumer-activism']));
    expect(resourceUrls).toEqual(expect.arrayContaining(['fake.com', 'fake.org']));
  });

  it('create event submission', async () => {
    const submissionService = harness.module.get(SubmissionService);
    const result = await submissionService.create({
      submissionType: 'EVENT',
      submitterEmail: 'organizer@example.org',
      submitterName: 'Alex Rivera',
      payload: {
        title: 'Tenant Rights Rally',
        summary: 'Public rally supporting stronger tenant protections.',
        description: 'Join local organizers for a rally and speaker program.',
        eventType: 'RALLY',
        startDatetime: '2026-05-14T17:00:00.000Z',
        endDatetime: '2026-05-14T19:00:00.000Z',
        locationName: 'City Hall North Plaza',
        locationAddressStreet: '1400 John F Kennedy Blvd',
        locationAddressCity: 'Philadelphia',
        locationAddressRegion: 'PA',
        locationAddressCountry: 'US',
        locationAddressZip: '19107',
        contactEmail: 'press@example.org',
        topicSlugs: ['economic-justice'],
        websiteUrl: 'https://example.org/event',
      },
    });
    expect('errors' in result).toBe(false);
    if ('errors' in result) {
      throw new Error(`Submission creation failed: ${JSON.stringify(result.errors)}`);
    }

    const persistedSubmission = await jestPrisma.client.submission.findUnique({
      where: { id: result.id },
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
    });

    expect(persistedSubmission).toEqual(
      expect.objectContaining({
        id: result.id,
        submissionType: 'EVENT',
        status: 'PENDING',
        title: 'Tenant Rights Rally',
        summary: 'Public rally supporting stronger tenant protections.',
        submittedContent: 'Join local organizers for a rally and speaker program.',
        submitterName: 'Alex Rivera',
        submitterEmail: 'organizer@example.org',
        eventType: 'RALLY',
        startTime: new Date('2026-05-14T17:00:00.000Z'),
        endTime: new Date('2026-05-14T19:00:00.000Z'),
        locationName: 'City Hall North Plaza',
        addressRaw: '1400 John F Kennedy Blvd, Philadelphia, PA 19107, US',
        city: 'Philadelphia',
        region: 'PA',
        postalCode: '19107',
        country: 'US',
        website: 'https://example.org/event',
        contactEmail: 'press@example.org',
      }),
    );
    const topicSlugs =
      persistedSubmission?.submissionTopics.map((record) => record.topic.slug) ?? [];
    expect(topicSlugs).toEqual(expect.arrayContaining(['economic-justice']));
    expect(persistedSubmission?.submissionResourceLinks).toEqual([]);
  });
});
