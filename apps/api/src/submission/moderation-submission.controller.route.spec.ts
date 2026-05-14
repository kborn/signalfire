import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ModerationSubmissionController } from './moderation-submission.controller';
import { ModerationSubmissionService } from './moderation-submission.service';
import {
  buildModerationReviewRejectRequest,
  buildModerationReviewRejectSuccessResponse,
  buildModerationReviewApproveArticleRequest,
  buildModerationReviewApproveArticleSuccessResponse,
  buildModerationReviewApproveEventSuccessResponse,
  buildModerationReviewApproveEventRequest,
} from './submission.test-fixtures';

describe('ModerationSubmissionController HTTP', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];

  const moderationSubmissionServiceMock = {
    reviewSubmission: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ModerationSubmissionController],
      providers: [
        { provide: ModerationSubmissionService, useValue: moderationSubmissionServiceMock },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST moderation rejection returns appropriate response', async () => {
    const req = buildModerationReviewRejectRequest();
    const moderationSubmissionSuccessResponse = buildModerationReviewRejectSuccessResponse();

    moderationSubmissionServiceMock.reviewSubmission.mockResolvedValue(
      moderationSubmissionSuccessResponse,
    );

    await request(httpServer)
      .post('/admin/submissions/1/review')
      .send(req)
      .expect(200)
      .expect(moderationSubmissionSuccessResponse);
    expect(moderationSubmissionServiceMock.reviewSubmission).toHaveBeenCalledWith(1, req);
  });

  it('POST article approval returns appropriate response', async () => {
    const req = buildModerationReviewApproveArticleRequest();
    const moderationSubmissionSuccessResponse =
      buildModerationReviewApproveArticleSuccessResponse();

    moderationSubmissionServiceMock.reviewSubmission.mockResolvedValue(
      moderationSubmissionSuccessResponse,
    );

    await request(httpServer)
      .post('/admin/submissions/1/review')
      .send(req)
      .expect(200)
      .expect(moderationSubmissionSuccessResponse);
    expect(moderationSubmissionServiceMock.reviewSubmission).toHaveBeenCalledWith(1, req);
  });

  it('POST review returns 400 for missing decision before calling service', async () => {
    const req = buildModerationReviewApproveEventRequest();
    const moderationSubmissionSuccessResponse = buildModerationReviewApproveEventSuccessResponse();

    moderationSubmissionServiceMock.reviewSubmission.mockResolvedValue(
      moderationSubmissionSuccessResponse,
    );

    await request(httpServer)
      .post('/admin/submissions/1/review')
      .send(req)
      .expect(200)
      .expect(moderationSubmissionSuccessResponse);
    expect(moderationSubmissionServiceMock.reviewSubmission).toHaveBeenCalledWith(1, req);
  });

  it('POST review returns 400 for invalid decision before calling service', async () => {
    await request(httpServer).post('/admin/submissions/1/review').send({}).expect(400);
    expect(moderationSubmissionServiceMock.reviewSubmission).not.toHaveBeenCalled();
  });

  it('POST event approval returns appropriate response', async () => {
    await request(httpServer)
      .post('/admin/submissions/1/review')
      .send({ decision: 'APPROVE_ACTION' })
      .expect(400);
    expect(moderationSubmissionServiceMock.reviewSubmission).not.toHaveBeenCalled();
  });

  it('POST article approval normalizes omitted review notes before calling service', async () => {
    const req = { ...buildModerationReviewApproveArticleRequest(), reviewNotes: undefined };
    const moderationSubmissionSuccessResponse =
      buildModerationReviewApproveArticleSuccessResponse();

    moderationSubmissionServiceMock.reviewSubmission.mockResolvedValue(
      moderationSubmissionSuccessResponse,
    );

    await request(httpServer)
      .post('/admin/submissions/1/review')
      .send(req)
      .expect(200)
      .expect(moderationSubmissionSuccessResponse);
    expect(moderationSubmissionServiceMock.reviewSubmission).toHaveBeenCalledWith(1, {
      ...req,
      reviewNotes: null,
    });
  });

  it('POST review returns 404 when service raises NotFoundException', async () => {
    const req = buildModerationReviewApproveArticleRequest();

    moderationSubmissionServiceMock.reviewSubmission.mockRejectedValue(
      new NotFoundException(`No submission found with id 1`),
    );

    await request(httpServer).post('/admin/submissions/1/review').send(req).expect(404);
    expect(moderationSubmissionServiceMock.reviewSubmission).toHaveBeenCalledWith(1, req);
  });
});
