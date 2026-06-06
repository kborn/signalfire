import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';
import { TopicRepository } from '../topic/topic.repository';
import { ActionRepository } from '../action/action.repository';
import { NotFoundException } from '@nestjs/common';
import {
  ARTICLE_TEST_DATE,
  buildArticleListResponse,
  buildArticleDetailResponse,
  buildArticleEntity,
} from './article.test-fixtures';
import { ActionType, EntityStatus } from '@prisma/client';

describe('ArticleService', () => {
  let service: ArticleService;
  const repoMock = {
    findBySlug: jest.fn(),
    findPublished: jest.fn(),
    findPublishedBySlug: jest.fn(),
    findPublishedByTopicSlug: jest.fn(),
    findPublishedByActionId: jest.fn(),
  };
  const topicRepoMock = {
    findByArticleId: jest.fn(),
  };
  const actionRepoMock = {
    findPublishedByArticleId: jest.fn(),
    findBySlug: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        { provide: ArticleRepository, useValue: repoMock },
        { provide: TopicRepository, useValue: topicRepoMock },
        { provide: ActionRepository, useValue: actionRepoMock },
      ],
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

    const ret = await service.getArticleList();

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
    const publishedArticle = buildArticleEntity();
    repoMock.findPublishedBySlug.mockResolvedValue(publishedArticle);
    topicRepoMock.findByArticleId.mockResolvedValue([
      {
        id: 1,
        slug: 'democracy',
        name: 'Democracy',
        description: 'desc',
        createdAt: ARTICLE_TEST_DATE,
      },
    ]);
    actionRepoMock.findPublishedByArticleId.mockResolvedValue([
      {
        id: 1,
        slug: 'call-your-representative',
        title: 'Call Your Representative',
        summary: 'A short action summary.',
        description: 'A longer action description.',
        actionType: ActionType.CONTACT,
        status: 'PUBLISHED',
        createdAt: ARTICLE_TEST_DATE,
        publishedAt: ARTICLE_TEST_DATE,
        updatedAt: ARTICLE_TEST_DATE,
      },
    ]);

    const slug = 'test';
    const ret = await service.getArticleDetail(slug, EntityStatus.PUBLISHED);

    expect(ret).toEqual(buildArticleDetailResponse());
    expect(repoMock.findPublishedBySlug).toHaveBeenCalledWith(slug);
    expect(topicRepoMock.findByArticleId).toHaveBeenCalledWith(1);
    expect(actionRepoMock.findPublishedByArticleId).toHaveBeenCalledWith(1);
    expect(actionRepoMock.findBySlug).not.toHaveBeenCalled();
  });

  it('getPublishedArticleDetail only includes related actions returned by the published lookup', async () => {
    const publishedArticle = buildArticleEntity();
    repoMock.findPublishedBySlug.mockResolvedValue(publishedArticle);
    topicRepoMock.findByArticleId.mockResolvedValue([
      {
        id: 1,
        slug: 'democracy',
        name: 'Democracy',
        description: 'desc',
        createdAt: ARTICLE_TEST_DATE,
      },
    ]);
    actionRepoMock.findPublishedByArticleId.mockResolvedValue([
      {
        id: 2,
        slug: 'published-related-action',
        title: 'Published Related Action',
        summary: 'Published related action summary.',
        description: 'Published related action description.',
        actionType: ActionType.CONTACT,
        status: 'PUBLISHED',
        createdAt: ARTICLE_TEST_DATE,
        publishedAt: ARTICLE_TEST_DATE,
        updatedAt: ARTICLE_TEST_DATE,
      },
    ]);

    const ret = await service.getArticleDetail('test', EntityStatus.PUBLISHED);

    expect(ret.actions).toEqual([
      {
        id: 2,
        slug: 'published-related-action',
        title: 'Published Related Action',
        summary: 'Published related action summary.',
        actionType: ActionType.CONTACT,
        publishedAt: ARTICLE_TEST_DATE.toISOString(),
      },
    ]);
  });

  it('getPublishedArticleDetailNotFound', async () => {
    repoMock.findPublishedBySlug.mockResolvedValue(null);

    await expect(service.getArticleDetail('missing', EntityStatus.PUBLISHED)).rejects.toThrow(
      NotFoundException,
    );
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
