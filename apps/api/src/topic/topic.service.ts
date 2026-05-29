import { Injectable, NotFoundException } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import { ArticleService } from '../article/article.service';
import { ActionService } from '../action/action.service';
import { TopicDetailResponse, TopicListResponse } from '@signal-fire/api-contracts';
import { toActionSummary, toArticleSummary, toTopicSummary } from '../common/public-content.mapper';

@Injectable()
export class TopicService {
  constructor(
    private repository: TopicRepository,
    private actionService: ActionService,
    private articleService: ArticleService,
  ) {}

  async getTopics(): Promise<TopicListResponse> {
    const topics = await this.repository.findAll();
    return {
      items: topics.map(toTopicSummary),
    };
  }

  async getTopicDetail(slug: string): Promise<TopicDetailResponse> {
    const topic = await this.repository.findBySlug(slug);
    if (!topic) {
      throw new NotFoundException(`No topic found with slug ${slug}`);
    }

    const [articles, actions] = await Promise.all([
      this.articleService.getArticlesForTopic(slug),
      this.actionService.getActionsForTopic(slug),
    ]);

    return {
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
      articles: articles.map(toArticleSummary),
      actions: actions.map(toActionSummary),
    };
  }
}
