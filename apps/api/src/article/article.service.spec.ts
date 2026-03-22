import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { ArticleRepository } from './article.repository';
import { ActionType, EntityStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

const date = new Date('2025-12-17T03:24:00');
const article = {
  id: 1,
  slug: 'protect-voting-rights',
  title: 'Protect Voting Rights',
  summary: 'A short article summary.',
  content: 'Full article content.',
  status: 'PUBLISHED',
  author: 'SignalFire Staff',
  createdAt: date,
  publishedAt: date,
  updatedAt: date,
};

const publishedArticleDetail = {
  ...article,
  topicArticles: [
    {
      topicId: 1,
      articleId: 1,
      assignedAt: date,
      assignedBy: 'SignalFire Staff',
      topic: {
        id: 1,
        slug: 'democracy',
        name: 'Democracy',
        description: 'desc',
        createdAt: date,
      },
    },
  ],
  articleActions: [
    {
      articleId: 1,
      actionId: 1,
      assignedAt: date,
      assignedBy: 'SignalFire Staff',
      action: {
        id: 1,
        slug: 'call-your-representative',
        title: 'Call Your Representative',
        summary: 'A short action summary.',
        description: 'A longer action description.',
        actionType: ActionType.CONTACT,
        status: EntityStatus.PUBLISHED,
        createdAt: date,
        updatedAt: date,
      },
    },
  ],
};

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
    repoMock.findBySlug.mockResolvedValue(article);

    const slug = 'test';
    const ret = await service.getArticleDetail(slug);

    expect(ret).toEqual(article);
    expect(repoMock.findBySlug).toHaveBeenCalledWith(slug);
  });

  it('getPublishedArticleDetail', async () => {
    repoMock.findPublishedBySlug.mockResolvedValue(publishedArticleDetail);

    const slug = 'test';
    const ret = await service.getPublishedArticleDetail(slug);

    expect(ret).toEqual({
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
    });
    expect(repoMock.findPublishedBySlug).toHaveBeenCalledWith(slug);
  });

  it('getPublishedArticleDetailNotFound', async () => {
    repoMock.findPublishedBySlug.mockResolvedValue(null);

    await expect(service.getPublishedArticleDetail('missing')).rejects.toThrow(NotFoundException);
  });

  it('getArticlesForTopic', async () => {
    repoMock.findPublishedByTopicSlug.mockResolvedValue([article]);

    const slug = 'test';
    const ret = await service.getArticlesForTopic(slug);

    expect(ret).toEqual([article]);
    expect(repoMock.findPublishedByTopicSlug).toHaveBeenCalledWith(slug);
  });

  it('getArticlesForAction', async () => {
    repoMock.findPublishedByActionId.mockResolvedValue([article]);

    const id = 1;
    const ret = await service.getArticlesForAction(id);

    expect(ret).toEqual([article]);
    expect(repoMock.findPublishedByActionId).toHaveBeenCalledWith(id);
  });
});
