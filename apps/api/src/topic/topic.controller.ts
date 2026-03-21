import { Controller, Get, Param } from '@nestjs/common';
import { TopicService } from './topic.service';

@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  @Get()
  async findTopics() {
    return this.topicService.getTopics();
  }

  @Get('/:slug')
  async findTopic(@Param('slug') slug: string) {
    return this.topicService.getTopicDetail(slug);
  }
}
