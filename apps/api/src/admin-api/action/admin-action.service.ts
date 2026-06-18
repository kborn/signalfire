import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityStatus } from '@prisma/client';
import {
  AdminActionDetailResponse,
  AdminActionListResponse,
  AdminActionRequest,
  AdminActionSummary,
} from '@signal-fire/api-contracts';
import { ActionRepository, type ActionWithTopics } from '../../action/action.repository';
import {
  CreateAdminActionRepositoryInput,
  UpdateAdminActionRepositoryInput,
} from './admin-action.repository.type';
import { TopicRepository } from '../../topic/topic.repository';
import { titleToSlug } from '../../common/title-to-slug';
import { getTopicIdsBySlug } from '../../common/topic-ids';

@Injectable()
export class AdminActionService {
  constructor(
    private readonly repository: ActionRepository,
    private readonly topicRepository: TopicRepository,
  ) {}

  async getAdminActionList(status?: EntityStatus | null): Promise<AdminActionListResponse> {
    const actions = await this.repository.findActionsWithTopics(status, [
      { updatedAt: 'desc' },
      { id: 'asc' },
    ]);

    return { items: actions.map((action) => this.toAdminActionSummary(action)) };
  }

  async getAdminActionDetail(
    slug: string,
    status?: EntityStatus | null,
  ): Promise<AdminActionDetailResponse> {
    const action = await this.repository.findBySlugWithTopics(slug, status);
    if (!action) {
      throw new NotFoundException(`No action found with slug ${slug}${this.statusSuffix(status)}`);
    }
    return this.toAdminActionDetailResponse(action);
  }

  async create(reqBody: AdminActionRequest): Promise<AdminActionDetailResponse> {
    const action = await this.repository.create(await this.mapCreateActionRequest(reqBody));
    return this.toAdminActionDetailResponse(action);
  }

  async update(slug: string, reqBody: AdminActionRequest): Promise<AdminActionDetailResponse> {
    const action = await this.repository.update(slug, await this.mapUpdateActionRequest(reqBody));
    return this.toAdminActionDetailResponse(action);
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

  private toAdminActionDetailResponse(action: ActionWithTopics): AdminActionDetailResponse {
    return { ...this.toAdminActionSummary(action), description: action.description };
  }

  private async getTopicIds(slugs: string[]): Promise<number[]> {
    return getTopicIdsBySlug(this.topicRepository, slugs);
  }

  private async mapCreateActionRequest(
    reqBody: AdminActionRequest,
  ): Promise<CreateAdminActionRepositoryInput> {
    const slug = titleToSlug(reqBody.title);
    if (!slug) {
      throw new BadRequestException('Title must produce a valid slug');
    }

    return {
      title: reqBody.title,
      slug,
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
}
