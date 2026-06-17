import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'http';
import request from 'supertest';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { buildArticleDetailResponse, buildArticleListResponse } from './article.test-fixtures';

function getHttpServer(app: INestApplication): Server {
  return app.getHttpServer() as Server;
}

describe('ArticleController HTTP', () => {
  let app: INestApplication;
  let httpServer: Server;

  const articleServiceMock: jest.Mocked<
    Pick<ArticleService, 'getArticleDetail' | 'getArticleList'>
  > = {
    getArticleDetail: jest.fn(),
    getArticleList: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [{ provide: ArticleService, useValue: articleServiceMock }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = getHttpServer(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /articles returns the article discovery list', async () => {
    const articleListResponse = buildArticleListResponse();
    articleServiceMock.getArticleList.mockResolvedValue(articleListResponse);

    await request(httpServer).get('/articles').expect(200).expect(articleListResponse);
    expect(articleServiceMock.getArticleList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      topicSlug: undefined,
    });
  });

  it('GET /articles passes topicSlug through to the article discovery list', async () => {
    const articleListResponse = buildArticleListResponse();
    articleServiceMock.getArticleList.mockResolvedValue(articleListResponse);

    await request(httpServer)
      .get('/articles')
      .query({ topicSlug: 'democracy' })
      .expect(200)
      .expect(articleListResponse);

    expect(articleServiceMock.getArticleList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      topicSlug: 'democracy',
    });
  });

  it('GET /articles/:slug returns the article detail payload', async () => {
    const articleDetailResponse = buildArticleDetailResponse();
    articleServiceMock.getArticleDetail.mockResolvedValue(articleDetailResponse);

    await request(httpServer)
      .get(`/articles/${articleDetailResponse.slug}`)
      .expect(200)
      .expect(articleDetailResponse);
  });

  it('GET /articles/:slug returns 404 when the article is missing', async () => {
    articleServiceMock.getArticleDetail.mockRejectedValue(
      new NotFoundException('No article found with slug missing'),
    );

    await request(httpServer).get('/articles/missing').expect(404);
  });

  it('GET /articles/:slug returns 404 when the article is unpublished', async () => {
    articleServiceMock.getArticleDetail.mockRejectedValue(
      new NotFoundException('No published article found with slug draft-article'),
    );

    await request(httpServer).get('/articles/draft-article').expect(404);
  });
});
