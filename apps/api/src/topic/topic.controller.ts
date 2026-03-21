import { Controller, Get, Param } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicDetailResponse, TopicListResponse } from './topic.types';

@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  @Get()
  async findTopics(): Promise<TopicListResponse> {
    return this.topicService.getTopics();
  }

  @Get('/:slug')
  async findTopic(@Param('slug') slug: string): Promise<TopicDetailResponse> {
    return this.topicService.getTopicDetail(slug);
  }
}
