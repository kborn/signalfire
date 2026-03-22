import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { Article } from '@prisma/client';
import { ArticleDetailResponse } from './article.types';
import { TopicService } from '../topic/topic.service';
import { ActionService } from '../action/action.service';

@Injectable()
export class ArticleService {
  constructor(
    private repository: ArticleRepository,
    private topicService: TopicService,
    private actionService: ActionService,
  ) {}

  getArticleDetail(slug: string): Promise<Article | null> {
    return this.repository.findBySlug(slug);
  }

  async getPublishedArticleDetail(slug: string): Promise<ArticleDetailResponse> {
    const article = await this.repository.findPublishedBySlug(slug);
    if (!article) {
      throw new NotFoundException(`No published article found with slug ${slug}`);
    }

    const [topics, actions] = await Promise.all([
      this.topicService.getTopicsForArticle(article.id),
      this.actionService.getActionsForArticle(article.id),
    ]);

    const formattedTopics = topics.map((topic) => ({
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
    }));

    const formattedActions = actions.map((action) => ({
      id: action.id,
      slug: action.slug,
      title: action.title,
      summary: action.summary,
      actionType: action.actionType,
    }));

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      content: article.content,
      publishedAt: article.publishedAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      topics: formattedTopics,
      actions: formattedActions,
    };
  }

  getArticlesForTopic(topicSlug: string): Promise<Article[]> {
    return this.repository.findPublishedByTopicSlug(topicSlug);
  }

  getArticlesForAction(actionId: number): Promise<Article[]> {
    return this.repository.findPublishedByActionId(actionId);
  }
}
