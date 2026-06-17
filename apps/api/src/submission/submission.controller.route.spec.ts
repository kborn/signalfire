import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import {
  buildSubmissionErrorResponse,
  buildEventSubmissionRequest,
  buildSubmissionSuccessResponse,
  buildArticleSubmissionRequest,
} from './submission.test-fixtures';
import { UnknownSubmissionTopicsError } from './submission.error';

type RequestTarget = Parameters<typeof request>[0];

function getHttpApp(app: INestApplication) {
  return app.getHttpAdapter().getInstance() as RequestTarget;
}

describe('SubmissionController HTTP', () => {
  let app: INestApplication;
  let httpApp: RequestTarget;

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
    httpApp = getHttpApp(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /submissions for event request returns submission success response', async () => {
    const submissionSuccessResponse = buildSubmissionSuccessResponse();
    submissionServiceMock.create.mockResolvedValue(submissionSuccessResponse);

    const req = buildEventSubmissionRequest();
    await request(httpApp)
      .post('/submissions')
      .send(req)
      .expect(201)
      .expect(submissionSuccessResponse);

    expect(submissionServiceMock.create).toHaveBeenCalledWith(req);
  });

  it('POST /submissions for article request returns submission success response', async () => {
    const submissionSuccessResponse = buildSubmissionSuccessResponse();
    submissionServiceMock.create.mockResolvedValue(submissionSuccessResponse);

    const req = buildArticleSubmissionRequest();
    await request(httpApp)
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

    await request(httpApp)
      .post('/submissions/')
      .send(req)
      .expect(400)
      .expect(buildSubmissionErrorResponse());
    expect(submissionServiceMock.create).toHaveBeenCalledWith(req);
  });

  it('POST /submissions returns 400 for invalid article payloads before calling the service', async () => {
    const req = buildArticleSubmissionRequest({
      payload: {
        title: '   ',
      },
    });

    await request(httpApp)
      .post('/submissions')
      .send(req)
      .expect(400)
      .expect({
        errors: [
          {
            type: 'field',
            field: 'payload.title',
            message: 'Title is required',
          },
        ],
      });

    expect(submissionServiceMock.create).not.toHaveBeenCalled();
  });

  it('POST /submissions returns 400 for invalid top-level email before calling the service', async () => {
    const req = buildEventSubmissionRequest({
      submitterEmail: 'not-an-email',
    });

    await request(httpApp)
      .post('/submissions')
      .send(req)
      .expect(400)
      .expect({
        errors: [
          {
            type: 'field',
            field: 'submitterEmail',
            message: 'Email must be valid',
          },
        ],
      });

    expect(submissionServiceMock.create).not.toHaveBeenCalled();
  });

  it('POST /submissions returns 400 for invalid event datetime ordering before calling the service', async () => {
    const req = buildEventSubmissionRequest({
      payload: {
        endTime: '2026-05-14T16:00:00.000Z',
      },
    });

    await request(httpApp)
      .post('/submissions')
      .send(req)
      .expect(400)
      .expect({
        errors: [
          {
            type: 'field',
            field: 'payload.endTime',
            message: 'End datetime must be greater than or equal to start datetime',
          },
        ],
      });

    expect(submissionServiceMock.create).not.toHaveBeenCalled();
  });

  it('POST /submissions returns 500 when the service raises non HTTP exception', async () => {
    submissionServiceMock.create.mockRejectedValue(new Error('some error'));
    const req = buildEventSubmissionRequest();

    await request(httpApp).post('/submissions/').send(req).expect(500);
    expect(submissionServiceMock.create).toHaveBeenCalledWith(req);
  });
});
