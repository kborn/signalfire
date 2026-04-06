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

const submissionInputData: ArticleSubmissionRequest = {
  submission_type: 'ARTICLE',
  author: 'John Doe',
  submitter_email: 'fake@mail.com',
  submitter_name: 'Jane Doe',
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
  submission_type: 'ARTICLE',
  author: 'John Doe',
  submitter_email: 'fake@mail.com',
  submitter_name: 'Jane Doe',
  title: 'Community Submission',
  summary: 'A short submission summary.',
  content: 'Submitted content body.',
  topicSlugs: [1, 2],
};

const eventSubmissionInputData: EventSubmissionRequest = {
  submission_type: 'EVENT',
  submitter_email: 'organizer@example.org',
  submitter_name: 'Alex Rivera',
  payload: {
    title: 'Tenant Rights Rally',
    summary: 'Public rally supporting stronger tenant protections.',
    description: 'Join local organizers for a rally and speaker program.',
    event_type: 'RALLY',
    start_datetime: '2026-05-14T17:00:00.000Z',
    end_datetime: '2026-05-14T19:00:00.000Z',
    location_name: 'City Hall North Plaza',
    location_address_street: '1400 John F Kennedy Blvd',
    location_address_city: 'Philadelphia',
    location_address_region: 'Philadelphia County',
    location_address_state: 'PA',
    location_address_zip: '19107',
    topicSlugs: ['economic-justice'],
    source_link: 'https://example.org/event',
  },
};

describe('SubmissionService', () => {
  let service: SubmissionService;
  const repoMock = { findPending: jest.fn(), create: jest.fn() };
  const topicRepoMock = { findIdsBySlugs: jest.fn(), create: jest.fn() };
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

  it('getPendingSubmissions', async () => {
    repoMock.findPending.mockResolvedValue([submission]);

    const ret = await service.getPendingSubmissions();
    expect(ret).toEqual([submission]);
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
      resourceLinks: ['https://example.org/event'],
      submittedContent: 'Join local organizers for a rally and speaker program.',
      eventType: 'RALLY',
      startTime: new Date('2026-05-14T17:00:00.000Z'),
      endTime: new Date('2026-05-14T19:00:00.000Z'),
      locationName: 'City Hall North Plaza',
      addressRaw: '1400 John F Kennedy Blvd, Philadelphia, Philadelphia County, PA 19107',
      city: 'Philadelphia',
      region: 'Philadelphia County',
      postalCode: '19107',
    });
  });
});
