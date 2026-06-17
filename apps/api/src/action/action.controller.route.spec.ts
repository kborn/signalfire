import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { buildActionDetailResponse, buildActionListResponse } from './action.test-fixtures';

type RequestTarget = Parameters<typeof request>[0];

function getHttpApp(app: INestApplication) {
  return app.getHttpAdapter().getInstance() as RequestTarget;
}

describe('ActionController HTTP', () => {
  let app: INestApplication;
  let httpApp: RequestTarget;

  const actionServiceMock: jest.Mocked<Pick<ActionService, 'getActionDetail' | 'getActionList'>> = {
    getActionDetail: jest.fn(),
    getActionList: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ActionController],
      providers: [{ provide: ActionService, useValue: actionServiceMock }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpApp = getHttpApp(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /actions returns the action discovery list', async () => {
    const actionListResponse = buildActionListResponse();
    actionServiceMock.getActionList.mockResolvedValue(actionListResponse);

    await request(httpApp).get('/actions').expect(200).expect(actionListResponse);
    expect(actionServiceMock.getActionList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      topicSlug: undefined,
    });
  });

  it('GET /actions passes topicSlug through to the action discovery list', async () => {
    const actionListResponse = buildActionListResponse();
    actionServiceMock.getActionList.mockResolvedValue(actionListResponse);

    await request(httpApp)
      .get('/actions')
      .query({ topicSlug: 'democracy' })
      .expect(200)
      .expect(actionListResponse);

    expect(actionServiceMock.getActionList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      topicSlug: 'democracy',
    });
  });

  it('GET /actions/:slug returns the action detail payload', async () => {
    const actionDetailResponse = buildActionDetailResponse();
    actionServiceMock.getActionDetail.mockResolvedValue(actionDetailResponse);

    await request(httpApp)
      .get(`/actions/${actionDetailResponse.slug}`)
      .expect(200)
      .expect(actionDetailResponse);
  });

  it('GET /actions/:slug returns 404 when the action is missing', async () => {
    actionServiceMock.getActionDetail.mockRejectedValue(
      new NotFoundException('No action found with slug missing'),
    );

    await request(httpApp).get('/actions/missing').expect(404);
  });

  it('GET /actions/:slug returns 404 when the action is unpublished', async () => {
    actionServiceMock.getActionDetail.mockRejectedValue(
      new NotFoundException('No published action found with slug draft-action'),
    );

    await request(httpApp).get('/actions/draft-action').expect(404);
  });
});
