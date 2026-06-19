import { BadRequestException, HttpException } from '@nestjs/common';
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
import { SubmissionRateLimitService } from './submission-rate-limit.service';

describe('SubmissionController', () => {
  let submissionController: SubmissionController;

  const serviceMock = {
    create: jest.fn(),
  };
  const rateLimitServiceMock = {
    consume: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    rateLimitServiceMock.consume.mockReturnValue({ allowed: true, retryAfterSeconds: 0 });

    const app: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [
        { provide: SubmissionService, useValue: serviceMock },
        { provide: SubmissionRateLimitService, useValue: rateLimitServiceMock },
      ],
    }).compile();

    submissionController = app.get<SubmissionController>(SubmissionController);
  });

  it('submission fails with unknown topic', async () => {
    const submissionListResponse = buildSubmissionErrorResponse();
    serviceMock.create.mockRejectedValue(new UnknownSubmissionTopicsError(['unknown-topic']));

    const req = buildArticleSubmissionRequest();
    try {
      await submissionController.makeSubmission(
        req,
        {} as never,
        { setHeader: jest.fn() } as never,
      );
      fail('Expected makeSubmission to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toEqual(submissionListResponse);
    }
    expect(rateLimitServiceMock.consume).toHaveBeenCalled();
    expect(serviceMock.create).toHaveBeenCalledWith(req);
  });

  it('submission fails with unknown error', async () => {
    const originalError = new Error('database offline');
    serviceMock.create.mockRejectedValue(originalError);

    const req = buildArticleSubmissionRequest();
    try {
      await submissionController.makeSubmission(
        req,
        {} as never,
        { setHeader: jest.fn() } as never,
      );
      fail('Expected makeSubmission to throw');
    } catch (error) {
      expect(error).toBe(originalError);
    }
    expect(rateLimitServiceMock.consume).toHaveBeenCalled();
    expect(serviceMock.create).toHaveBeenCalledWith(req);
  });

  it('event submission', async () => {
    const req = buildEventSubmissionRequest();
    const resp = buildSubmissionSuccessResponse();
    serviceMock.create.mockResolvedValue(resp);

    const actual_resp = await submissionController.makeSubmission(
      req,
      { ip: '203.0.113.10' } as never,
      { setHeader: jest.fn() } as never,
    );
    expect(actual_resp).toEqual(resp);
    expect(rateLimitServiceMock.consume).toHaveBeenCalledWith('203.0.113.10');
    expect(serviceMock.create).toHaveBeenCalledWith(req);
  });

  it('article submission', async () => {
    const req = buildArticleSubmissionRequest();
    const resp = buildSubmissionSuccessResponse();
    serviceMock.create.mockResolvedValue(resp);

    const actual_resp = await submissionController.makeSubmission(
      req,
      { ip: '203.0.113.11' } as never,
      { setHeader: jest.fn() } as never,
    );
    expect(actual_resp).toEqual(resp);
    expect(serviceMock.create).toHaveBeenCalledWith(req);
  });

  it('returns a form-level 429 when the submission rate limit is exceeded', async () => {
    rateLimitServiceMock.consume.mockReturnValue({ allowed: false, retryAfterSeconds: 120 });
    const setHeader = jest.fn();

    try {
      await submissionController.makeSubmission(
        buildArticleSubmissionRequest(),
        { ip: '198.51.100.20' } as never,
        { setHeader } as never,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(429);
      expect((error as HttpException).getResponse()).toEqual({
        errors: [
          {
            type: 'form',
            message:
              'Too many submissions were sent from this connection. Please wait a few minutes and try again.',
          },
        ],
      });
    }

    expect(setHeader).toHaveBeenCalledWith('Retry-After', '120');
    expect(serviceMock.create).not.toHaveBeenCalled();
  });
});
