import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { ActionRepository } from './action.repository';
import { NotFoundException } from '@nestjs/common';
import {
  buildActionDetailRecord,
  buildActionDetailResponse,
  buildActionEntity,
} from './action.test-fixtures';

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
