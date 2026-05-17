import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionRepository } from './submission.repository';
import { TopicRepository } from '../topic/topic.repository';
import { NotFoundException } from '@nestjs/common';
import { ModerationSubmissionService } from './moderation-submission.service';
import {
  buildModerationReviewApproveArticleRequest,
  buildModerationReviewApproveEventRequest,
  buildModerationReviewRejectRequest,
} from './submission.test-fixtures';
import { withFrozenTime } from '../../common/test/time';
import { EntityStatus, SubmissionType } from '@prisma/client';
import { ReviewSubmissionTypeError, UnknownSubmissionTopicsError } from './submission.error';

const submission = {
  id: 1,
  status: 'PENDING',
  submittedAt: new Date(),
  submissionType: 'ARTICLE',
  author: 'John Doe',
  submitterEmail: 'fake@mail.com',
  submitterName: 'Jane Doe',
  title: 'Community Submission',
  summary: 'A short submission summary.',
  content: 'Submitted content body.',
  topicSlugs: [1, 2],
};

describe('SubmissionService', () => {
  let service: ModerationSubmissionService;
  const repoMock = {
    findModerationSubmissions: jest.fn(),
    findById: jest.fn(),
    findResourceLinksBySubmissionId: jest.fn(),
    markSubmissionRejected: jest.fn(),
    approveArticleSubmission: jest.fn(),
    approveEventSubmission: jest.fn(),
  };
  const topicRepoMock = {
    findBySubmissionId: jest.fn(),
    findIdsBySlugs: jest.fn(),
  };
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModerationSubmissionService,
        { provide: SubmissionRepository, useValue: repoMock },
        { provide: TopicRepository, useValue: topicRepoMock },
      ],
    }).compile();
    service = module.get(ModerationSubmissionService);
  });

  it('getModerationSubmissionList maps queue row fields', async () => {
    repoMock.findModerationSubmissions.mockResolvedValue([submission]);

    const ret = await service.getModerationSubmissionList({
      status: 'PENDING',
      submissionType: 'ARTICLE',
    });

    expect(ret).toEqual({
      items: [
        {
          id: 1,
          submissionType: 'ARTICLE',
          status: 'PENDING',
          title: 'Community Submission',
          submittedAt: submission.submittedAt.toISOString(),
          submitterName: 'Jane Doe',
          summary: 'A short submission summary.',
          submitterEmail: 'fake@mail.com',
        },
      ],
    });
    expect(repoMock.findModerationSubmissions).toHaveBeenCalledWith({
      status: 'PENDING',
      submissionType: 'ARTICLE',
    });
  });

  it('getModerationSubmissionList doesnt alter empty filters', async () => {
    repoMock.findModerationSubmissions.mockResolvedValue([submission]);

    await service.getModerationSubmissionList({});

    expect(repoMock.findModerationSubmissions).toHaveBeenCalledWith({});
  });

  it('getModerationSubmissionDetails throws NotFoundException when no submission is found', async () => {
    repoMock.findById.mockResolvedValue(null);

    await expect(service.getModerationSubmissionDetails(1)).rejects.toThrow(NotFoundException);
  });

  it('getModerationSubmissionDetails maps article submission details', async () => {
    const submittedAt = new Date('2026-05-01T10:00:00.000Z');
    const reviewedAt = new Date('2026-05-02T12:30:00.000Z');
    const articleSubmission = {
      id: 3,
      submissionType: 'ARTICLE',
      status: 'APPROVED',
      title: 'How Local Organizing Works',
      summary: 'A practical explainer on local issue campaigns.',
      submittedContent: 'Full article text...',
      author: 'John Doe',
      submitterName: 'Jane Doe',
      submitterEmail: 'jane@example.org',
      eventType: null,
      startTime: null,
      endTime: null,
      locationName: null,
      publicLocationDescription: null,
      addressLine1: null,
      addressLine2: null,
      city: null,
      region: null,
      postalCode: null,
      country: null,
      website: null,
      contactEmail: null,
      reviewNotes: 'Looks good.',
      articleId: null,
      eventId: null,
      submittedAt,
      reviewedAt,
    };
    const topics = [
      {
        id: 1,
        slug: 'democracy',
        name: 'Democracy',
        description: 'Democracy topic',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
      {
        id: 2,
        slug: 'labor',
        name: 'Labor',
        description: 'Labor topic',
        createdAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    ];
    const resourceLinks = [
      { id: 1, url: 'https://example.org/source-one', created: new Date() },
      { id: 2, url: 'https://example.org/source-two', created: new Date() },
    ];

    repoMock.findById.mockResolvedValue(articleSubmission);
    topicRepoMock.findBySubmissionId.mockResolvedValue(topics);
    repoMock.findResourceLinksBySubmissionId.mockResolvedValue(resourceLinks);

    const ret = await service.getModerationSubmissionDetails(3);

    expect(ret).toEqual({
      id: 3,
      submissionType: 'ARTICLE',
      status: 'APPROVED',
      submittedAt: submittedAt.toISOString(),
      submitterName: 'Jane Doe',
      submitterEmail: 'jane@example.org',
      reviewedAt: reviewedAt.toISOString(),
      submittedContent: {
        title: 'How Local Organizing Works',
        summary: 'A practical explainer on local issue campaigns.',
        content: 'Full article text...',
        topics: [
          {
            id: 1,
            slug: 'democracy',
            name: 'Democracy',
            description: 'Democracy topic',
          },
          {
            id: 2,
            slug: 'labor',
            name: 'Labor',
            description: 'Labor topic',
          },
        ],
        resourceLinks: ['https://example.org/source-one', 'https://example.org/source-two'],
        author: 'John Doe',
      },
    });
    expect(repoMock.findById).toHaveBeenCalledWith(3);
    expect(topicRepoMock.findBySubmissionId).toHaveBeenCalledWith(3);
    expect(repoMock.findResourceLinksBySubmissionId).toHaveBeenCalledWith(3);
  });

  it('getModerationSubmissionDetails maps event submission details', async () => {
    repoMock.markSubmissionRejected.mockResolvedValue(null);
    const submittedAt = new Date('2026-05-01T10:00:00.000Z');
    const startTime = new Date('2026-05-14T17:00:00.000Z');
    const endTime = new Date('2026-05-14T19:00:00.000Z');
    const eventSubmission = {
      id: 4,
      submissionType: 'EVENT',
      status: 'PENDING',
      title: 'Tenant Rights Rally',
      summary: 'Public rally supporting stronger tenant protections.',
      submittedContent: 'Join local organizers for a rally and speaker program.',
      author: 'Alex Rivera',
      submitterName: 'Alex Rivera',
      submitterEmail: 'alex@example.org',
      eventType: 'RALLY',
      startTime,
      endTime,
      locationName: 'City Hall North Plaza',
      publicLocationDescription: 'Liberty Plaza',
      addressLine1: '1 Main St',
      addressLine2: 'Ste 1A',
      city: 'Philadelphia',
      region: 'PA',
      postalCode: '19107',
      country: 'US',
      website: 'https://example.org/event',
      contactEmail: 'press@example.org',
      reviewNotes: null,
      articleId: null,
      eventId: null,
      submittedAt,
      reviewedAt: null,
    };
    const topics = [
      {
        id: 5,
        slug: 'housing',
        name: 'Housing',
        description: 'Housing topic',
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
      },
    ];

    repoMock.findById.mockResolvedValue(eventSubmission);
    topicRepoMock.findBySubmissionId.mockResolvedValue(topics);

    const ret = await service.getModerationSubmissionDetails(4);

    expect(ret).toEqual({
      id: 4,
      submissionType: 'EVENT',
      status: 'PENDING',
      submittedAt: submittedAt.toISOString(),
      submitterName: 'Alex Rivera',
      submitterEmail: 'alex@example.org',
      reviewedAt: null,
      submittedContent: {
        title: 'Tenant Rights Rally',
        summary: 'Public rally supporting stronger tenant protections.',
        topics: [
          {
            id: 5,
            slug: 'housing',
            name: 'Housing',
            description: 'Housing topic',
          },
        ],
        description: 'Join local organizers for a rally and speaker program.',
        eventType: 'RALLY',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        locationName: 'City Hall North Plaza',
        publicLocationDescription: 'Liberty Plaza',
        addressLine1: '1 Main St',
        addressLine2: 'Ste 1A',
        city: 'Philadelphia',
        region: 'PA',
        country: 'US',
        postalCode: '19107',
        website: 'https://example.org/event',
        contactEmail: 'press@example.org',
      },
    });
    expect(repoMock.findById).toHaveBeenCalledWith(4);
    expect(topicRepoMock.findBySubmissionId).toHaveBeenCalledWith(4);
    expect(repoMock.findResourceLinksBySubmissionId).not.toHaveBeenCalled();
  });

  it('fails with NotFoundException when submission id does not exist', async () => {
    repoMock.findById.mockResolvedValue(null);

    await expect(service.reviewSubmission(1, buildModerationReviewRejectRequest())).rejects.toThrow(
      NotFoundException,
    );
  });

  it('rejects a PENDING submission successfully', async () => {
    await withFrozenTime('2025-03-15T12:34:56.001Z', async () => {
      repoMock.markSubmissionRejected.mockResolvedValue({ submissionId: 1 });
      const ret = await service.reviewSubmission(1, {
        decision: 'REJECT',
        reviewNotes: 'Poorly Written',
      });
      expect(repoMock.markSubmissionRejected).toHaveBeenCalledWith({
        submissionId: 1,
        decision: 'REJECT',
        reviewNotes: 'Poorly Written',
        reviewedAt: new Date('2025-03-15T12:34:56.001Z'),
      });
      expect(ret).toEqual({
        submissionId: 1,
        status: 'REJECTED',
        reviewedAt: '2025-03-15T12:34:56.001Z',
      });
    });
  });

  it('fails with ReviewSubmissionTypeError when APPROVE_ARTICLE decision is applied to an EVENT submission', async () => {
    repoMock.findById.mockResolvedValue({ submissionType: SubmissionType.EVENT });

    await expect(
      service.reviewSubmission(
        1,
        buildModerationReviewApproveArticleRequest({
          reviewNotes: undefined,
          normalized: {
            title: 'Article title',
            summary: 'Article summary',
            content: 'Article content',
            topicSlugs: ['democracy'],
            author: 'Article author',
          },
        }),
      ),
    ).rejects.toThrow(ReviewSubmissionTypeError);
  });

  it('fails with ReviewSubmissionTypeError when APPROVE_EVENT decision is applied to an ARTICLE submission', async () => {
    repoMock.findById.mockResolvedValue({ submissionType: SubmissionType.ARTICLE });

    await expect(
      service.reviewSubmission(
        1,
        buildModerationReviewApproveEventRequest({
          reviewNotes: undefined,
          normalized: {
            title: 'Event title',
            summary: 'Event summary',
            description: 'Event description',
            eventType: 'RALLY',
            startTime: '2026-05-14T17:00:00.000Z',
            endTime: undefined,
            locationName: 'City Hall',
            publicLocationDescription: undefined,
            addressLine1: undefined,
            addressLine2: undefined,
            city: undefined,
            region: undefined,
            country: undefined,
            postalCode: undefined,
            website: undefined,
            topicSlugs: ['democracy'],
          },
        }),
      ),
    ).rejects.toThrow(ReviewSubmissionTypeError);
  });

  it('approves pending article submission and returns created Article metadata ', async () => {
    const reviewedTime = '2025-03-15T12:34:56.001Z';
    await withFrozenTime(reviewedTime, async () => {
      const slug = 'normalized-article-slug';

      repoMock.findById.mockResolvedValue({
        submissionId: 1,
        submissionType: SubmissionType.ARTICLE,
        author: 'Article author',
      });

      repoMock.approveArticleSubmission.mockResolvedValue({
        article: { id: 1, status: EntityStatus.PUBLISHED, slug: slug },
      });

      topicRepoMock.findIdsBySlugs.mockResolvedValue([{ id: 1, slug: 'democracy' }]);
      const ret = await service.reviewSubmission(
        1,
        buildModerationReviewApproveArticleRequest({
          reviewNotes: undefined,
          normalized: {
            title: 'Article title',
            summary: 'Article summary',
            content: 'Article content',
            topicSlugs: ['democracy'],
            author: 'Article author',
          },
        }),
      );

      expect(ret).toEqual({
        submissionId: 1,
        status: 'APPROVED',
        reviewedAt: reviewedTime,
        createdRecord: {
          recordType: 'ARTICLE',
          id: 1,
          slug: slug,
          publishStatus: EntityStatus.PUBLISHED,
        },
      });

      expect(repoMock.approveArticleSubmission).toHaveBeenCalledWith({
        submissionId: 1,
        reviewNotes: undefined,
        reviewedAt: new Date(reviewedTime),
        articleData: {
          title: 'Article title',
          slug: 'article-title',
          summary: 'Article summary',
          content: 'Article content',
          status: EntityStatus.PUBLISHED,
          author: 'Article author',
          publishedAt: new Date(reviewedTime),
          topicIds: [1],
        },
      });
    });
  });

  it('approves pending event submission and returns created Event metadata ', async () => {
    const reviewedTime = '2025-03-15T12:34:56.001Z';
    await withFrozenTime(reviewedTime, async () => {
      repoMock.findById.mockResolvedValue({
        submissionId: 1,
        submissionType: SubmissionType.EVENT,
      });

      repoMock.approveEventSubmission.mockResolvedValue({
        event: { id: 1, status: EntityStatus.PUBLISHED },
      });

      topicRepoMock.findIdsBySlugs.mockResolvedValue([{ id: 1, slug: 'democracy' }]);
      const ret = await service.reviewSubmission(
        1,
        buildModerationReviewApproveEventRequest({
          reviewNotes: undefined,
          normalized: {
            title: 'Event title',
            summary: 'Event summary',
            description: 'Event description',
            eventType: 'RALLY',
            startTime: '2026-05-14T17:00:00.000Z',
            endTime: undefined,
            locationName: 'City Hall',
            publicLocationDescription: undefined,
            addressLine1: undefined,
            addressLine2: undefined,
            city: undefined,
            region: undefined,
            country: undefined,
            postalCode: undefined,
            website: undefined,
            contactEmail: null,
            topicSlugs: ['democracy'],
          },
        }),
      );

      expect(ret).toEqual({
        submissionId: 1,
        status: 'APPROVED',
        reviewedAt: reviewedTime,
        createdRecord: {
          recordType: 'EVENT',
          id: 1,
          publishStatus: EntityStatus.PUBLISHED,
        },
      });

      expect(repoMock.approveEventSubmission).toHaveBeenCalledWith({
        submissionId: 1,
        reviewedAt: new Date(reviewedTime),
        eventData: {
          title: 'Event title',
          summary: 'Event summary',
          description: 'Event description',
          eventType: 'RALLY',
          startTime: new Date('2026-05-14T17:00:00.000Z'),
          endTime: null,
          locationName: 'City Hall',
          postalCode: null,
          city: null,
          country: null,
          region: null,
          publicLocationDescription: null,
          addressLine1: null,
          addressLine2: null,
          status: EntityStatus.PUBLISHED,
          website: null,
          contactEmail: null,
          publishedAt: new Date(reviewedTime),
          topicIds: [1],
        },
      });
    });
  });

  it('leaves publishedAt null when article submission publishStatus is DRAFT', async () => {
    const reviewedTime = '2025-03-15T12:34:56.001Z';
    await withFrozenTime(reviewedTime, async () => {
      const slug = 'normalized-article-slug';

      repoMock.findById.mockResolvedValue({
        submissionId: 1,
        submissionType: SubmissionType.ARTICLE,
        author: 'Article author',
      });

      repoMock.approveArticleSubmission.mockResolvedValue({
        article: { id: 1, status: EntityStatus.DRAFT, slug: slug },
      });

      topicRepoMock.findIdsBySlugs.mockResolvedValue([{ id: 1, slug: 'democracy' }]);
      const ret = await service.reviewSubmission(
        1,
        buildModerationReviewApproveArticleRequest({
          reviewNotes: undefined,
          publishStatus: EntityStatus.DRAFT,
          normalized: {
            title: 'Article title',
            summary: 'Article summary',
            content: 'Article content',
            topicSlugs: ['democracy'],
            author: 'Article author',
          },
        }),
      );

      expect(ret).toEqual({
        submissionId: 1,
        status: 'APPROVED',
        reviewedAt: reviewedTime,
        createdRecord: {
          recordType: 'ARTICLE',
          id: 1,
          slug: slug,
          publishStatus: EntityStatus.DRAFT,
        },
      });

      expect(repoMock.approveArticleSubmission).toHaveBeenCalledWith({
        submissionId: 1,
        reviewNotes: undefined,
        reviewedAt: new Date(reviewedTime),
        articleData: {
          title: 'Article title',
          slug: 'article-title',
          summary: 'Article summary',
          content: 'Article content',
          publishedAt: null,
          status: EntityStatus.DRAFT,
          author: 'Article author',
          topicIds: [1],
        },
      });
    });
  });

  it('leaves publishedAt null when event submission publishStatus is DRAFT', async () => {
    const reviewedTime = '2025-03-15T12:34:56.001Z';
    await withFrozenTime(reviewedTime, async () => {
      repoMock.findById.mockResolvedValue({
        submissionId: 1,
        submissionType: SubmissionType.EVENT,
      });

      repoMock.approveEventSubmission.mockResolvedValue({
        event: { id: 1, status: EntityStatus.DRAFT },
      });

      topicRepoMock.findIdsBySlugs.mockResolvedValue([{ id: 1, slug: 'democracy' }]);
      const ret = await service.reviewSubmission(
        1,
        buildModerationReviewApproveEventRequest({
          reviewNotes: undefined,
          publishStatus: EntityStatus.DRAFT,
          normalized: {
            title: 'Event title',
            summary: 'Event summary',
            description: 'Event description',
            eventType: 'RALLY',
            startTime: '2026-05-14T17:00:00.000Z',
            endTime: undefined,
            locationName: 'City Hall',
            publicLocationDescription: undefined,
            addressLine1: undefined,
            addressLine2: undefined,
            city: undefined,
            region: undefined,
            country: undefined,
            postalCode: undefined,
            website: undefined,
            contactEmail: undefined,
            topicSlugs: ['democracy'],
          },
        }),
      );

      expect(ret).toEqual({
        submissionId: 1,
        status: 'APPROVED',
        reviewedAt: reviewedTime,
        createdRecord: {
          recordType: 'EVENT',
          id: 1,
          publishStatus: EntityStatus.DRAFT,
        },
      });

      expect(repoMock.approveEventSubmission).toHaveBeenCalledWith({
        submissionId: 1,
        reviewedAt: new Date(reviewedTime),
        eventData: {
          title: 'Event title',
          summary: 'Event summary',
          description: 'Event description',
          eventType: 'RALLY',
          startTime: new Date('2026-05-14T17:00:00.000Z'),
          endTime: null,
          locationName: 'City Hall',
          postalCode: null,
          city: null,
          country: null,
          region: null,
          publicLocationDescription: null,
          addressLine1: null,
          addressLine2: null,
          status: EntityStatus.DRAFT,
          website: null,
          contactEmail: null,
          publishedAt: null,
          topicIds: [1],
        },
      });
    });
  });

  it('rejects with UnknownSubmissionTopicsError when topic slugs can not be resolved', async () => {
    topicRepoMock.findIdsBySlugs.mockResolvedValue([{ id: 1, slug: 'democracy' }]);
    await expect(service.getTopicIds(['democracy', 'climate'])).rejects.toThrow(
      UnknownSubmissionTopicsError,
    );
  });
});
