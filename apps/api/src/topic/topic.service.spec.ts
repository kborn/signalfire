import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from './topic.service';
import { TopicRepository } from './topic.repository';
import { NotFoundException } from '@nestjs/common';
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
  author: 'Find Your Fight Editorial',
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

const topicArticleJoin = {
  topicId: 1,
  articleId: 1,
  assignedAt: date,
  assignedBy: 'seed',
  article,
};
const topicActionJoin = { topicId: 1, actionId: 1, assignedAt: date, assignedBy: 'seed', action };

describe('TopicService', () => {
  let service: TopicService;
  const repoMock = {
    findAll: jest.fn(),
    findBySlugWithPublishedContent: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicService, { provide: TopicRepository, useValue: repoMock }],
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

  it('getTopics preserves repository ordering for deterministic topic responses', async () => {
    const laterTopic = {
      ...topic,
      id: 2,
      slug: 'climate',
      name: 'Climate',
    };
    repoMock.findAll.mockResolvedValue([topic, laterTopic]);

    const ret = await service.getTopics();

    expect(ret.items.map((item) => item.slug)).toEqual(['democracy', 'climate']);
  });

  it('getTopicDetail', async () => {
    repoMock.findBySlugWithPublishedContent.mockResolvedValue({
      ...topic,
      topicArticles: [topicArticleJoin],
      topicActions: [topicActionJoin],
    });

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
    expect(repoMock.findBySlugWithPublishedContent).toHaveBeenCalledWith(slug);
  });

  it('getTopicDetail preserves related-content ordering returned by published lookups', async () => {
    const secondArticle = {
      ...article,
      id: 2,
      slug: 'second-article',
      title: 'Second Article',
      summary: 'Second summary.',
    };
    const secondAction = {
      ...action,
      id: 2,
      slug: 'second-action',
      title: 'Second Action',
      summary: 'Second action summary.',
      actionType: ActionType.DONATE,
    };
    repoMock.findBySlugWithPublishedContent.mockResolvedValue({
      ...topic,
      topicArticles: [
        topicArticleJoin,
        { ...topicArticleJoin, articleId: 2, article: secondArticle },
      ],
      topicActions: [topicActionJoin, { ...topicActionJoin, actionId: 2, action: secondAction }],
    });

    const ret = await service.getTopicDetail('democracy');

    expect(ret.articles.map((item) => item.slug)).toEqual([
      'protect-voting-rights',
      'second-article',
    ]);
    expect(ret.actions.map((item) => item.slug)).toEqual([
      'call-your-representative',
      'second-action',
    ]);
  });

  it('findTopicNotFound', async () => {
    repoMock.findBySlugWithPublishedContent.mockResolvedValue(null);

    const slug = 'test';
    await expect(service.getTopicDetail(slug)).rejects.toThrow(NotFoundException);
  });
});
