import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { ActionRepository } from './action.repository';
const action = {
  id: 1,
  slug: 'call-your-representative',
  title: 'Call Your Representative',
  summary: 'A short action summary.',
  description: 'A longer action description.',
  actionType: 'CONTACT',
  status: 'PUBLISHED',
  createdAt: new Date(),
  updatedAt: new Date(),
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
    repoMock.findPublishedBySlug.mockResolvedValue(action);

    const slug = 'test';
    const ret = await service.getPublishedActionDetail(slug);

    expect(ret).toEqual(action);
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
});
