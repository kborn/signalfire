import { Test, TestingModule } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { NotFoundException } from '@nestjs/common';

const topic_democracy = {
  id: 1,
  slug: 'democracy',
  name: 'Democracy',
  description: 'desc',
  createdAt: new Date(),
};

const topic_climate = {
  id: 1,
  slug: 'climate',
  name: 'Climate',
  description: 'desc',
  createdAt: new Date(),
};

describe('TopicController', () => {
  let articleController: TopicController;
  const serviceMock = {
    getTopics: jest.fn(),
    getTopicDetail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [{ provide: TopicService, useValue: serviceMock }],
    }).compile();

    articleController = app.get<TopicController>(TopicController);
  });

  it('findTopic', async () => {
    serviceMock.getTopicDetail.mockResolvedValue(topic_democracy);
    const slug = 'test';
    const ret = await articleController.findTopic(slug);
    expect(ret).toEqual(topic_democracy);
    expect(serviceMock.getTopicDetail).toHaveBeenCalledWith(slug);
  });

  it('findTopicNotFound', async () => {
    serviceMock.getTopicDetail.mockResolvedValue(null);

    const slug = 'test';
    await expect(articleController.findTopic(slug)).rejects.toThrow(NotFoundException);
  });

  it('findTopics', async () => {
    serviceMock.getTopics.mockResolvedValue([topic_democracy, topic_climate]);

    const ret = await articleController.findTopics();
    const slugs = ret.map((ret) => ret.slug);
    expect(slugs).toEqual(expect.arrayContaining([topic_democracy.slug, topic_climate.slug]));
    expect(serviceMock.getTopics).toHaveBeenCalled();
  });
});
