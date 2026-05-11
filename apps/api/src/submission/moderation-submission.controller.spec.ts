import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ModerationSubmissionController } from './moderation-submission.controller';
import { ModerationSubmissionService } from './moderation-submission.service';
import type {
  ModerationSubmissionDetail,
  ModerationSubmissionList,
} from '@signal-fire/api-contracts';

describe('ModerationSubmissionController', () => {
  let controller: ModerationSubmissionController;

  const serviceMock = {
    getModerationSubmissionList: jest.fn(),
    getModerationSubmissionDetails: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ModerationSubmissionController],
      providers: [{ provide: ModerationSubmissionService, useValue: serviceMock }],
    }).compile();

    controller = app.get<ModerationSubmissionController>(ModerationSubmissionController);
  });

  it('findQueuedSubmissions defaults to pending submissions', async () => {
    const response: ModerationSubmissionList = { items: [] };
    serviceMock.getModerationSubmissionList.mockResolvedValue(response);

    const ret = await controller.findQueuedSubmissions(undefined, undefined);

    expect(ret).toEqual(response);
    expect(serviceMock.getModerationSubmissionList).toHaveBeenCalledWith({
      status: 'PENDING',
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

  it('findQueuedSubmissions rejects invalid statuses', async () => {
    await expect(controller.findQueuedSubmissions('IN_REVIEW', undefined)).rejects.toThrow(
      BadRequestException,
    );
    expect(serviceMock.getModerationSubmissionList).not.toHaveBeenCalled();
  });

  it('findQueuedSubmissions rejects invalid submission types', async () => {
    await expect(controller.findQueuedSubmissions('PENDING', 'ACTION')).rejects.toThrow(
      BadRequestException,
    );
    expect(serviceMock.getModerationSubmissionList).not.toHaveBeenCalled();
  });

  it('findSubmission retrieves submission details', async () => {
    const response: ModerationSubmissionDetail = {
      id: 1,
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
    };
    serviceMock.getModerationSubmissionDetails.mockResolvedValue(response);

    const ret = await controller.findSubmission(1);

    expect(ret).toEqual(response);
    expect(serviceMock.getModerationSubmissionDetails).toHaveBeenCalledWith(1);
  });
});
