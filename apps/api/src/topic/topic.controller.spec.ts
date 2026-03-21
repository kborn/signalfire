import { Test, TestingModule } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

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
  let topicController: TopicController;
  const topicServiceMock = {
    getTopics: jest.fn(),
    getTopicDetail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [{ provide: TopicService, useValue: topicServiceMock }],
    }).compile();

    topicController = app.get<TopicController>(TopicController);
  });

  it('findTopic', async () => {
    topicServiceMock.getTopicDetail.mockResolvedValue(topic_democracy);
    const slug = 'test';
    const ret = await topicController.findTopic(slug);
    expect(ret).toEqual(topic_democracy);
    expect(topicServiceMock.getTopicDetail).toHaveBeenCalledWith(slug);
  });

  it('findTopics', async () => {
    topicServiceMock.getTopics.mockResolvedValue({ items: [topic_democracy, topic_climate] });

    const ret = await topicController.findTopics();
    const slugs = ret.items.map((ret) => ret.slug);
    expect(slugs).toEqual(expect.arrayContaining([topic_democracy.slug, topic_climate.slug]));
    expect(topicServiceMock.getTopics).toHaveBeenCalled();
  });
});
