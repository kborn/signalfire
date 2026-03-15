import { Injectable } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import { Topic } from '@prisma/client';

@Injectable()
export class TopicService {
  constructor(private repository: TopicRepository) {}

  getTopics(): Promise<Topic[]> {
    return this.repository.findAll();
  }

  getTopicDetail(slug: string): Promise<Topic | null> {
    return this.repository.findBySlug(slug);
  }
}
