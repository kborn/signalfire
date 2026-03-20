import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { NotFoundException } from '@nestjs/common';

const article = {
  id: 1,
  slug: 'protect-voting-rights',
  title: 'Protect Voting Rights',
  summary: 'A short article summary.',
  content: 'Full article content.',
  status: 'PUBLISHED',
  author: 'SignalFire Staff',
  createdAt: new Date(),
  publishedAt: new Date(),
  updatedAt: new Date(),
};

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
    serviceMock.getPublishedArticleDetail.mockResolvedValue(article);
    const slug = 'test';
    const ret = await articleController.findArticle(slug);
    expect(ret).toEqual(article);
    expect(serviceMock.getPublishedArticleDetail).toHaveBeenCalledWith(slug);
  });

  it('findArticleNotFound', async () => {
    serviceMock.getPublishedArticleDetail.mockResolvedValue(null);

    const slug = 'test';
    await expect(articleController.findArticle(slug)).rejects.toThrow(NotFoundException);
  });
});
