import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ActionRepository, type ActionWithTopics } from './action.repository';
import { Action, EntityStatus } from '@prisma/client';
import {
  AdminActionDetailResponse,
  AdminActionListResponse,
  AdminActionSummary,
  ActionDetailResponse,
  ActionListResponse,
  AdminActionRequest,
} from '@signal-fire/api-contracts';
import { TopicRepository } from '../topic/topic.repository';
import { ArticleRepository } from '../article/article.repository';
import {
  requirePublishedAt,
  toActionSummary,
  toArticleSummary,
  toTopicSummary,
} from '../common/public-content.mapper';
import {
  CreateAdminActionRepositoryInput,
  UpdateAdminActionRepositoryInput,
} from './admin-action.repository.type';
import { UnknownSubmissionTopicsError } from '../submission/submission.error';

@Injectable()
export class ActionService {
  constructor(
    private repository: ActionRepository,
    private topicRepository: TopicRepository,
    private articleRepository: ArticleRepository,
  ) {}

  async getActionList(status?: EntityStatus | null): Promise<ActionListResponse> {
    if (status == null) {
      status = EntityStatus.PUBLISHED;
    }

    const actions = await this.repository.findActions(status, [
      { publishedAt: 'desc' },
      { id: 'asc' },
    ]);

    return {
      items: actions.map(toActionSummary),
    };
  }

  async getActionDetail(slug: string, status?: EntityStatus | null): Promise<ActionDetailResponse> {
    if (status == null) {
      status = EntityStatus.PUBLISHED;
    }

    const action = await this.repository.findBySlugAndStatus(slug, status);
    if (!action) {
      throw new NotFoundException(`No action found with slug ${slug}${this.statusSuffix(status)}`);
    }
    const [topics, articles] = await Promise.all([
      this.topicRepository.findByActionId(action.id),
      this.articleRepository.findPublishedByActionId(action.id),
    ]);
    return this.toActionDetailResponse(action, topics, articles);
  }

  async getAdminActionList(status?: EntityStatus | null): Promise<AdminActionListResponse> {
    const actions = await this.repository.findActionsWithTopics(status, [
      { updatedAt: 'desc' },
      { id: 'asc' },
    ]);

    return {
      items: actions.map((action) => this.toAdminActionSummary(action)),
    };
  }

  async getAdminActionDetail(
    slug: string,
    status?: EntityStatus | null,
  ): Promise<AdminActionDetailResponse> {
    const action = await this.repository.findBySlugWithTopics(slug, status);
    if (!action) {
      throw new NotFoundException(`No action found with slug ${slug}${this.statusSuffix(status)}`);
    }
    const [topics, articles] = await Promise.all([
      this.topicRepository.findByActionId(action.id),
      this.articleRepository.findPublishedByActionId(action.id),
    ]);
    return this.toAdminActionDetailResponse(action, topics, articles);
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

  private statusSuffix(status?: EntityStatus | null): string {
    return status ? ` and status ${status}` : '';
  }

  private toAdminActionSummary(action: ActionWithTopics): AdminActionSummary {
    return {
      id: action.id,
      slug: action.slug,
      title: action.title,
      summary: action.summary,
      actionType: action.actionType,
      status: action.status,
      updatedAt: action.updatedAt.toISOString(),
      publishedAt: action.publishedAt ? action.publishedAt.toISOString() : null,
      topicSlugs: action.topicActions.map((item) => item.topic.slug),
    };
  }

  private toAdminActionDetailResponse(
    action: ActionWithTopics,
    topics: Awaited<ReturnType<TopicRepository['findByActionId']>>,
    articles: Awaited<ReturnType<ArticleRepository['findPublishedByActionId']>>,
  ): AdminActionDetailResponse {
    return {
      ...this.toAdminActionSummary(action),
      description: action.description,
      topics: topics.map(toTopicSummary),
      articles: articles.map(toArticleSummary),
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

  private async mapCreateActionRequest(
    reqBody: AdminActionRequest,
  ): Promise<CreateAdminActionRepositoryInput> {
    const slug = this.titleToSlug(reqBody.title);
    if (!slug) {
      throw new BadRequestException('Title must produce a valid slug');
    }

    return {
      title: reqBody.title,
      slug: slug,
      summary: reqBody.summary,
      description: reqBody.description,
      actionType: reqBody.actionType,
      status: reqBody.status,
      publishedAt: reqBody.status === EntityStatus.PUBLISHED ? new Date() : null,
      topicIds: await this.getTopicIds(reqBody.topicSlugs),
    };
  }

  private async mapUpdateActionRequest(
    reqBody: AdminActionRequest,
  ): Promise<UpdateAdminActionRepositoryInput> {
    return {
      title: reqBody.title,
      summary: reqBody.summary,
      description: reqBody.description,
      actionType: reqBody.actionType,
      status: reqBody.status,
      topicIds: await this.getTopicIds(reqBody.topicSlugs),
    };
  }

  async create(reqBody: AdminActionRequest): Promise<AdminActionDetailResponse> {
    const action = await this.repository.create(await this.mapCreateActionRequest(reqBody));
    const [topics, articles] = await Promise.all([
      this.topicRepository.findByActionId(action.id),
      this.articleRepository.findPublishedByActionId(action.id),
    ]);
    return this.toAdminActionDetailResponse(action, topics, articles);
  }

  async update(slug: string, reqBody: AdminActionRequest): Promise<AdminActionDetailResponse> {
    const action = await this.repository.update(slug, await this.mapUpdateActionRequest(reqBody));
    const [topics, articles] = await Promise.all([
      this.topicRepository.findByActionId(action.id),
      this.articleRepository.findPublishedByActionId(action.id),
    ]);
    return this.toAdminActionDetailResponse(action, topics, articles);
  }
}
