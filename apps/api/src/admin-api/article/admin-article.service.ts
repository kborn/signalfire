import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityStatus } from '@prisma/client';
import {
  AdminArticleDetailResponse,
  AdminArticleListResponse,
  AdminArticleRequest,
  AdminArticleSummary,
} from '@signal-fire/api-contracts';
import {
  CreateAdminArticleRepositoryInput,
  UpdateAdminArticleRepositoryInput,
} from './admin-article.repository.type';
import { ArticleRepository, type ArticleWithTopics } from '../../article/article.repository';
import { TopicRepository } from '../../topic/topic.repository';
import { titleToSlug } from '../../common/title-to-slug';
import { getTopicIdsBySlug } from '../../common/topic-ids';

@Injectable()
export class AdminArticleService {
  constructor(
    private readonly repository: ArticleRepository,
    private readonly topicRepository: TopicRepository,
  ) {}

  async getAdminArticleList(status?: EntityStatus | null): Promise<AdminArticleListResponse> {
    const articles = await this.repository.findArticlesWithTopics(status, [
      { updatedAt: 'desc' },
      { id: 'asc' },
    ]);

    return { items: articles.map((article) => this.toAdminArticleSummary(article)) };
  }

  async getAdminArticleDetail(
    slug: string,
    status?: EntityStatus | null,
  ): Promise<AdminArticleDetailResponse> {
    const article = await this.repository.findBySlugWithTopics(slug, status);
    if (!article) {
      throw new NotFoundException(`No article found with slug ${slug}${this.statusSuffix(status)}`);
    }
    return this.toAdminArticleDetailResponse(article);
  }

  async create(reqBody: AdminArticleRequest): Promise<AdminArticleDetailResponse> {
    const article = await this.repository.create(await this.mapCreateArticleRequest(reqBody));
    return this.toAdminArticleDetailResponse(article);
  }

  async update(slug: string, reqBody: AdminArticleRequest): Promise<AdminArticleDetailResponse> {
    const article = await this.repository.update(slug, await this.mapUpdateArticleRequest(reqBody));
    return this.toAdminArticleDetailResponse(article);
  }

  private statusSuffix(status?: EntityStatus | null): string {
    return status ? ` and status ${status}` : '';
  }

  private toAdminArticleSummary(article: ArticleWithTopics): AdminArticleSummary {
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      status: article.status,
      author: article.author,
      updatedAt: article.updatedAt.toISOString(),
      publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
      topicSlugs: article.topicArticles.map((item) => item.topic.slug),
    };
  }

  private toAdminArticleDetailResponse(article: ArticleWithTopics): AdminArticleDetailResponse {
    return { ...this.toAdminArticleSummary(article), content: article.content };
  }

  private async getTopicIds(slugs: string[]): Promise<number[]> {
    return getTopicIdsBySlug(this.topicRepository, slugs);
  }

  private async mapCreateArticleRequest(
    reqBody: AdminArticleRequest,
  ): Promise<CreateAdminArticleRepositoryInput> {
    const slug = titleToSlug(reqBody.title);
    if (!slug) {
      throw new BadRequestException('Title must produce a valid slug');
    }

    return {
      title: reqBody.title,
      slug,
      summary: reqBody.summary,
      content: reqBody.content,
      author: reqBody.author,
      status: reqBody.status,
      publishedAt: reqBody.status === EntityStatus.PUBLISHED ? new Date() : null,
      topicIds: await this.getTopicIds(reqBody.topicSlugs),
    };
  }

  private async mapUpdateArticleRequest(
    reqBody: AdminArticleRequest,
  ): Promise<UpdateAdminArticleRepositoryInput> {
    return {
      title: reqBody.title,
      summary: reqBody.summary,
      content: reqBody.content,
      author: reqBody.author,
      status: reqBody.status,
      topicIds: await this.getTopicIds(reqBody.topicSlugs),
    };
  }
}
