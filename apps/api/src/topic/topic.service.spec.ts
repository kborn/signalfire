import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from './topic.service';
import { TopicRepository } from './topic.repository';

const topic = {
  id: 1,
  slug: 'democracy',
  name: 'Democracy',
  description: 'desc',
  createdAt: new Date(),
};

describe('TopicService', () => {
  let service: TopicService;
  const repoMock = { findAll: jest.fn(), findBySlug: jest.fn() };

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

    expect(ret).toEqual([topic]);
    expect(repoMock.findAll).toHaveBeenCalled();
  });

  it('getTopicDetail', async () => {
    repoMock.findBySlug.mockResolvedValue(topic);

    const slug = 'test';
    const ret = await service.getTopicDetail(slug);

    expect(ret).toEqual(topic);
    expect(repoMock.findBySlug).toHaveBeenCalledWith(slug);
  });
});
