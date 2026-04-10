import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import {
  buildSubmissionErrorResponse,
  buildEventSubmissionRequest,
  buildSubmissionSuccessResponse,
} from './submission.test-fixtures';
import { UnknownSubmissionTopicsError } from './submission.error';

describe('SubmissionController HTTP', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];

  const submissionServiceMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [{ provide: SubmissionService, useValue: submissionServiceMock }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /submissions returns the submission success response', async () => {
    const submissionSuccessResponse = buildSubmissionSuccessResponse();
    submissionServiceMock.create.mockResolvedValue(submissionSuccessResponse);

    const req = buildEventSubmissionRequest();
    await request(httpServer)
      .post('/submissions')
      .send(req)
      .expect(201)
      .expect(submissionSuccessResponse);

    expect(submissionServiceMock.create).toHaveBeenCalledWith(req);
  });

  it('POST /submissions returns 400 when the service raises UnknownSubmissionTopicsError', async () => {
    submissionServiceMock.create.mockRejectedValue(
      new UnknownSubmissionTopicsError(['unknown-topic']),
    );
    const req = buildEventSubmissionRequest();

    await request(httpServer)
      .post('/submissions/')
      .send(req)
      .expect(400)
      .expect(buildSubmissionErrorResponse());
  });

  it('POST /submissions returns 500 when the service raises non HTTP exception', async () => {
    submissionServiceMock.create.mockRejectedValue(new Error('some error'));
    const req = buildEventSubmissionRequest();

    await request(httpServer).post('/submissions/').send(req).expect(500);
  });
});
