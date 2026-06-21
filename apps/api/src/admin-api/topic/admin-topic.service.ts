import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TopicRepository } from '../../topic/topic.repository';
import {
  AdminTopicDetailResponse,
  AdminTopicListResponse,
  AdminTopicRequest,
  AdminTopicSummary,
} from '@signal-fire/api-contracts';
import { titleToSlug } from '../../common/title-to-slug';
import { Topic } from '@prisma/client';

type TopicWithCounts = Topic & {
  _count: { topicArticles: number; topicActions: number; topicEvents: number };
};

@Injectable()
export class AdminTopicService {
  constructor(private readonly repository: TopicRepository) {}

  async getAdminTopicList(): Promise<AdminTopicListResponse> {
    const topics = await this.repository.findAllWithCounts();
    return { items: topics.map(this.toAdminTopicSummary) };
  }

  async getAdminTopicDetail(slug: string): Promise<AdminTopicDetailResponse> {
    const topic = await this.repository.findBySlugWithCounts(slug);
    if (!topic) throw new NotFoundException(`No topic found with slug ${slug}`);
    return this.toAdminTopicSummary(topic);
  }

  async create(reqBody: AdminTopicRequest): Promise<AdminTopicDetailResponse> {
    const slug = titleToSlug(reqBody.name);
    if (!slug) throw new BadRequestException('Name must produce a valid slug');

    const existing = await this.repository.findBySlug(slug);
    if (existing) {
      throw new BadRequestException({
        errors: [
          { type: 'field', field: 'name', message: 'A topic with this name already exists' },
        ],
      });
    }

    const topic = await this.repository.create({
      slug,
      name: reqBody.name,
      description: reqBody.description,
      color: reqBody.color,
    });

    return {
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
      color: topic.color ?? undefined,
      articleCount: 0,
      actionCount: 0,
      eventCount: 0,
    };
  }

  async update(slug: string, reqBody: AdminTopicRequest): Promise<AdminTopicDetailResponse> {
    const existing = await this.repository.findBySlugWithCounts(slug);
    if (!existing) throw new NotFoundException(`No topic found with slug ${slug}`);

    const updated = await this.repository.update(slug, {
      name: reqBody.name,
      description: reqBody.description,
      color: reqBody.color,
    });

    return {
      id: updated.id,
      slug: updated.slug,
      name: updated.name,
      description: updated.description,
      color: updated.color ?? undefined,
      articleCount: existing._count.topicArticles,
      actionCount: existing._count.topicActions,
      eventCount: existing._count.topicEvents,
    };
  }

  async delete(slug: string): Promise<void> {
    const counts = await this.repository.countLinkedContent(slug);
    const total = counts.articles + counts.actions + counts.events;

    if (total > 0) {
      throw new BadRequestException(
        `Cannot delete topic: ${counts.articles} article(s), ${counts.actions} action(s), and ${counts.events} event(s) are linked to it. Remove all linked content first.`,
      );
    }

    await this.repository.delete(slug);
  }

  private toAdminTopicSummary = (topic: TopicWithCounts): AdminTopicSummary => {
    return {
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
      color: topic.color ?? undefined,
      articleCount: topic._count.topicArticles,
      actionCount: topic._count.topicActions,
      eventCount: topic._count.topicEvents,
    };
  };
}
