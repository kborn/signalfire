import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionRepository } from './submission.repository';
import {
  ArticleSubmissionApprovedRepositoryInput,
  CreateSubmissionRepositoryInput,
  EventSubmissionApprovedRepositoryInput,
} from './submission.repository.types';
import { EntityStatus, EventType, SubmissionStatus } from '@prisma/client';

const submissionInputData: CreateSubmissionRepositoryInput = {
  submissionType: 'ARTICLE',
  title: 'Community Submission',
  summary: 'A short submission summary.',
  submittedContent: 'Submitted content body.',
  submitterName: 'Jane Doe',
  topicIds: [1, 2],
};

const submission = {
  id: 1,
  status: 'PENDING',
  submittedAt: new Date(),
  ...submissionInputData,
};

describe('SubmissionRepository', () => {
  let repository: SubmissionRepository;
  const prismaMock = {
    submission: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
    },
    resourceLink: {
      findMany: jest.fn(),
    },
    article: {
      create: jest.fn(),
    },
    event: {
      create: jest.fn(),
    },
  };

  const prismaServiceMock = {
    ...prismaMock,
    $transaction: jest.fn(<T>(callback: (tx: typeof prismaMock) => Promise<T>) =>
      callback(prismaMock),
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmissionRepository, { provide: PrismaService, useValue: prismaServiceMock }],
    }).compile();
    repository = module.get(SubmissionRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('findModerationSubmissions without filter', async () => {
    prismaMock.submission.findMany.mockResolvedValue([submission]);

    const ret = await repository.findModerationSubmissions({});

    expect(ret).toEqual([submission]);
    expect(prismaMock.submission.findMany).toHaveBeenCalledWith({
      where: { status: undefined, submissionType: undefined },
      orderBy: { submittedAt: 'desc' },
    });
  });

  it('findModerationSubmissions filters by status only', async () => {
    prismaMock.submission.findMany.mockResolvedValue([submission]);

    const ret = await repository.findModerationSubmissions({ status: SubmissionStatus.PENDING });

    expect(ret).toEqual([submission]);
    expect(prismaMock.submission.findMany).toHaveBeenCalledWith({
      where: { status: SubmissionStatus.PENDING, submissionType: undefined },
      orderBy: { submittedAt: 'desc' },
    });
  });

  it('findModerationSubmissions filters by submissionType only', async () => {
    prismaMock.submission.findMany.mockResolvedValue([submission]);

    const ret = await repository.findModerationSubmissions({ submissionType: 'ARTICLE' });

    expect(ret).toEqual([submission]);
    expect(prismaMock.submission.findMany).toHaveBeenCalledWith({
      where: { status: undefined, submissionType: 'ARTICLE' },
      orderBy: { submittedAt: 'desc' },
    });
  });

  it('findModerationSubmissions filters by status and submission type', async () => {
    prismaMock.submission.findMany.mockResolvedValue([submission]);

    const ret = await repository.findModerationSubmissions({
      status: SubmissionStatus.PENDING,
      submissionType: 'ARTICLE',
    });

    expect(ret).toEqual([submission]);
    expect(prismaMock.submission.findMany).toHaveBeenCalledWith({
      where: { status: SubmissionStatus.PENDING, submissionType: 'ARTICLE' },
      orderBy: { submittedAt: 'desc' },
    });
  });

  it('findById retrieves a submission without status filtering', async () => {
    prismaMock.submission.findUnique.mockResolvedValue(submission);

    const ret = await repository.findById(1);

    expect(ret).toEqual(submission);
    expect(prismaMock.submission.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('findResourceLinksBySubmissionId retrieves resourceLinks by submissionId', async () => {
    const now = new Date();
    const retLinks = [
      { id: 1, created: now, url: 'www.testsite.com' },
      { id: 2, created: now, url: 'www.othertestsite.com' },
    ];
    prismaMock.resourceLink.findMany.mockResolvedValue(retLinks);

    const ret = await repository.findResourceLinksBySubmissionId(1);

    expect(ret).toEqual(retLinks);
    expect(prismaMock.resourceLink.findMany).toHaveBeenCalledWith({
      where: {
        submissionResourceLinks: {
          some: {
            submissionId: 1,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  });

  it('create', async () => {
    prismaMock.submission.create.mockResolvedValue(submission);

    const ret = await repository.create(submissionInputData);
    expect(ret).toEqual(submission);
    expect(prismaMock.submission.create).toHaveBeenCalledWith({
      data: {
        submissionType: 'ARTICLE',
        title: 'Community Submission',
        summary: 'A short submission summary.',
        submittedContent: 'Submitted content body.',
        submitterName: 'Jane Doe',
        status: SubmissionStatus.PENDING,
        author: undefined,
        submitterEmail: undefined,
        eventType: undefined,
        startTime: undefined,
        endTime: undefined,
        locationName: undefined,
        publicLocationDescription: undefined,
        addressLine1: undefined,
        addressLine2: undefined,
        city: undefined,
        region: undefined,
        postalCode: undefined,
        country: undefined,
        website: undefined,
        contactEmail: undefined,
        submissionResourceLinks: undefined,
        submissionTopics: {
          create: [
            {
              topic: {
                connect: {
                  id: 1,
                },
              },
            },
            {
              topic: {
                connect: {
                  id: 2,
                },
              },
            },
          ],
        },
      },
    });
  });

  it('returns null when no valid submissions are found to reject', async () => {
    const reviewedAt = new Date('2026-01-01T00:00:00.000Z');

    prismaMock.submission.updateMany.mockResolvedValue({ count: 0 });

    const ret = await repository.markSubmissionRejected({
      submissionId: 1,
      reviewNotes: 'Not a fit',
      reviewedAt,
    });
    expect(ret).toBeNull();
    expect(prismaMock.submission.updateMany).toHaveBeenCalledWith({
      where: {
        id: 1,
        status: SubmissionStatus.PENDING,
        articleId: null,
        eventId: null,
      },
      data: {
        status: SubmissionStatus.REJECTED,
        reviewNotes: 'Not a fit',
        reviewedAt,
      },
    });
  });

  it('returns submission after updating as rejected', async () => {
    const reviewedAt = new Date('2026-01-01T00:00:00.000Z');

    prismaMock.submission.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.submission.findUnique.mockResolvedValue(submission);

    const ret = await repository.markSubmissionRejected({
      submissionId: 1,
      reviewNotes: 'Not a fit',
      reviewedAt,
    });
    expect(ret).toEqual(submission);
  });

  it('approve article submission', async () => {
    const reviewedAt = new Date('2026-01-01T00:00:00.000Z');
    const assignedAt = new Date('2026-01-01T00:00:01.000Z');
    const article = {
      id: 10,
      slug: 'community-submission',
      title: 'Community Submission',
      summary: 'A short article summary.',
      content: 'Published article content.',
      status: EntityStatus.PUBLISHED,
      author: 'Jane Doe',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      publishedAt: reviewedAt,
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };
    const reviewedSubmission = { ...submission, status: SubmissionStatus.APPROVED, articleId: 10 };
    const input: ArticleSubmissionApprovedRepositoryInput = {
      submissionId: 1,
      reviewNotes: 'Looks good',
      reviewedAt,
      articleData: {
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        status: article.status,
        author: article.author,
        publishedAt: article.publishedAt,
        topicIds: [1, 2],
      },
    };

    prismaMock.submission.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.article.create.mockResolvedValue(article);
    prismaMock.submission.findUniqueOrThrow.mockResolvedValue(reviewedSubmission);
    jest.useFakeTimers().setSystemTime(assignedAt);

    const ret = await repository.approveArticleSubmission(input);

    expect(prismaServiceMock.$transaction).toHaveBeenCalled();
    expect(prismaMock.submission.updateMany).toHaveBeenCalledWith({
      where: {
        id: 1,
        status: 'PENDING',
        articleId: null,
        eventId: null,
      },
      data: {
        status: 'APPROVED',
        reviewNotes: 'Looks good',
        reviewedAt,
        articleId: 10,
      },
    });
    expect(prismaMock.article.create).toHaveBeenCalledWith({
      data: {
        title: 'Community Submission',
        slug: 'community-submission',
        summary: 'A short article summary.',
        content: 'Published article content.',
        status: EntityStatus.PUBLISHED,
        author: 'Jane Doe',
        publishedAt: reviewedAt,
        topicArticles: {
          create: [
            {
              topic: { connect: { id: 1 } },
              assignedAt,
              assignedBy: 'moderation',
            },
            {
              topic: { connect: { id: 2 } },
              assignedAt,
              assignedBy: 'moderation',
            },
          ],
        },
      },
    });
    expect(prismaMock.submission.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prismaMock.submission.update).not.toHaveBeenCalled();
    expect(ret).toEqual({ submission: reviewedSubmission, article });
  });

  it('approve event submission', async () => {
    const reviewedAt = new Date('2026-01-01T00:00:00.000Z');
    const assignedAt = new Date('2026-01-01T00:00:01.000Z');
    const startTime = new Date('2026-02-01T15:00:00.000Z');
    const endTime = new Date('2026-02-01T17:00:00.000Z');
    const event = {
      id: 20,
      title: 'Community Event',
      summary: 'A short event summary.',
      description: 'Published event description.',
      website: 'https://example.com/event',
      eventType: EventType.RALLY,
      status: EntityStatus.PUBLISHED,
      startTime,
      endTime,
      locationName: 'City Hall',
      publicLocationDescription: null,
      addressLine1: null,
      addressLine2: null,
      city: 'Springfield',
      region: 'IL',
      postalCode: '62701',
      country: 'US',
      latitude: null,
      longitude: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      publishedAt: reviewedAt,
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };
    const reviewedSubmission = { ...submission, status: SubmissionStatus.APPROVED, eventId: 20 };
    const input: EventSubmissionApprovedRepositoryInput = {
      submissionId: 1,
      reviewNotes: 'Looks good',
      reviewedAt,
      eventData: {
        title: event.title,
        summary: event.summary,
        description: event.description,
        eventType: event.eventType,
        startTime: event.startTime,
        endTime: event.endTime,
        locationName: event.locationName,
        publicLocationDescription: event.publicLocationDescription,
        addressLine1: event.addressLine1,
        addressLine2: event.addressLine2,
        city: event.city,
        region: event.region,
        country: event.country,
        postalCode: event.postalCode,
        website: event.website,
        status: event.status,
        publishedAt: event.publishedAt,
        topicIds: [1, 2],
      },
    };

    prismaMock.submission.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.event.create.mockResolvedValue(event);
    prismaMock.submission.findUniqueOrThrow.mockResolvedValue(reviewedSubmission);
    jest.useFakeTimers().setSystemTime(assignedAt);

    const ret = await repository.approveEventSubmission(input);

    expect(prismaServiceMock.$transaction).toHaveBeenCalled();
    expect(prismaMock.submission.updateMany).toHaveBeenCalledWith({
      where: {
        id: 1,
        status: 'PENDING',
        articleId: null,
        eventId: null,
      },
      data: {
        status: 'APPROVED',
        reviewNotes: 'Looks good',
        reviewedAt,
        eventId: 20,
      },
    });
    expect(prismaMock.event.create).toHaveBeenCalledWith({
      data: {
        title: 'Community Event',
        summary: 'A short event summary.',
        description: 'Published event description.',
        eventType: EventType.RALLY,
        startTime,
        endTime,
        locationName: 'City Hall',
        publicLocationDescription: null,
        addressLine1: null,
        addressLine2: null,
        city: 'Springfield',
        region: 'IL',
        country: 'US',
        postalCode: '62701',
        website: 'https://example.com/event',
        status: EntityStatus.PUBLISHED,
        publishedAt: reviewedAt,
        topicEvents: {
          create: [
            {
              topic: { connect: { id: 1 } },
              assignedAt,
              assignedBy: 'moderation',
            },
            {
              topic: { connect: { id: 2 } },
              assignedAt,
              assignedBy: 'moderation',
            },
          ],
        },
      },
    });
    expect(prismaMock.submission.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(prismaMock.submission.update).not.toHaveBeenCalled();
    expect(ret).toEqual({ submission: reviewedSubmission, event });
  });

  it('returns null when no valid article submissions are found to approve', async () => {
    const reviewedAt = new Date('2026-01-01T00:00:00.000Z');
    const input: ArticleSubmissionApprovedRepositoryInput = {
      submissionId: 1,
      reviewNotes: 'Looks good',
      reviewedAt,
      articleData: {
        title: 'Community Submission',
        slug: 'community-submission',
        summary: 'A short article summary.',
        content: 'Published article content.',
        status: EntityStatus.PUBLISHED,
        author: 'Jane Doe',
        publishedAt: reviewedAt,
        topicIds: [1, 2],
      },
    };

    prismaMock.article.create.mockResolvedValue({ id: 10 });
    prismaMock.submission.updateMany.mockResolvedValue({ count: 0 });

    const ret = await repository.approveArticleSubmission(input);
    expect(ret).toBeNull();
    expect(prismaMock.article.create).toHaveBeenCalled();
    expect(prismaMock.submission.update).not.toHaveBeenCalled();
    expect(prismaMock.submission.findUniqueOrThrow).not.toHaveBeenCalled();
  });

  it('returns null when no valid event submissions are found to approve', async () => {
    const reviewedAt = new Date('2026-01-01T00:00:00.000Z');
    const startTime = new Date('2026-02-01T15:00:00.000Z');
    const endTime = new Date('2026-02-01T17:00:00.000Z');

    const input: EventSubmissionApprovedRepositoryInput = {
      submissionId: 1,
      reviewNotes: 'Looks good',
      reviewedAt,
      eventData: {
        title: 'Community Event',
        summary: 'A short event summary.',
        description: 'Published event description.',
        eventType: EventType.RALLY,
        startTime,
        endTime,
        locationName: 'City Hall',
        publicLocationDescription: 'Liberty Plaza',
        addressLine1: '1 Main St',
        addressLine2: 'Ste 1A',
        city: 'Springfield',
        region: 'IL',
        country: 'US',
        postalCode: '62701',
        website: 'https://example.com/event',
        status: EntityStatus.PUBLISHED,
        publishedAt: reviewedAt,
        topicIds: [1, 2],
      },
    };

    prismaMock.event.create.mockResolvedValue({ id: 20 });
    prismaMock.submission.updateMany.mockResolvedValue({ count: 0 });

    const ret = await repository.approveEventSubmission(input);
    expect(ret).toBeNull();
    expect(prismaMock.event.create).toHaveBeenCalled();
    expect(prismaMock.submission.update).not.toHaveBeenCalled();
    expect(prismaMock.submission.findUniqueOrThrow).not.toHaveBeenCalled();
  });
});
