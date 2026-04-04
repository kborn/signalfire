import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionRepository } from './submission.repository';
import { CreateSubmissionInput } from './submission.type';
import { SubmissionStatus } from '@prisma/client';

const submissionInputData: CreateSubmissionInput = {
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
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmissionRepository, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    repository = module.get(SubmissionRepository);
  });

  it('findPending', async () => {
    prismaMock.submission.findMany.mockResolvedValue([submission]);

    const ret = await repository.findPending();

    expect(ret).toEqual([submission]);
    expect(prismaMock.submission.findMany).toHaveBeenCalledWith({
      where: { status: SubmissionStatus.PENDING },
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
        addressRaw: undefined,
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
});
