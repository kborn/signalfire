import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { ActionRepository } from './action.repository';
import { TopicRepository } from '../topic/topic.repository';
import { ArticleRepository } from '../article/article.repository';
import { NotFoundException } from '@nestjs/common';
import {
  ACTION_TEST_DATE,
  buildActionListResponse,
  buildActionDetailResponse,
  buildActionEntity,
} from './action.test-fixtures';
import { ActionType, EntityStatus } from '@prisma/client';

describe('ActionService', () => {
  let service: ActionService;
  const repoMock = {
    findPublished: jest.fn(),
    findPublishedBySlug: jest.fn(),
    findPublishedByTopicSlug: jest.fn(),
    findPublishedByArticleId: jest.fn(),
  };
  const topicRepoMock = {
    findByActionId: jest.fn(),
  };
  const articleRepoMock = {
    findPublishedByActionId: jest.fn(),
    findBySlug: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionService,
        { provide: ActionRepository, useValue: repoMock },
        { provide: TopicRepository, useValue: topicRepoMock },
        { provide: ArticleRepository, useValue: articleRepoMock },
      ],
    }).compile();
    service = module.get(ActionService);
  });

  it('getPublishedActionList', async () => {
    repoMock.findPublished.mockResolvedValue(
      buildActionListResponse({
        items: [
          {
            id: 1,
            slug: 'call-your-representative',
            title: 'Call Your Representative',
            summary: 'A short action summary.',
            actionType: ActionType.CONTACT,
            publishedAt: ACTION_TEST_DATE.toISOString(),
          },
          {
            id: 2,
            slug: 'join-neighborhood-climate-coalition',
            title: 'Join A Neighborhood Climate Coalition',
            summary: 'Work with local residents on recurring climate pressure campaigns.',
            actionType: ActionType.VOLUNTEER,
            publishedAt: new Date('2025-12-18T03:24:00.000Z').toISOString(),
          },
        ],
      }),
    );

    const ret = await service.getActionList({ page: 1, pageSize: 10 });

    expect(ret).toEqual(
      buildActionListResponse({
        items: [
          {
            id: 1,
            slug: 'call-your-representative',
            title: 'Call Your Representative',
            summary: 'A short action summary.',
            actionType: ActionType.CONTACT,
            publishedAt: ACTION_TEST_DATE.toISOString(),
          },
          {
            id: 2,
            slug: 'join-neighborhood-climate-coalition',
            title: 'Join A Neighborhood Climate Coalition',
            summary: 'Work with local residents on recurring climate pressure campaigns.',
            actionType: ActionType.VOLUNTEER,
            publishedAt: new Date('2025-12-18T03:24:00.000Z').toISOString(),
          },
        ],
      }),
    );
    expect(repoMock.findPublished).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
  });

  it('getPublishedActionList filters by topic slug when provided', async () => {
    const action = buildActionEntity();
    repoMock.findPublished.mockResolvedValue(
      buildActionListResponse({
        items: [
          {
            id: action.id,
            slug: action.slug,
            title: action.title,
            summary: action.summary,
            actionType: action.actionType,
            publishedAt: ACTION_TEST_DATE.toISOString(),
          },
        ],
      }),
    );

    const ret = await service.getActionList({ page: 1, pageSize: 10, topicSlug: 'democracy' });

    expect(ret).toEqual(
      buildActionListResponse({
        items: [
          {
            id: action.id,
            slug: action.slug,
            title: action.title,
            summary: action.summary,
            actionType: action.actionType,
            publishedAt: ACTION_TEST_DATE.toISOString(),
          },
        ],
      }),
    );
    expect(repoMock.findPublished).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      topicSlug: 'democracy',
    });
  });

  it('getActionDetail', async () => {
    const action = buildActionEntity();
    repoMock.findPublishedBySlug.mockResolvedValue(action);
    topicRepoMock.findByActionId.mockResolvedValue([
      {
        id: 1,
        slug: 'democracy',
        name: 'Democracy',
        description: 'desc',
        createdAt: ACTION_TEST_DATE,
      },
    ]);
    articleRepoMock.findPublishedByActionId.mockResolvedValue([
      {
        id: 1,
        slug: 'protect-voting-rights',
        title: 'Protect Voting Rights',
        summary: 'A short article summary.',
        content: 'Full article content.',
        status: EntityStatus.PUBLISHED,
        author: 'Find Your Fight Editorial',
        createdAt: ACTION_TEST_DATE,
        publishedAt: ACTION_TEST_DATE,
        updatedAt: ACTION_TEST_DATE,
      },
    ]);

    const slug = 'test';
    const ret = await service.getActionDetail(slug);

    expect(ret).toEqual(buildActionDetailResponse());
    expect(repoMock.findPublishedBySlug).toHaveBeenCalledWith(slug);
  });

  it('getPublishedActionDetail', async () => {
    const publishedAction = buildActionEntity();
    repoMock.findPublishedBySlug.mockResolvedValue(publishedAction);
    topicRepoMock.findByActionId.mockResolvedValue([
      {
        id: 1,
        slug: 'democracy',
        name: 'Democracy',
        description: 'desc',
        createdAt: ACTION_TEST_DATE,
      },
    ]);
    articleRepoMock.findPublishedByActionId.mockResolvedValue([
      {
        id: 1,
        slug: 'protect-voting-rights',
        title: 'Protect Voting Rights',
        summary: 'A short article summary.',
        content: 'Full article content.',
        status: EntityStatus.PUBLISHED,
        author: 'Find Your Fight Editorial',
        createdAt: ACTION_TEST_DATE,
        publishedAt: ACTION_TEST_DATE,
        updatedAt: ACTION_TEST_DATE,
      },
    ]);

    const slug = 'test';
    const ret = await service.getActionDetail(slug);

    expect(ret).toEqual(buildActionDetailResponse());

    expect(repoMock.findPublishedBySlug).toHaveBeenCalledWith(slug);
    expect(topicRepoMock.findByActionId).toHaveBeenCalledWith(1);
    expect(articleRepoMock.findPublishedByActionId).toHaveBeenCalledWith(1);
    expect(articleRepoMock.findBySlug).not.toHaveBeenCalled();
  });

  it('getPublishedActionDetail only includes related articles returned by the published lookup', async () => {
    const publishedAction = buildActionEntity();
    repoMock.findPublishedBySlug.mockResolvedValue(publishedAction);
    topicRepoMock.findByActionId.mockResolvedValue([
      {
        id: 1,
        slug: 'democracy',
        name: 'Democracy',
        description: 'desc',
        createdAt: ACTION_TEST_DATE,
      },
    ]);
    articleRepoMock.findPublishedByActionId.mockResolvedValue([
      {
        id: 2,
        slug: 'published-related-article',
        title: 'Published Related Article',
        summary: 'Published related article summary.',
        content: 'Published related article content.',
        status: EntityStatus.PUBLISHED,
        author: 'Find Your Fight Editorial',
        createdAt: ACTION_TEST_DATE,
        publishedAt: ACTION_TEST_DATE,
        updatedAt: ACTION_TEST_DATE,
      },
    ]);

    const ret = await service.getActionDetail('test');

    expect(ret.articles).toEqual([
      {
        id: 2,
        slug: 'published-related-article',
        title: 'Published Related Article',
        summary: 'Published related article summary.',
        publishedAt: ACTION_TEST_DATE.toISOString(),
      },
    ]);
  });

  it('getActionsForTopic', async () => {
    const action = buildActionEntity();
    repoMock.findPublishedByTopicSlug.mockResolvedValue([action]);

    const slug = 'test';
    const ret = await service.getActionsForTopic(slug);

    expect(ret).toEqual([action]);
    expect(repoMock.findPublishedByTopicSlug).toHaveBeenCalledWith(slug);
  });

  it('getActionsForArticle', async () => {
    const action = buildActionEntity();
    repoMock.findPublishedByArticleId.mockResolvedValue([action]);

    const id = 1;
    const ret = await service.getActionsForArticle(id);

    expect(ret).toEqual([action]);
    expect(repoMock.findPublishedByArticleId).toHaveBeenCalledWith(id);
  });

  it('getPublishedActionDetailNotFound', async () => {
    repoMock.findPublishedBySlug.mockResolvedValue(null);

    await expect(service.getActionDetail('missing')).rejects.toThrow(NotFoundException);
  });
});
