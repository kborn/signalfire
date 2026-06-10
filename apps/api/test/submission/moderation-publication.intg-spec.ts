import { NotFoundException } from '@nestjs/common';
import { EntityStatus, EventType, SubmissionType } from '@prisma/client';
import { ArticleService } from '../../src/article/article.service';
import { ArticleModule } from '../../src/article/article.module';
import { EventService } from '../../src/event/event.service';
import { EventModule } from '../../src/event/event.module';
import { ModerationSubmissionService } from '../../src/admin-api/moderation/moderation-submission.service';
import { SubmissionModule } from '../../src/submission/submission.module';
import { SubmissionRepository } from '../../src/submission/submission.repository';
import { TopicModule } from '../../src/topic/topic.module';
import { TopicService } from '../../src/topic/topic.service';
import { createSubmission } from '../factories/submission.factory';
import { setupIntegrationTest } from '../harness/integration.harness';
import { ModerationReviewResponse } from '@signal-fire/api-contracts';

function requireCreatedRecord(review: ModerationReviewResponse) {
  if ('errors' in review || !review.createdRecord) {
    throw new Error('Expected moderation approval to return created record metadata.');
  }

  return review.createdRecord;
}

describe('Moderation publication integration', () => {
  const harness = setupIntegrationTest({
    imports: [SubmissionModule, ArticleModule, EventModule, TopicModule],
    providers: [ModerationSubmissionService, SubmissionRepository],
  });

  it('publishes approved article submissions through public article and topic reads', async () => {
    const moderationService = harness.module.get(ModerationSubmissionService);
    const articleService = harness.module.get(ArticleService);
    const topicService = harness.module.get(TopicService);

    const submission = await createSubmission({
      submissionType: SubmissionType.ARTICLE,
      title: 'Raw visitor title',
      summary: 'Raw visitor summary',
      submittedContent: 'Raw visitor content',
      author: null,
      submitterName: 'Private Submitter',
      submitterEmail: 'private@example.org',
    });

    const review = await moderationService.reviewSubmission(submission.id, {
      decision: 'APPROVE_ARTICLE',
      reviewNotes: 'Ready after cleanup.',
      publishStatus: EntityStatus.PUBLISHED,
      normalized: {
        title: 'Normalized Article Title',
        summary: 'Normalized public summary.',
        content: 'Normalized public content.',
        topicSlugs: ['democracy'],
        author: 'anonymous',
      },
    });
    const createdRecord = requireCreatedRecord(review);

    expect(createdRecord).toEqual(
      expect.objectContaining({
        recordType: 'ARTICLE',
        publishStatus: EntityStatus.PUBLISHED,
      }),
    );

    const article = await articleService.getArticleDetail(createdRecord.slug!);
    expect(article).toEqual(
      expect.objectContaining({
        title: 'Normalized Article Title',
        summary: 'Normalized public summary.',
        content: 'Normalized public content.',
        author: 'anonymous',
      }),
    );
    expect(article.topics.map((topic) => topic.slug)).toEqual(['democracy']);
    expect(article).not.toHaveProperty('submitterName');
    expect(article).not.toHaveProperty('submitterEmail');
    expect(article).not.toHaveProperty('reviewNotes');

    const topic = await topicService.getTopicDetail('democracy');
    expect(topic.articles).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: article.id })]),
    );
  });

  it('keeps draft-approved article submissions out of public article reads', async () => {
    const moderationService = harness.module.get(ModerationSubmissionService);
    const articleService = harness.module.get(ArticleService);

    const submission = await createSubmission({
      submissionType: SubmissionType.ARTICLE,
      title: 'Draft visitor title',
      summary: 'Draft visitor summary',
      submittedContent: 'Draft visitor content',
      author: 'Credited Writer',
    });

    const review = await moderationService.reviewSubmission(submission.id, {
      decision: 'APPROVE_ARTICLE',
      reviewNotes: 'Keep as draft.',
      publishStatus: EntityStatus.DRAFT,
      normalized: {
        title: 'Draft Normalized Article',
        summary: 'Draft normalized summary.',
        content: 'Draft normalized content.',
        topicSlugs: ['democracy'],
        author: 'Credited Writer',
      },
    });
    const createdRecord = requireCreatedRecord(review);

    await expect(articleService.getArticleDetail(createdRecord.slug!)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('publishes approved event submissions through public event reads', async () => {
    const moderationService = harness.module.get(ModerationSubmissionService);
    const eventService = harness.module.get(EventService);

    const submission = await createSubmission({
      submissionType: SubmissionType.EVENT,
      title: 'Raw event title',
      summary: 'Raw event summary',
      submittedContent: 'Raw event description',
      eventType: EventType.RALLY,
      startTime: new Date('2026-07-04T14:00:00.000Z'),
      endTime: new Date('2026-07-04T16:00:00.000Z'),
      locationName: 'Raw Plaza',
      publicLocationDescription: 'Liberty Plaza',
      addressLine1: '1 Main St',
      addressLine2: 'Ste 1A',
      city: 'Raw City',
      region: 'PA',
      country: 'US',
      postalCode: '19107',
      website: 'https://example.org/raw-event',
      contactEmail: 'private-event@example.org',
      submitterName: 'Private Event Submitter',
      submitterEmail: 'event-submitter@example.org',
    });

    const review = await moderationService.reviewSubmission(submission.id, {
      decision: 'APPROVE_EVENT',
      reviewNotes: 'Ready after cleanup.',
      publishStatus: EntityStatus.PUBLISHED,
      normalized: {
        title: 'Normalized Event Title',
        summary: 'Normalized event summary.',
        description: 'Normalized event description.',
        eventType: 'RALLY',
        startTime: '2026-07-04T15:00:00.000Z',
        endTime: '2026-07-04T17:00:00.000Z',
        locationName: 'Normalized Plaza',
        publicLocationDescription: 'Liberty Plaza',
        addressLine1: '1 Main St',
        addressLine2: 'Ste 1A',
        city: 'Philadelphia',
        region: 'PA',
        country: 'US',
        postalCode: '19107',
        website: 'https://example.org/normalized-event',
        topicSlugs: ['democracy'],
      },
    });
    const createdRecord = requireCreatedRecord(review);

    expect(createdRecord).toEqual(
      expect.objectContaining({
        recordType: 'EVENT',
        publishStatus: EntityStatus.PUBLISHED,
      }),
    );

    const event = await eventService.getPublishedEventDetail(createdRecord.id);
    expect(event).toEqual(
      expect.objectContaining({
        title: 'Normalized Event Title',
        summary: 'Normalized event summary.',
        description: 'Normalized event description.',
        locationName: 'Normalized Plaza',
        website: 'https://example.org/normalized-event',
      }),
    );
    expect(event.topics.map((topic) => topic.slug)).toEqual(['democracy']);
    expect(event).not.toHaveProperty('submitterName');
    expect(event).not.toHaveProperty('submitterEmail');
    expect(event).not.toHaveProperty('reviewNotes');

    const events = await eventService.getPublishedEventList({
      startDate: new Date('2026-07-04T00:00:00.000Z'),
      endDate: new Date('2026-07-05T00:00:00.000Z'),
      topicSlug: 'democracy',
    });
    expect(events.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: event.id })]),
    );
  });

  it('keeps draft-approved event submissions out of public event reads', async () => {
    const moderationService = harness.module.get(ModerationSubmissionService);
    const eventService = harness.module.get(EventService);

    const submission = await createSubmission({
      submissionType: SubmissionType.EVENT,
      title: 'Draft event title',
      summary: 'Draft event summary',
      submittedContent: 'Draft event description',
      eventType: EventType.RALLY,
      startTime: new Date('2026-08-04T14:00:00.000Z'),
      locationName: 'Draft Plaza',
      publicLocationDescription: 'Liberty Plaza',
      addressLine1: '1 Main St',
      addressLine2: 'Ste 1A',
      city: 'Philadelphia',
      region: 'PA',
      country: 'USA',
      postalCode: '45641',
    });

    const review = await moderationService.reviewSubmission(submission.id, {
      decision: 'APPROVE_EVENT',
      reviewNotes: 'Keep as draft.',
      publishStatus: EntityStatus.DRAFT,
      normalized: {
        title: 'Draft Normalized Event',
        summary: 'Draft normalized summary.',
        description: 'Draft normalized description.',
        eventType: 'RALLY',
        startTime: '2026-08-04T14:00:00.000Z',
        endTime: null,
        locationName: 'Draft Plaza',
        publicLocationDescription: 'Liberty Plaza',
        addressLine1: '1 Main St',
        addressLine2: 'Ste 1A',
        city: 'Philadelphia',
        region: 'PA',
        country: 'USA',
        postalCode: '45641',
        website: null,
        topicSlugs: ['democracy'],
      },
    });
    const createdRecord = requireCreatedRecord(review);

    await expect(eventService.getPublishedEventDetail(createdRecord.id)).rejects.toThrow(
      NotFoundException,
    );
  });
});
