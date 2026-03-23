import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from './topic.service';
import { TopicRepository } from './topic.repository';
import { NotFoundException } from '@nestjs/common';
import { ArticleService } from '../article/article.service';
import { ActionService } from '../action/action.service';
import { ActionType } from '@prisma/client';

const date = new Date('2025-12-17T03:24:00');
const topic = {
  id: 1,
  slug: 'democracy',
  name: 'Democracy',
  description: 'desc',
  createdAt: date,
};

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

const action = {
  id: 1,
  slug: 'call-your-representative',
  title: 'Call Your Representative',
  summary: 'A short action summary.',
  description: 'A longer action description.',
  actionType: ActionType.CONTACT,
  status: 'PUBLISHED',
  createdAt: date,
  updatedAt: date,
  publishedAt: date,
};

describe('TopicService', () => {
  let service: TopicService;
  const repoMock = { findAll: jest.fn(), findBySlug: jest.fn() };
  const articleServiceMock = { getArticlesForTopic: jest.fn() };
  const actionServiceMock = { getActionsForTopic: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicService,
        { provide: TopicRepository, useValue: repoMock },
        { provide: ArticleService, useValue: articleServiceMock },
        { provide: ActionService, useValue: actionServiceMock },
      ],
    }).compile();
    service = module.get(TopicService);
  });

  it('getTopics', async () => {
    repoMock.findAll.mockResolvedValue([topic]);
    const ret = await service.getTopics();

    expect(ret).toEqual({
      items: [{ id: 1, slug: 'democracy', name: 'Democracy', description: 'desc' }],
    });
    expect(repoMock.findAll).toHaveBeenCalled();
  });

  it('getTopicDetail', async () => {
    repoMock.findBySlug.mockResolvedValue(topic);
    actionServiceMock.getActionsForTopic.mockResolvedValue([action]);
    articleServiceMock.getArticlesForTopic.mockResolvedValue([article]);

    const slug = 'test';
    const ret = await service.getTopicDetail(slug);

    expect(ret).toEqual({
      id: 1,
      slug: 'democracy',
      name: 'Democracy',
      description: 'desc',
      articles: [
        {
          id: 1,
          slug: 'protect-voting-rights',
          title: 'Protect Voting Rights',
          summary: 'A short article summary.',
          publishedAt: date.toISOString(),
        },
      ],
      actions: [
        {
          id: 1,
          slug: 'call-your-representative',
          title: 'Call Your Representative',
          summary: 'A short action summary.',
          actionType: ActionType.CONTACT,
          publishedAt: date.toISOString(),
        },
      ],
    });
    expect(repoMock.findBySlug).toHaveBeenCalledWith(slug);
  });

  it('findTopicNotFound', async () => {
    repoMock.findBySlug.mockResolvedValue(null);

    const slug = 'test';
    await expect(service.getTopicDetail(slug)).rejects.toThrow(NotFoundException);
  });
});
