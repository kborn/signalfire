import { EventService } from './event.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EventRepository } from './event.repository';
import { ArticleRepository } from '../article/article.repository';
import { ActionRepository } from '../action/action.repository';
import { TopicRepository } from '../topic/topic.repository';
import { ARTICLE_TEST_DATE } from '../article/article.test-fixtures';
import { ActionType, EntityStatus } from '@prisma/client';
import { ACTION_TEST_DATE } from '../action/action.test-fixtures';
import {
  buildEntityDetailResponse,
  buildEventEntity,
  buildEventListResponse,
} from './event.test-fixtures';

describe('EventService', () => {
  let service: EventService;
  const repoMock = {
    getById: jest.fn(),
    getPublishedById: jest.fn(),
    findPublished: jest.fn(),
    findByArticleId: jest.fn(),
    findByActionId: jest.fn(),
  };

  const topicRepoMock = {
    findByEventId: jest.fn(),
  };

  const articleRepoMock = {
    findPublishedByEventId: jest.fn(),
  };

  const actionRepoMock = {
    findPublishedByEventId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: EventRepository, useValue: repoMock },
        { provide: TopicRepository, useValue: topicRepoMock },
        { provide: ArticleRepository, useValue: articleRepoMock },
        { provide: ActionRepository, useValue: actionRepoMock },
      ],
    }).compile();
    service = module.get(EventService);
  });

  it('getEventDetail', async () => {
    const event = buildEventEntity();
    repoMock.getById.mockResolvedValue(event);

    const id = 1;
    const ret = await service.getEventDetail(id);

    expect(ret).toEqual(event);
    expect(repoMock.getById).toHaveBeenCalledWith(id);
  });

  it('getPublishedEventList', async () => {
    const event = buildEventEntity();
    repoMock.findPublished.mockResolvedValue([event]);

    const startDate = new Date('2025-12-17T00:00:00.000Z');
    const endDate = new Date('2025-12-18T00:00:00.000Z');

    const ret = await service.getPublishedEventList({
      startDate,
      endDate,
      topicSlug: 'democracy',
      page: 1,
      pageSize: 10,
    });

    expect(ret).toEqual(buildEventListResponse());
    expect(repoMock.findPublished).toHaveBeenCalledWith({
      startDate: new Date('2025-12-17T00:00:00.000Z'),
      endDate: new Date('2025-12-18T00:00:00.000Z'),
      topicSlug: 'democracy',
      page: 1,
      pageSize: 10,
    });
  });

  it('getPublishedEventDetail', async () => {
    const event = buildEventEntity();
    repoMock.getPublishedById.mockResolvedValue(event);
    topicRepoMock.findByEventId.mockResolvedValue([
      {
        id: 1,
        slug: 'democracy',
        name: 'Democracy',
        description: 'desc',
        createdAt: ARTICLE_TEST_DATE,
      },
    ]);
    actionRepoMock.findPublishedByEventId.mockResolvedValue([
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
    articleRepoMock.findPublishedByEventId.mockResolvedValue([
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
    const id = 1;
    const ret = await service.getPublishedEventDetail(id);

    expect(ret).toEqual(buildEntityDetailResponse());
    expect(repoMock.getPublishedById).toHaveBeenCalledWith(id);
    expect(topicRepoMock.findByEventId).toHaveBeenCalledWith(1);
    expect(actionRepoMock.findPublishedByEventId).toHaveBeenCalledWith(1);
    expect(articleRepoMock.findPublishedByEventId).toHaveBeenCalledWith(1);
  });

  it('getEventsByArticle', async () => {
    const event = buildEventEntity();
    repoMock.findByArticleId.mockResolvedValue([event]);

    const id = 1;
    const ret = await service.getEventsByArticle(id);

    expect(ret).toEqual([event]);
    expect(repoMock.findByArticleId).toHaveBeenCalledWith(id);
  });

  it('getEventsByAction', async () => {
    const event = buildEventEntity();
    repoMock.findByActionId.mockResolvedValue([event]);

    const id = 1;
    const ret = await service.getEventsByAction(id);

    expect(ret).toEqual([event]);
    expect(repoMock.findByActionId).toHaveBeenCalledWith(id);
  });
});
