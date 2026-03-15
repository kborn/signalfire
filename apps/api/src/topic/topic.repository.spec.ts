import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TopicRepository } from './topic.repository';

const topic = {
  id: 1,
  slug: 'democracy',
  name: 'Democracy',
  description: 'desc',
  createdAt: new Date(),
};

describe('TopicRepository', () => {
  let repository: TopicRepository;
  const prismaMock = {
    topic: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TopicRepository, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    repository = module.get(TopicRepository);
  });

  it('getTopics', async () => {
    prismaMock.topic.findMany.mockResolvedValue([topic]);

    const ret = await repository.findAll();

    expect(ret).toEqual([topic]);
    expect(prismaMock.topic.findMany).toHaveBeenCalled();
  });

  it('getTopicDetail', async () => {
    prismaMock.topic.findUnique.mockResolvedValue(topic);

    const slug = 'test';
    const ret = await repository.findBySlug(slug);

    expect(ret).toEqual(topic);
    expect(prismaMock.topic.findUnique).toHaveBeenCalledWith({ where: { slug: slug } });
  });
});
