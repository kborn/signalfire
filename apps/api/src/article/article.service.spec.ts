import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';
import { NotFoundException } from '@nestjs/common';
import {
  ARTICLE_TEST_DATE,
  buildArticleListResponse,
  buildArticleDetailRecord,
  buildArticleDetailResponse,
  buildArticleEntity,
} from './article.test-fixtures';

describe('ArticleService', () => {
  let service: ArticleService;
  const repoMock = {
    findBySlug: jest.fn(),
    findPublished: jest.fn(),
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

  it('getPublishedArticleList', async () => {
    const article1 = buildArticleEntity();
    const article2 = buildArticleEntity({
      id: 2,
      slug: 'how-local-climate-policy-works',
      title: 'How Local Climate Policy Works',
      summary: 'A guide to city-level climate policy.',
      publishedAt: new Date('2025-12-18T03:24:00.000Z'),
    });
    repoMock.findPublished.mockResolvedValue([article1, article2]);

    const ret = await service.getPublishedArticleList();

    expect(ret).toEqual(
      buildArticleListResponse({
        items: [
          {
            id: 1,
            slug: 'protect-voting-rights',
            title: 'Protect Voting Rights',
            summary: 'A short article summary.',
            publishedAt: ARTICLE_TEST_DATE.toISOString(),
          },
          {
            id: 2,
            slug: 'how-local-climate-policy-works',
            title: 'How Local Climate Policy Works',
            summary: 'A guide to city-level climate policy.',
            publishedAt: new Date('2025-12-18T03:24:00.000Z').toISOString(),
          },
        ],
      }),
    );
    expect(repoMock.findPublished).toHaveBeenCalled();
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
