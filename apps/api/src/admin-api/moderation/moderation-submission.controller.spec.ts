import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ModerationSubmissionController } from './moderation-submission.controller';
import { ModerationSubmissionService } from './moderation-submission.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminAuthService } from '../auth/admin-auth.service';
import type {
  ModerationReviewApproveArticleRequest,
  ModerationReviewSuccess,
  ModerationSubmissionDetail,
  ModerationSubmissionList,
} from '@signal-fire/api-contracts';
import {
  ReviewSubmissionTypeError,
  UnknownSubmissionTopicsError,
} from '../../submission/submission.error';

describe('ModerationSubmissionController', () => {
  let controller: ModerationSubmissionController;

  const serviceMock = {
    getModerationSubmissionList: jest.fn(),
    getModerationSubmissionDetails: jest.fn(),
    reviewSubmission: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ModerationSubmissionController],
      providers: [
        { provide: ModerationSubmissionService, useValue: serviceMock },
        { provide: AdminAuthGuard, useValue: { canActivate: jest.fn().mockReturnValue(true) } },
        {
          provide: AdminAuthService,
          useValue: { isAuthorized: jest.fn(), reAuthorize: jest.fn() },
        },
      ],
    }).compile();

    controller = app.get<ModerationSubmissionController>(ModerationSubmissionController);
  });

  it('findQueuedSubmissions passes raw query arguments through the method boundary', async () => {
    const response: ModerationSubmissionList = { items: [] };
    serviceMock.getModerationSubmissionList.mockResolvedValue(response);

    const ret = await controller.findQueuedSubmissions(undefined as never, undefined);

    expect(ret).toEqual(response);
    expect(serviceMock.getModerationSubmissionList).toHaveBeenCalledWith({
      status: undefined,
      submissionType: undefined,
    });
  });

  it('findQueuedSubmissions passes explicit status and type filters', async () => {
    const response: ModerationSubmissionList = { items: [] };
    serviceMock.getModerationSubmissionList.mockResolvedValue(response);

    const ret = await controller.findQueuedSubmissions('APPROVED', 'ARTICLE');

    expect(ret).toEqual(response);
    expect(serviceMock.getModerationSubmissionList).toHaveBeenCalledWith({
      status: 'APPROVED',
      submissionType: 'ARTICLE',
    });
  });

  it('findSubmission retrieves submission details', async () => {
    const response: ModerationSubmissionDetail = {
      id: 1,
      reviewNotes: null,
      submissionType: 'ARTICLE',
      status: 'PENDING',
      submittedAt: '2026-05-01T10:00:00.000Z',
      submitterName: 'Jane Doe',
      submitterEmail: 'jane@example.org',
      reviewedAt: null,
      submittedContent: {
        title: 'Community Submission',
        summary: 'A short submission summary.',
        content: 'Submitted content body.',
        topics: [],
        resourceLinks: [],
        author: 'John Doe',
      },
      createdRecord: null,
    };
    serviceMock.getModerationSubmissionDetails.mockResolvedValue(response);

    const ret = await controller.findSubmission(1);

    expect(ret).toEqual(response);
    expect(serviceMock.getModerationSubmissionDetails).toHaveBeenCalledWith(1);
  });

  it('reviewSubmission delegates approval request to the moderation service', async () => {
    const req: ModerationReviewApproveArticleRequest = {
      decision: 'APPROVE_ARTICLE',
      reviewNotes: 'Looks good',
      publishStatus: 'PUBLISHED',
      normalized: {
        title: 'Community Submission',
        summary: 'A short submission summary.',
        content: 'Published article content.',
        topicSlugs: ['democracy'],
        author: 'Jane Doe',
      },
    };

    const resp: ModerationReviewSuccess = {
      submissionId: 1,
      status: 'APPROVED',
      reviewedAt: '2026-05-01T10:00:00.000Z',
      createdRecord: {
        recordType: 'ARTICLE',
        id: 10,
        title: 'Community Submission',
        slug: 'community-submission',
        publishStatus: 'PUBLISHED',
      },
    };
    serviceMock.reviewSubmission.mockResolvedValue(resp);

    const ret = await controller.reviewSubmission(1, req);
    expect(ret).toEqual(resp);
    expect(serviceMock.reviewSubmission).toHaveBeenCalledWith(1, req);
  });

  it('reviewSubmission maps ReviewSubmissionTypeError to ConflictException', async () => {
    const req = {
      decision: 'APPROVE_ARTICLE' as const,
      publishStatus: 'PUBLISHED' as const,
      reviewNotes: null,
      normalized: {
        title: 'x',
        summary: 'x',
        content: 'x',
        topicSlugs: ['democracy'],
        author: 'x',
      },
    };
    serviceMock.reviewSubmission.mockRejectedValue(
      new ReviewSubmissionTypeError('ARTICLE', 'EVENT'),
    );

    await expect(controller.reviewSubmission(1, req)).rejects.toThrow(ConflictException);
  });

  it('reviewSubmission maps UnknownSubmissionTopicsError to BadRequestException', async () => {
    const req = {
      decision: 'APPROVE_ARTICLE' as const,
      publishStatus: 'PUBLISHED' as const,
      reviewNotes: null,
      normalized: {
        title: 'x',
        summary: 'x',
        content: 'x',
        topicSlugs: ['democracy'],
        author: 'x',
      },
    };
    serviceMock.reviewSubmission.mockRejectedValue(
      new UnknownSubmissionTopicsError(['unknown-topic']),
    );

    await expect(controller.reviewSubmission(1, req)).rejects.toThrow(BadRequestException);
  });
});
