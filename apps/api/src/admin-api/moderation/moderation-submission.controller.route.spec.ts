import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'http';
import request from 'supertest';
import { ModerationSubmissionController } from './moderation-submission.controller';
import { ModerationSubmissionService } from './moderation-submission.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import {
  buildModerationReviewRejectRequest,
  buildModerationReviewRejectSuccessResponse,
  buildModerationReviewApproveArticleRequest,
  buildModerationReviewApproveArticleSuccessResponse,
  buildModerationReviewApproveEventSuccessResponse,
  buildModerationReviewApproveEventRequest,
} from '../../submission/submission.test-fixtures';
import {
  ReviewSubmissionTypeError,
  UnknownSubmissionTopicsError,
} from '../../submission/submission.error';

describe('ModerationSubmissionController HTTP', () => {
  function getHttpServer(app: INestApplication): Server {
    return app.getHttpServer() as Server;
  }

  let app: INestApplication;
  let httpServer: Server;

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
    })
      .overrideGuard(AdminAuthGuard)
      .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = getHttpServer(app);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
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

  it('POST review returns 409 when service raises ReviewSubmissionTypeError', async () => {
    const req = buildModerationReviewApproveArticleRequest();

    moderationSubmissionServiceMock.reviewSubmission.mockRejectedValue(
      new ReviewSubmissionTypeError('ARTICLE', 'EVENT'),
    );

    await request(httpServer)
      .post('/admin/submissions/1/review')
      .send(req)
      .expect(409)
      .expect({
        errors: [
          {
            type: 'form',
            message: 'Unexpected type in submission review. Expected ARTICLE but received EVENT',
          },
        ],
      });
  });

  it('POST review returns 400 with fielded errors when service raises UnknownSubmissionTopicsError', async () => {
    const req = buildModerationReviewApproveEventRequest();

    moderationSubmissionServiceMock.reviewSubmission.mockRejectedValue(
      new UnknownSubmissionTopicsError(['unknown-topic']),
    );

    await request(httpServer)
      .post('/admin/submissions/1/review')
      .send(req)
      .expect(400)
      .expect({
        errors: [
          {
            type: 'field',
            field: 'normalized.topicSlugs',
            message: 'Unknown topic slugs: unknown-topic',
          },
        ],
      });
  });
});
