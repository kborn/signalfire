import { Test, TestingModule } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { NotFoundException } from '@nestjs/common';
import { buildTopicDetailResponse, buildTopicListResponse } from './topic.test-fixtures';

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
    const topicDetailResponse = buildTopicDetailResponse();
    topicServiceMock.getTopicDetail.mockResolvedValue(topicDetailResponse);
    const slug = 'test';
    const ret = await topicController.findTopic(slug);
    expect(ret).toEqual(topicDetailResponse);
    expect(topicServiceMock.getTopicDetail).toHaveBeenCalledWith(slug);
  });

  it('findTopics', async () => {
    const topicListResponse = buildTopicListResponse();
    topicServiceMock.getTopics.mockResolvedValue(topicListResponse);

    const ret = await topicController.findTopics();
    const slugs = ret.items.map((ret) => ret.slug);
    expect(slugs).toEqual(expect.arrayContaining(['democracy', 'climate']));
    expect(topicServiceMock.getTopics).toHaveBeenCalled();
  });

  it('findTopicNotFound', async () => {
    topicServiceMock.getTopicDetail.mockRejectedValue(new NotFoundException());

    const slug = 'test';
    await expect(topicController.findTopic(slug)).rejects.toThrow(NotFoundException);
  });
});
