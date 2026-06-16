import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionRepository } from './action.repository';
import { Action } from '@prisma/client';
import { ActionDetailResponse, ActionListResponse } from '@signal-fire/api-contracts';
import { TopicRepository } from '../topic/topic.repository';
import { ArticleRepository } from '../article/article.repository';
import {
  requirePublishedAt,
  toArticleSummary,
  toTopicSummary,
} from '../common/public-content.mapper';
import type { ValidatedActionListQuery } from './action.type';

@Injectable()
export class ActionService {
  constructor(
    private repository: ActionRepository,
    private topicRepository: TopicRepository,
    private articleRepository: ArticleRepository,
  ) {}

  async getActionList(req: ValidatedActionListQuery): Promise<ActionListResponse> {
    return this.repository.findPublished(req);
  }

  async getActionDetail(slug: string): Promise<ActionDetailResponse> {
    const action = await this.repository.findPublishedBySlug(slug);
    if (!action) {
      throw new NotFoundException(`No published action found with slug ${slug}`);
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
