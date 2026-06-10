import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionRepository } from './action.repository';
import { Action, EntityStatus } from '@prisma/client';
import { ActionDetailResponse, ActionListResponse } from '@signal-fire/api-contracts';
import { TopicRepository } from '../topic/topic.repository';
import { ArticleRepository } from '../article/article.repository';
import {
  requirePublishedAt,
  toActionSummary,
  toArticleSummary,
  toTopicSummary,
} from '../common/public-content.mapper';

@Injectable()
export class ActionService {
  constructor(
    private repository: ActionRepository,
    private topicRepository: TopicRepository,
    private articleRepository: ArticleRepository,
  ) {}

  async getActionList(status?: EntityStatus | null): Promise<ActionListResponse> {
    const publishedStatus = status ?? EntityStatus.PUBLISHED;
    const actions = await this.repository.findActions(publishedStatus, [
      { publishedAt: 'desc' },
      { id: 'asc' },
    ]);

    return {
      items: actions.map(toActionSummary),
    };
  }

  async getActionDetail(slug: string, status?: EntityStatus | null): Promise<ActionDetailResponse> {
    const publishedStatus = status ?? EntityStatus.PUBLISHED;
    const action = await this.repository.findBySlugAndStatus(slug, publishedStatus);
    if (!action) {
      throw new NotFoundException(
        `No action found with slug ${slug} and status ${publishedStatus}`,
      );
    }
    const [topics, articles] = await Promise.all([
      this.topicRepository.findByActionId(action.id),
      this.articleRepository.findPublishedByActionId(action.id),
    ]);
    return this.toActionDetailResponse(action, topics, articles);
  }

  getActionsForTopic(topicSlug: string): Promise<Action[]> {
    return this.repository.findPublishedByTopicSlug(topicSlug);
  }

  getActionsForArticle(articleId: number): Promise<Action[]> {
    return this.repository.findPublishedByArticleId(articleId);
  }

  private toActionDetailResponse(
    action: Action,
    topics: Awaited<ReturnType<TopicRepository['findByActionId']>>,
    articles: Awaited<ReturnType<ArticleRepository['findPublishedByActionId']>>,
  ): ActionDetailResponse {
    return {
      id: action.id,
      slug: action.slug,
      title: action.title,
      summary: action.summary,
      description: action.description,
      actionType: action.actionType,
      updatedAt: action.updatedAt.toISOString(),
      publishedAt: requirePublishedAt(action.publishedAt).toISOString(),
      topics: topics.map(toTopicSummary),
      articles: articles.map(toArticleSummary),
    };
  }
}
