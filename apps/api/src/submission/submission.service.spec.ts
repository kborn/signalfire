import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';
import { ArticleSubmissionRequest, SubmissionResponse } from '@signal-fire/api-contracts';
import { TopicRepository } from '../topic/topic.repository';

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
    topicRepoMock.findIdsBySlugs.mockResolvedValue(['democracy', 'consumer-activism']);

    const ret: SubmissionResponse = await service.create(submissionInputData);
    expect(ret).toEqual({ id: 1 });
  });
});
