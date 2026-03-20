import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
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
    const topic = await this.topicService.getTopicDetail(slug);
    if (!topic) {
      throw new NotFoundException(`No topic found with slug ${slug}`);
    }
    return topic;
  }
}
