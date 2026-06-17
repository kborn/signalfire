import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { buildArticleDetailResponse, buildArticleListResponse } from './article.test-fixtures';

type RequestTarget = Parameters<typeof request>[0];

function getHttpApp(app: INestApplication) {
  return app.getHttpAdapter().getInstance() as RequestTarget;
}

describe('ArticleController HTTP', () => {
  let app: INestApplication;
  let httpApp: RequestTarget;

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
    httpApp = getHttpApp(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /articles returns the article discovery list', async () => {
    const articleListResponse = buildArticleListResponse();
    articleServiceMock.getArticleList.mockResolvedValue(articleListResponse);

    await request(httpApp).get('/articles').expect(200).expect(articleListResponse);
    expect(articleServiceMock.getArticleList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      topicSlug: undefined,
    });
  });

  it('GET /articles passes topicSlug through to the article discovery list', async () => {
    const articleListResponse = buildArticleListResponse();
    articleServiceMock.getArticleList.mockResolvedValue(articleListResponse);

    await request(httpApp)
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

    await request(httpApp)
      .get(`/articles/${articleDetailResponse.slug}`)
      .expect(200)
      .expect(articleDetailResponse);
  });

  it('GET /articles/:slug returns 404 when the article is missing', async () => {
    articleServiceMock.getArticleDetail.mockRejectedValue(
      new NotFoundException('No article found with slug missing'),
    );

    await request(httpApp).get('/articles/missing').expect(404);
  });

  it('GET /articles/:slug returns 404 when the article is unpublished', async () => {
    articleServiceMock.getArticleDetail.mockRejectedValue(
      new NotFoundException('No published article found with slug draft-article'),
    );

    await request(httpApp).get('/articles/draft-article').expect(404);
  });
});
