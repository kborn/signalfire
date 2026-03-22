import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { NotFoundException } from '@nestjs/common';
import { buildArticleDetailResponse } from './article.test-fixtures';

describe('ArticleController', () => {
  let articleController: ArticleController;
  const serviceMock = {
    getPublishedArticleDetail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [{ provide: ArticleService, useValue: serviceMock }],
    }).compile();

    articleController = app.get<ArticleController>(ArticleController);
  });

  it('findArticle', async () => {
    const articleDetailResponse = buildArticleDetailResponse();
    serviceMock.getPublishedArticleDetail.mockResolvedValue(articleDetailResponse);
    const slug = 'test';
    const ret = await articleController.findArticle(slug);
    expect(ret).toEqual(articleDetailResponse);
    expect(serviceMock.getPublishedArticleDetail).toHaveBeenCalledWith(slug);
  });

  it('findArticleNotFound', async () => {
    serviceMock.getPublishedArticleDetail.mockRejectedValue(new NotFoundException());

    const slug = 'test';
    await expect(articleController.findArticle(slug)).rejects.toThrow(NotFoundException);
  });
});
