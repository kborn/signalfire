import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';
import { NotFoundException } from '@nestjs/common';
import {
  buildArticleDetailRecord,
  buildArticleDetailResponse,
  buildArticleEntity,
} from './article.test-fixtures';

describe('ArticleService', () => {
  let service: ArticleService;
  const repoMock = {
    findBySlug: jest.fn(),
    findPublishedBySlug: jest.fn(),
    findPublishedByTopicSlug: jest.fn(),
    findPublishedByActionId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService, { provide: ArticleRepository, useValue: repoMock }],
    }).compile();
    service = module.get(ArticleService);
  });

  it('getArticleDetail', async () => {
    const article = buildArticleEntity();
    repoMock.findBySlug.mockResolvedValue(article);

    const slug = 'test';
    const ret = await service.getArticleDetail(slug);

    expect(ret).toEqual(article);
    expect(repoMock.findBySlug).toHaveBeenCalledWith(slug);
  });

  it('getPublishedArticleDetail', async () => {
    const publishedArticleDetail = buildArticleDetailRecord();
    repoMock.findPublishedBySlug.mockResolvedValue(publishedArticleDetail);

    const slug = 'test';
    const ret = await service.getPublishedArticleDetail(slug);

    expect(ret).toEqual(buildArticleDetailResponse());
    expect(repoMock.findPublishedBySlug).toHaveBeenCalledWith(slug);
  });

  it('getPublishedArticleDetailNotFound', async () => {
    repoMock.findPublishedBySlug.mockResolvedValue(null);

    await expect(service.getPublishedArticleDetail('missing')).rejects.toThrow(NotFoundException);
  });

  it('getArticlesForTopic', async () => {
    const article = buildArticleEntity();
    repoMock.findPublishedByTopicSlug.mockResolvedValue([article]);

    const slug = 'test';
    const ret = await service.getArticlesForTopic(slug);

    expect(ret).toEqual([article]);
    expect(repoMock.findPublishedByTopicSlug).toHaveBeenCalledWith(slug);
  });

  it('getArticlesForAction', async () => {
    const article = buildArticleEntity();
    repoMock.findPublishedByActionId.mockResolvedValue([article]);

    const id = 1;
    const ret = await service.getArticlesForAction(id);

    expect(ret).toEqual([article]);
    expect(repoMock.findPublishedByActionId).toHaveBeenCalledWith(id);
  });
});
