import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { NotFoundException } from '@nestjs/common';
import { buildArticleListResponse, buildArticleDetailResponse } from './article.test-fixtures';

describe('ArticleController', () => {
  let articleController: ArticleController;
  const serviceMock = {
    getArticleDetail: jest.fn(),
    getArticleList: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [{ provide: ArticleService, useValue: serviceMock }],
    }).compile();

    articleController = app.get<ArticleController>(ArticleController);
  });

  it('findArticles', async () => {
    const articleListResponse = buildArticleListResponse();
    serviceMock.getArticleList.mockResolvedValue(articleListResponse);
    const ret = await articleController.findArticles({
      page: 1,
      pageSize: 10,
      topicSlug: undefined,
    });
    expect(ret).toEqual(articleListResponse);
    expect(serviceMock.getArticleList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      topicSlug: undefined,
    });
  });

  it('findArticles with topicSlug', async () => {
    const articleListResponse = buildArticleListResponse();
    serviceMock.getArticleList.mockResolvedValue(articleListResponse);

    const ret = await articleController.findArticles({
      page: 1,
      pageSize: 10,
      topicSlug: 'democracy',
    });
    expect(ret).toEqual(articleListResponse);
    expect(serviceMock.getArticleList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      topicSlug: 'democracy',
    });
  });

  it('findArticle', async () => {
    const articleDetailResponse = buildArticleDetailResponse();
    serviceMock.getArticleDetail.mockResolvedValue(articleDetailResponse);
    const slug = 'test';
    const ret = await articleController.findArticle(slug);
    expect(ret).toEqual(articleDetailResponse);
    expect(serviceMock.getArticleDetail).toHaveBeenCalledWith(slug);
  });

  it('findArticleNotFound', async () => {
    serviceMock.getArticleDetail.mockRejectedValue(new NotFoundException());

    const slug = 'test';
    await expect(articleController.findArticle(slug)).rejects.toThrow(NotFoundException);
  });
});
