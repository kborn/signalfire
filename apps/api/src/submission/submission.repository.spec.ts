import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionRepository } from './submission.repository';
import { CreateSubmissionRepositoryInput } from './submission.repository.types';
import { SubmissionStatus } from '@prisma/client';

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
      create: jest.fn(),
    },
    resourceLink: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmissionRepository, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    repository = module.get(SubmissionRepository);
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
