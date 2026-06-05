import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { buildActionDetailResponse, buildActionListResponse } from './action.test-fixtures';

describe('ActionController HTTP', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];

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
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /actions returns the action discovery list', async () => {
    const actionListResponse = buildActionListResponse();
    actionServiceMock.getActionList.mockResolvedValue(actionListResponse);

    await request(httpServer).get('/actions').expect(200).expect(actionListResponse);
  });

  it('GET /actions/:slug returns the action detail payload', async () => {
    const actionDetailResponse = buildActionDetailResponse();
    actionServiceMock.getActionDetail.mockResolvedValue(actionDetailResponse);

    await request(httpServer)
      .get(`/actions/${actionDetailResponse.slug}`)
      .expect(200)
      .expect(actionDetailResponse);
  });

  it('GET /actions/:slug returns 404 when the action is missing', async () => {
    actionServiceMock.getActionDetail.mockRejectedValue(
      new NotFoundException('No action found with slug missing'),
    );

    await request(httpServer).get('/actions/missing').expect(404);
  });

  it('GET /actions/:slug returns 404 when the action is unpublished', async () => {
    actionServiceMock.getActionDetail.mockRejectedValue(
      new NotFoundException('No action found with slug draft-action and status PUBLISHED'),
    );

    await request(httpServer).get('/actions/draft-action').expect(404);
  });
});
