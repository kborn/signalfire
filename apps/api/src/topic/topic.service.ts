import { Injectable, NotFoundException } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import { TopicDetailResponse, TopicListResponse } from '@signal-fire/api-contracts';
import { toActionSummary, toArticleSummary, toTopicSummary } from '../common/public-content.mapper';

@Injectable()
export class TopicService {
  constructor(private repository: TopicRepository) {}

  async getTopics(): Promise<TopicListResponse> {
    const topics = await this.repository.findAll();
    return {
      items: topics.map(toTopicSummary),
    };
  }

  async getTopicDetail(slug: string): Promise<TopicDetailResponse> {
    const result = await this.repository.findBySlugWithPublishedContent(slug);
    if (!result) {
      throw new NotFoundException(`No topic found with slug ${slug}`);
    }

    return {
      id: result.id,
      slug: result.slug,
      name: result.name,
      description: result.description,
      color: result.color ?? undefined,
      articles: result.topicArticles.map((ta) => toArticleSummary(ta.article)),
      actions: result.topicActions.map((ta) => toActionSummary(ta.action)),
    };
  }
}
