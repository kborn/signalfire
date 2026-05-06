import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';
import {
  ArticleSubmissionRequest,
  EventSubmissionRequest,
  SubmissionResponse,
} from '@signal-fire/api-contracts';
import { TopicRepository } from '../topic/topic.repository';
import { UnknownSubmissionTopicsError } from './submission.error';
import { NotFoundException } from '@nestjs/common';

const submissionInputData: ArticleSubmissionRequest = {
  submissionType: 'ARTICLE',
  author: 'John Doe',
  submitterEmail: 'fake@mail.com',
  submitterName: 'Jane Doe',
  payload: {
    title: 'Community Submission',
    summary: 'A short submission summary.',
    content: 'Submitted content body.',
    topicSlugs: ['democracy', 'consumer-activism'],
  },
};

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

const eventSubmissionInputData: EventSubmissionRequest = {
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
    topicSlugs: ['economic-justice'],
    websiteUrl: 'https://example.org/event',
  },
};

describe('SubmissionService', () => {
  let service: SubmissionService;
  const repoMock = {
    findModerationSubmissions: jest.fn(),
    findById: jest.fn(),
    findResourceLinksBySubmissionId: jest.fn(),
    create: jest.fn(),
  };
  const topicRepoMock = {
    findIdsBySlugs: jest.fn(),
    findBySubmissionId: jest.fn(),
    create: jest.fn(),
  };
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionService,
        { provide: SubmissionRepository, useValue: repoMock },
        { provide: TopicRepository, useValue: topicRepoMock },
      ],
    }).compile();
    service = module.get(SubmissionService);
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
      addressRaw: null,
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
      addressRaw: '1400 John F Kennedy Blvd, Philadelphia, PA 19107, US',
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
        addressRaw: '1400 John F Kennedy Blvd, Philadelphia, PA 19107, US',
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

  it('create', async () => {
    repoMock.create.mockResolvedValue(submission);
    topicRepoMock.findIdsBySlugs.mockResolvedValue([
      { id: 1, slug: 'democracy' },
      { id: 2, slug: 'consumer-activism' },
    ]);

    const ret: SubmissionResponse = await service.create(submissionInputData);
    expect(ret).toEqual({ id: 1 });
  });

  it('returns validation errors for unknown topic slugs', async () => {
    topicRepoMock.findIdsBySlugs.mockResolvedValue([{ id: 1, slug: 'democracy' }]);

    await expect(service.create(submissionInputData)).rejects.toEqual(
      new UnknownSubmissionTopicsError(['consumer-activism']),
    );
    expect(repoMock.create).not.toHaveBeenCalled();
  });

  it('creates event submissions with a derived addressRaw value', async () => {
    repoMock.create.mockResolvedValue({ id: 2 });
    topicRepoMock.findIdsBySlugs.mockResolvedValue([{ id: 3, slug: 'economic-justice' }]);

    const ret: SubmissionResponse = await service.create(eventSubmissionInputData);

    expect(ret).toEqual({ id: 2 });
    expect(repoMock.create).toHaveBeenCalledWith({
      title: 'Tenant Rights Rally',
      summary: 'Public rally supporting stronger tenant protections.',
      topicIds: [3],
      author: undefined,
      submitterName: 'Alex Rivera',
      submitterEmail: 'organizer@example.org',
      submissionType: 'EVENT',
      submittedContent: 'Join local organizers for a rally and speaker program.',
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
    });
  });
});
