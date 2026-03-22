import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { ActionRepository } from './action.repository';
import { NotFoundException } from '@nestjs/common';

const date = new Date('2025-12-17T03:24:00');
const action = {
  id: 1,
  slug: 'call-your-representative',
  title: 'Call Your Representative',
  summary: 'A short action summary.',
  description: 'A longer action description.',
  actionType: 'CONTACT',
  status: 'PUBLISHED',
  createdAt: date,
  updatedAt: date,
};

const publishedActionDetail = {
  ...action,
  topicActions: [
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
      article: {
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
      },
    },
  ],
};

describe('ActionService', () => {
  let service: ActionService;
  const repoMock = {
    findBySlug: jest.fn(),
    findPublishedBySlug: jest.fn(),
    findPublishedByTopicSlug: jest.fn(),
    findPublishedByArticleId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionService, { provide: ActionRepository, useValue: repoMock }],
    }).compile();
    service = module.get(ActionService);
  });

  it('getActionDetail', async () => {
    repoMock.findBySlug.mockResolvedValue(action);

    const slug = 'test';
    const ret = await service.getActionDetail(slug);

    expect(ret).toEqual(action);
    expect(repoMock.findBySlug).toHaveBeenCalledWith(slug);
  });

  it('getPublishedActionDetail', async () => {
    repoMock.findPublishedBySlug.mockResolvedValue(publishedActionDetail);

    const slug = 'test';
    const ret = await service.getPublishedActionDetail(slug);

    expect(ret).toEqual({
      id: 1,
      slug: 'call-your-representative',
      title: 'Call Your Representative',
      summary: 'A short action summary.',
      description: 'A longer action description.',
      actionType: 'CONTACT',
      updatedAt: date.toISOString(),
      topics: [{ id: 1, slug: 'democracy', name: 'Democracy', description: 'desc' }],
      articles: [
        {
          id: 1,
          slug: 'protect-voting-rights',
          title: 'Protect Voting Rights',
          summary: 'A short article summary.',
          publishedAt: date.toISOString(),
        },
      ],
    });

    expect(repoMock.findPublishedBySlug).toHaveBeenCalledWith(slug);
  });

  it('getActionsForTopic', async () => {
    repoMock.findPublishedByTopicSlug.mockResolvedValue([action]);

    const slug = 'test';
    const ret = await service.getActionsForTopic(slug);

    expect(ret).toEqual([action]);
    expect(repoMock.findPublishedByTopicSlug).toHaveBeenCalledWith(slug);
  });

  it('getActionsForArticle', async () => {
    repoMock.findPublishedByArticleId.mockResolvedValue([action]);

    const id = 1;
    const ret = await service.getActionsForArticle(id);

    expect(ret).toEqual([action]);
    expect(repoMock.findPublishedByArticleId).toHaveBeenCalledWith(id);
  });

  it('getPublishedActionDetailNotFound', async () => {
    repoMock.findPublishedBySlug.mockResolvedValue(null);

    await expect(service.getPublishedActionDetail('missing')).rejects.toThrow(NotFoundException);
  });
});
