import { Injectable, NotFoundException } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import { ArticleService } from '../article/article.service';
import { ActionService } from '../action/action.service';
import { TopicListResponse, TopicDetailResponse } from './topic.types';
import { Topic } from '@prisma/client';

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
      items: topics.map((topic) => ({
        id: topic.id,
        slug: topic.slug,
        name: topic.name,
        description: topic.description,
      })),
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

    const formattedArticles = articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      publishedAt: article.publishedAt.toISOString(),
    }));

    const formattedActions = actions.map((action) => ({
      id: action.id,
      slug: action.slug,
      title: action.title,
      summary: action.summary,
      actionType: action.actionType,
    }));

    return {
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
      articles: formattedArticles,
      actions: formattedActions,
    };
  }

  getTopicsForArticle(articleId: number): Promise<Topic[]> {
    return this.repository.findByArticleSlug(articleId);
  }
}
