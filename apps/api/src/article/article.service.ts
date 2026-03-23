import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { Article } from '@prisma/client';
import type { ArticleDetailResponse, ArticleListResponse } from './article.types';
import type { ArticleDetailRecord } from './article.repository.types';

@Injectable()
export class ArticleService {
  constructor(private repository: ArticleRepository) {}

  private requirePublishedAt(publishedAt: Date | null): Date {
    if (!publishedAt) {
      throw new Error('Published article is missing publishedAt');
    }

    return publishedAt;
  }

  async getPublishedArticleList(): Promise<ArticleListResponse> {
    const articles = await this.repository.findPublished();
    return {
      items: articles.map((article) => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        publishedAt: this.requirePublishedAt(article.publishedAt).toISOString(),
      })),
    };
  }
  getArticleDetail(slug: string): Promise<Article | null> {
    return this.repository.findBySlug(slug);
  }

  async getPublishedArticleDetail(slug: string): Promise<ArticleDetailResponse> {
    const article = await this.repository.findPublishedBySlug(slug);
    if (!article) {
      throw new NotFoundException(`No published article found with slug ${slug}`);
    }

    return this.toArticleDetailResponse(article);
  }

  getArticlesForTopic(topicSlug: string): Promise<Article[]> {
    return this.repository.findPublishedByTopicSlug(topicSlug);
  }

  getArticlesForAction(actionId: number): Promise<Article[]> {
    return this.repository.findPublishedByActionId(actionId);
  }

  private toArticleDetailResponse(article: ArticleDetailRecord): ArticleDetailResponse {
    const topics = article.topicArticles.map(({ topic }) => ({
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
    }));

    const actions = article.articleActions.map(({ action }) => ({
      id: action.id,
      slug: action.slug,
      title: action.title,
      summary: action.summary,
      actionType: action.actionType,
      publishedAt: this.requirePublishedAt(action.publishedAt).toISOString(),
    }));

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      author: article.author,
      content: article.content,
      publishedAt: this.requirePublishedAt(article.publishedAt).toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      topics,
      actions,
    };
  }
}
