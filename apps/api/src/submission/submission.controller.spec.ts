import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import {
  // buildSubmissionEntity,
  buildEventSubmissionRequest,
  buildArticleSubmissionRequest,
  buildSubmissionSuccessResponse,
  buildSubmissionErrorResponse,
} from './submission.test-fixtures';
import { UnknownSubmissionTopicsError } from './submission.error';

describe('SubmissionController', () => {
  let submissionController: SubmissionController;

  const serviceMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [{ provide: SubmissionService, useValue: serviceMock }],
    }).compile();

    submissionController = app.get<SubmissionController>(SubmissionController);
  });

  it('submission fails with unknown topic', async () => {
    const submissionListResponse = buildSubmissionErrorResponse();
    serviceMock.create.mockRejectedValue(new UnknownSubmissionTopicsError(['unknown-topic']));

    try {
      await submissionController.makeSubmission(buildArticleSubmissionRequest());
      fail('Expected makeSubmission to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toEqual(submissionListResponse);
    }
  });

  it('submission fails with unknown error', async () => {
    const originalError = new Error('database offline');
    serviceMock.create.mockRejectedValue(originalError);

    try {
      await submissionController.makeSubmission(buildArticleSubmissionRequest());
      fail('Expected makeSubmission to throw');
    } catch (error) {
      expect(error).toBe(originalError);
    }
  });

  it('event submission', async () => {
    const req = buildEventSubmissionRequest();
    const resp = buildSubmissionSuccessResponse();
    serviceMock.create.mockResolvedValue(resp);

    const actual_resp = await submissionController.makeSubmission(req);
    expect(actual_resp).toEqual(resp);
    expect(serviceMock.create).toHaveBeenCalledWith(req);
  });

  it('article submission', async () => {
    const req = buildArticleSubmissionRequest();
    const resp = buildSubmissionSuccessResponse();
    serviceMock.create.mockResolvedValue(resp);

    const actual_resp = await submissionController.makeSubmission(req);
    expect(actual_resp).toEqual(resp);
    expect(serviceMock.create).toHaveBeenCalledWith(req);
  });
});
