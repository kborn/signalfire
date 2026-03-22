import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleDetailResponse } from './article.types';
import { ActionType } from '@prisma/client';

const date = new Date('2025-12-17T03:24:00');

const articleDetailResponse: ArticleDetailResponse = {
  id: 1,
  slug: 'protect-voting-rights',
  title: 'Protect Voting Rights',
  summary: 'A short article summary.',
  content: 'Full article content.',
  publishedAt: date.toISOString(),
  updatedAt: date.toISOString(),
  topics: [{ id: 1, slug: 'democracy', name: 'Democracy', description: 'desc' }],
  actions: [
    {
      id: 1,
      slug: 'call-your-representative',
      title: 'Call Your Representative',
      summary: 'A short action summary.',
      actionType: ActionType.CONTACT,
    },
  ],
};

describe('ArticleController HTTP', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];

  const articleServiceMock: jest.Mocked<
    Pick<ArticleService, 'getArticleDetail' | 'getPublishedArticleDetail'>
  > = {
    getArticleDetail: jest.fn(),
    getPublishedArticleDetail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [{ provide: ArticleService, useValue: articleServiceMock }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /articles/:slug returns the article detail payload', async () => {
    articleServiceMock.getPublishedArticleDetail.mockResolvedValue(articleDetailResponse);

    await request(httpServer).get('/articles/democracy').expect(200).expect(articleDetailResponse);
  });

  it('GET /articles/:slug returns 404 when the article is missing', async () => {
    articleServiceMock.getPublishedArticleDetail.mockRejectedValue(
      new NotFoundException('No article found with slug missing'),
    );

    await request(httpServer).get('/articles/missing').expect(404);
  });
});
