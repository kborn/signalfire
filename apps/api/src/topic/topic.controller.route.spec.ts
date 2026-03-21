import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicDetailResponse, TopicListResponse } from './topic.types';
import { ActionType } from '@prisma/client';

const topicListResponse: TopicListResponse = {
  items: [
    {
      id: 1,
      slug: 'democracy',
      name: 'Democracy',
      description: 'desc',
    },
    {
      id: 2,
      slug: 'climate',
      name: 'Climate',
      description: 'desc',
    },
  ],
};

const topicDetailResponse: TopicDetailResponse = {
  id: 1,
  slug: 'democracy',
  name: 'Democracy',
  description: 'desc',
  articles: [
    {
      id: 11,
      slug: 'protect-voting-rights',
      title: 'Protect Voting Rights',
      summary: 'A short article summary.',
      publishedAt: '2026-03-20T15:30:00.000Z',
    },
  ],
  actions: [
    {
      id: 21,
      slug: 'call-your-representative',
      title: 'Call Your Representative',
      summary: 'A short action summary.',
      actionType: ActionType.CONTACT,
    },
  ],
};

describe('TopicController HTTP', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];

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
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /topics returns the topic discovery list', async () => {
    topicServiceMock.getTopics.mockResolvedValue(topicListResponse);

    await request(httpServer).get('/topics').expect(200).expect(topicListResponse);
  });

  it('GET /topics/:slug returns the topic detail payload', async () => {
    topicServiceMock.getTopicDetail.mockResolvedValue(topicDetailResponse);

    await request(httpServer).get('/topics/democracy').expect(200).expect(topicDetailResponse);
  });

  it('GET /topics/:slug returns 404 when the topic is missing', async () => {
    topicServiceMock.getTopicDetail.mockRejectedValue(
      new NotFoundException('No topic found with slug missing'),
    );

    await request(httpServer).get('/topics/missing').expect(404);
  });
});
