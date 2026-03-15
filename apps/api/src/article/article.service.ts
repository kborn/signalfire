import { Injectable } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { Article } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private repository: ArticleRepository) {}

  getArticleDetail(slug: string): Promise<Article | null> {
    return this.repository.findBySlug(slug);
  }

  getPublishedArticleDetail(slug: string): Promise<Article | null> {
    return this.repository.findPublishedBySlug(slug);
  }

  getArticlesForTopic(topicSlug: string): Promise<Article[]> {
    return this.repository.findPublishedByTopicSlug(topicSlug);
  }

  getArticlesForAction(actionId: number): Promise<Article[]> {
    return this.repository.findPublishedByActionId(actionId);
  }
}
