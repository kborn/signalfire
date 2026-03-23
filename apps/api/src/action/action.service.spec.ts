import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { ActionRepository } from './action.repository';
import { NotFoundException } from '@nestjs/common';
import {
  buildActionListResponse,
  buildActionDetailRecord,
  buildActionDetailResponse,
  buildActionEntity,
} from './action.test-fixtures';
import { ActionType } from '@prisma/client';

describe('ActionService', () => {
  let service: ActionService;
  const repoMock = {
    findBySlug: jest.fn(),
    findPublished: jest.fn(),
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

  it('getPublishedActionList', async () => {
    const action1 = buildActionEntity();
    const action2 = buildActionEntity({
      id: 2,
      slug: 'join-neighborhood-climate-coalition',
      title: 'Join A Neighborhood Climate Coalition',
      summary: 'Work with local residents on recurring climate pressure campaigns.',
      actionType: ActionType.VOLUNTEER,
    });
    repoMock.findPublished.mockResolvedValue([action1, action2]);

    const ret = await service.getPublishedActionList();

    expect(ret).toEqual(buildActionListResponse());
    expect(repoMock.findPublished).toHaveBeenCalled();
  });

  it('getActionDetail', async () => {
    const action = buildActionEntity();
    repoMock.findBySlug.mockResolvedValue(action);

    const slug = 'test';
    const ret = await service.getActionDetail(slug);

    expect(ret).toEqual(action);
    expect(repoMock.findBySlug).toHaveBeenCalledWith(slug);
  });

  it('getPublishedActionDetail', async () => {
    const publishedActionDetail = buildActionDetailRecord();
    repoMock.findPublishedBySlug.mockResolvedValue(publishedActionDetail);

    const slug = 'test';
    const ret = await service.getPublishedActionDetail(slug);

    expect(ret).toEqual(buildActionDetailResponse());

    expect(repoMock.findPublishedBySlug).toHaveBeenCalledWith(slug);
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

    await expect(service.getPublishedActionDetail('missing')).rejects.toThrow(NotFoundException);
  });
});
