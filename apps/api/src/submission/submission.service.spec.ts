import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';
import { CreateSubmissionInput } from './submission.type';

const submissionInputData: CreateSubmissionInput = {
  submissionType: 'ARTICLE',
  title: 'Community Submission',
  summary: 'A short submission summary.',
  submittedContent: 'Submitted content body.',
  submitterFirstName: 'Jane',
};

const submission = {
  id: 1,
  status: 'PENDING',
  submittedAt: new Date(),
  ...submissionInputData,
};

describe('SubmissionService', () => {
  let service: SubmissionService;
  const repoMock = { findPending: jest.fn(), create: jest.fn() };
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmissionService, { provide: SubmissionRepository, useValue: repoMock }],
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

    const ret = await service.create(submissionInputData);
    expect(ret).toEqual(submission);
  });
});
