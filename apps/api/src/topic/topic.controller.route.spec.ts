import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'http';
import request from 'supertest';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { buildTopicDetailResponse, buildTopicListResponse } from './topic.test-fixtures';

function getHttpServer(app: INestApplication): Server {
  return app.getHttpServer() as Server;
}

describe('TopicController HTTP', () => {
  let app: INestApplication;
  let httpServer: Server;

  const topicServiceMock: jest.Mocked<Pick<TopicService, 'getTopics' | 'getTopicDetail'>> = {
    getTopics: jest.fn(),
    getTopicDetail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [{ provide: TopicService, useValue: topicServiceMock }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = getHttpServer(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /topics returns the topic discovery list', async () => {
    const topicListResponse = buildTopicListResponse();
    topicServiceMock.getTopics.mockResolvedValue(topicListResponse);

    await request(httpServer).get('/topics').expect(200).expect(topicListResponse);
  });

  it('GET /topics/:slug returns the topic detail payload', async () => {
    const topicDetailResponse = buildTopicDetailResponse();
    topicServiceMock.getTopicDetail.mockResolvedValue(topicDetailResponse);

    await request(httpServer)
      .get(`/topics/${topicDetailResponse.slug}`)
      .expect(200)
      .expect(topicDetailResponse);
  });

  it('GET /topics/:slug returns 404 when the topic is missing', async () => {
    topicServiceMock.getTopicDetail.mockRejectedValue(
      new NotFoundException('No topic found with slug missing'),
    );

    await request(httpServer).get('/topics/missing').expect(404);
  });
});
