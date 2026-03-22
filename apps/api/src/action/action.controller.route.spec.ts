import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { ActionDetailResponse } from './action.types';

const date = new Date('2025-12-17T03:24:00');

const actionDetailResponse: ActionDetailResponse = {
  id: 1,
  slug: 'call-your-representative',
  title: 'Call Your Representative',
  summary: 'A short action summary.',
  description: 'A longer action description.',
  actionType: 'CONTACT',
  updatedAt: date.toISOString(),
  topics: [{ id: 1, slug: 'democracy', name: 'Democracy', description: 'desc' }],
  articles: [
    {
      id: 1,
      slug: 'protect-voting-rights',
      title: 'Protect Voting Rights',
      summary: 'A short article summary.',
      publishedAt: date.toISOString(),
    },
  ],
};

describe('ActionController HTTP', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];

  const actionServiceMock: jest.Mocked<
    Pick<ActionService, 'getActionDetail' | 'getPublishedActionDetail'>
  > = {
    getActionDetail: jest.fn(),
    getPublishedActionDetail: jest.fn(),
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

  it('GET /actions/:slug returns the action detail payload', async () => {
    actionServiceMock.getPublishedActionDetail.mockResolvedValue(actionDetailResponse);

    await request(httpServer).get('/actions/democracy').expect(200).expect(actionDetailResponse);
  });

  it('GET /actions/:slug returns 404 when the action is missing', async () => {
    actionServiceMock.getPublishedActionDetail.mockRejectedValue(
      new NotFoundException('No action found with slug missing'),
    );

    await request(httpServer).get('/actions/missing').expect(404);
  });

  it('GET /actions/:slug returns 404 when the action is unpublished', async () => {
    actionServiceMock.getPublishedActionDetail.mockRejectedValue(
      new NotFoundException('No published action found with slug draft-action'),
    );

    await request(httpServer).get('/actions/draft-action').expect(404);
  });
});
