import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionRepository } from './action.repository';
import { Action } from '@prisma/client';
import type { ActionDetailResponse, ActionListResponse } from '@signal-fire/api-contracts';
import { TopicRepository } from '../topic/topic.repository';
import { ArticleRepository } from '../article/article.repository';

@Injectable()
export class ActionService {
  constructor(
    private repository: ActionRepository,
    private topicRepository: TopicRepository,
    private articleRepository: ArticleRepository,
  ) {}

  private requirePublishedAt(publishedAt: Date | null): Date {
    if (!publishedAt) {
      throw new Error('Published entity is missing publishedAt');
    }

    return publishedAt;
  }

  async getPublishedActionList(): Promise<ActionListResponse> {
    const actions = await this.repository.findPublished();
    return {
      items: actions.map((action) => ({
        id: action.id,
        slug: action.slug,
        title: action.title,
        summary: action.summary,
        actionType: action.actionType,
        publishedAt: this.requirePublishedAt(action.publishedAt).toISOString(),
      })),
    };
  }

  getActionDetail(slug: string): Promise<Action | null> {
    return this.repository.findBySlug(slug);
  }

  async getPublishedActionDetail(slug: string): Promise<ActionDetailResponse> {
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
    const topicSummaries = topics.map((topic) => ({
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
    }));

    const articleSummaries = articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      publishedAt: this.requirePublishedAt(article.publishedAt).toISOString(),
    }));

    return {
      id: action.id,
      slug: action.slug,
      title: action.title,
      summary: action.summary,
      description: action.description,
      actionType: action.actionType,
      updatedAt: action.updatedAt.toISOString(),
      publishedAt: this.requirePublishedAt(action.publishedAt).toISOString(),
      topics: topicSummaries,
      articles: articleSummaries,
    };
  }
}
