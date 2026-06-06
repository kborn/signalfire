import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ArticleRepository, type ArticleWithTopics } from './article.repository';
import { Article, EntityStatus } from '@prisma/client';
import {
  AdminArticleSummary,
  AdminArticleDetailResponse,
  AdminArticleListResponse,
  AdminArticleRequest,
  ArticleDetailResponse,
  ArticleListResponse,
} from '@signal-fire/api-contracts';
import { TopicRepository } from '../topic/topic.repository';
import { ActionRepository } from '../action/action.repository';
import {
  requirePublishedAt,
  toActionSummary,
  toArticleSummary,
  toTopicSummary,
} from '../common/public-content.mapper';
import {
  CreateAdminArticleRepositoryInput,
  UpdateAdminArticleRepositoryInput,
} from './admin-article.repository.type';
import { UnknownSubmissionTopicsError } from '../submission/submission.error';

@Injectable()
export class ArticleService {
  constructor(
    private repository: ArticleRepository,
    private topicRepository: TopicRepository,
    private actionRepository: ActionRepository,
  ) {}

  async getArticleList(status?: EntityStatus | null): Promise<ArticleListResponse> {
    if (status == null) {
      status = EntityStatus.PUBLISHED;
    }
    const articles = await this.repository.findArticles(status, [
      { publishedAt: 'desc' },
      { id: 'asc' },
    ]);
    return {
      items: articles.map(toArticleSummary),
    };
  }

  async getArticleDetail(
    slug: string,
    status?: EntityStatus | null,
  ): Promise<ArticleDetailResponse> {
    if (status == null) {
      status = EntityStatus.PUBLISHED;
    }

    const article = await this.repository.findBySlugAndStatus(slug, status);
    if (!article) {
      throw new NotFoundException(`No article found with slug ${slug}${this.statusSuffix(status)}`);
    }

    const [topics, actions] = await Promise.all([
      this.topicRepository.findByArticleId(article.id),
      this.actionRepository.findPublishedByArticleId(article.id),
    ]);

    return this.toArticleDetailResponse(article, topics, actions);
  }

  async getAdminArticleList(status?: EntityStatus | null): Promise<AdminArticleListResponse> {
    const articles = await this.repository.findArticlesWithTopics(status, [
      { updatedAt: 'desc' },
      { id: 'asc' },
    ]);

    return {
      items: articles.map((article) => this.toAdminArticleSummary(article)),
    };
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
    return {
      ...this.toAdminArticleSummary(article),
      content: article.content,
    };
  }

  private titleToSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async getTopicIds(slugs: string[]): Promise<number[]> {
    const recs: { id: number; slug: string }[] = await this.topicRepository.findIdsBySlugs(slugs);
    const foundSlugs = new Set(recs.map((rec) => rec.slug));
    const unknownSlugs = slugs.filter((slug) => !foundSlugs.has(slug));

    if (unknownSlugs.length) {
      throw new UnknownSubmissionTopicsError(unknownSlugs);
    }

    return recs.map((rec) => rec.id);
  }

  private async mapCreateArticleRequest(
    reqBody: AdminArticleRequest,
  ): Promise<CreateAdminArticleRepositoryInput> {
    const slug = this.titleToSlug(reqBody.title);
    if (!slug) {
      throw new BadRequestException('Title must produce a valid slug');
    }

    return {
      title: reqBody.title,
      slug: slug,
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

  async create(reqBody: AdminArticleRequest): Promise<AdminArticleDetailResponse> {
    const article = await this.repository.create(await this.mapCreateArticleRequest(reqBody));
    return this.toAdminArticleDetailResponse(article);
  }

  async update(slug: string, reqBody: AdminArticleRequest): Promise<AdminArticleDetailResponse> {
    const article = await this.repository.update(slug, await this.mapUpdateArticleRequest(reqBody));
    return this.toAdminArticleDetailResponse(article);
  }
}
