import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionRepository } from './action.repository';
import { Action } from '@prisma/client';
import type { ActionDetailResponse, ActionListResponse } from './action.types';
import type { ActionDetailRecord } from './action.repository.types';

@Injectable()
export class ActionService {
  constructor(private repository: ActionRepository) {}

  async getPublishedActionList(): Promise<ActionListResponse> {
    const actions = await this.repository.findPublished();
    return {
      items: actions.map((action) => ({
        id: action.id,
        slug: action.slug,
        title: action.title,
        summary: action.summary,
        actionType: action.actionType,
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
    return this.toActionDetailResponse(action);
  }

  getActionsForTopic(topicSlug: string): Promise<Action[]> {
    return this.repository.findPublishedByTopicSlug(topicSlug);
  }

  getActionsForArticle(articleId: number): Promise<Action[]> {
    return this.repository.findPublishedByArticleId(articleId);
  }

  private toActionDetailResponse(action: ActionDetailRecord): ActionDetailResponse {
    const topics = action.topicActions.map(({ topic }) => ({
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
    }));

    const articles = action.articleActions.map(({ article }) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      publishedAt: article.publishedAt.toISOString(),
    }));

    return {
      id: action.id,
      slug: action.slug,
      title: action.title,
      summary: action.summary,
      description: action.description,
      actionType: action.actionType,
      updatedAt: action.updatedAt.toISOString(),
      topics,
      articles,
    };
  }
}
