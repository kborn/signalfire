import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { Article } from '@prisma/client';
import { ArticleDetailResponse, ArticleListResponse } from '@signal-fire/api-contracts';
import { TopicRepository } from '../topic/topic.repository';
import { ActionRepository } from '../action/action.repository';
import {
  requirePublishedAt,
  toActionSummary,
  toArticleSummary,
  toTopicSummary,
} from '../common/public-content.mapper';

@Injectable()
export class ArticleService {
  constructor(
    private repository: ArticleRepository,
    private topicRepository: TopicRepository,
    private actionRepository: ActionRepository,
  ) {}

  async getArticleList(topicSlug?: string): Promise<ArticleListResponse> {
    const articles = await this.repository.findPublished(topicSlug);
    return {
      items: articles.map(toArticleSummary),
    };
  }

  async getArticleDetail(slug: string): Promise<ArticleDetailResponse> {
    const article = await this.repository.findPublishedBySlug(slug);
    if (!article) {
      throw new NotFoundException(`No published article found with slug ${slug}`);
    }

    const [topics, actions] = await Promise.all([
      this.topicRepository.findByArticleId(article.id),
      this.actionRepository.findPublishedByArticleId(article.id),
    ]);

    return this.toArticleDetailResponse(article, topics, actions);
  }

  getArticlesForTopic(topicSlug: string): Promise<Article[]> {
    return this.repository.findPublishedByTopicSlug(topicSlug);
  }

  getArticlesForAction(actionId: number): Promise<Article[]> {
    return this.repository.findPublishedByActionId(actionId);
  }

  private toArticleDetailResponse(
    article: Article,
    topics: Awaited<ReturnType<TopicRepository['findByArticleId']>>,
    actions: Awaited<ReturnType<ActionRepository['findPublishedByArticleId']>>,
  ): ArticleDetailResponse {
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      author: article.author,
      content: article.content,
      publishedAt: requirePublishedAt(article.publishedAt).toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      topics: topics.map(toTopicSummary),
      actions: actions.map(toActionSummary),
    };
  }
}
