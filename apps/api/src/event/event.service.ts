import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { Action, Article, EntityStatus, Event, Topic } from '@prisma/client';
import { TopicRepository } from '../topic/topic.repository';
import { ActionRepository } from '../action/action.repository';
import { ArticleRepository } from '../article/article.repository';
import {
  AdminEventDetailResponse,
  AdminEventListResponse,
  AdminEventRequest,
  AdminEventSummary,
  EventDetailResponse,
  EventListResponse,
} from '@signal-fire/api-contracts';
import {
  requirePublishedAt,
  toActionSummary,
  toArticleSummary,
  toEventSummary,
  toTopicSummary,
} from '../common/public-content.mapper';
import {
  CreateAdminEventRepositoryInput,
  UpdateAdminEventRepositoryInput,
} from './admin-event.repository.type';
import { type EventWithTopics } from './event.repository';
import { UnknownSubmissionTopicsError } from '../submission/submission.error';

@Injectable()
export class EventService {
  constructor(
    private eventRepository: EventRepository,
    private topicRepository: TopicRepository,
    private actionRepository: ActionRepository,
    private articleRepository: ArticleRepository,
  ) {}

  async getPublishedEventList(params: {
    startDate: Date;
    endDate: Date;
    topicSlug?: string;
  }): Promise<EventListResponse> {
    const { startDate } = params;
    const { endDate } = params;
    const { topicSlug } = params;

    const events = await this.eventRepository.findPublished(startDate, endDate, topicSlug);
    return {
      items: events.map(toEventSummary),
    };
  }

  getEventDetail(id: number): Promise<Event | null> {
    return this.eventRepository.getById(id);
  }

  async getPublishedEventDetail(id: number): Promise<EventDetailResponse> {
    const event = await this.eventRepository.getPublishedById(id);
    if (!event) {
      throw new NotFoundException(`No published event found with id ${id}`);
    }
    const [topics, articles, actions] = await Promise.all([
      this.topicRepository.findByEventId(event.id),
      this.articleRepository.findPublishedByEventId(event.id),
      this.actionRepository.findPublishedByEventId(event.id),
    ]);
    return this.toEventDetailResponse(event, topics, articles, actions);
  }

  getEventsByArticle(articleId: number): Promise<Event[]> {
    return this.eventRepository.findByArticleId(articleId);
  }

  getEventsByAction(actionId: number): Promise<Event[]> {
    return this.eventRepository.findByActionId(actionId);
  }

  async getAdminEventList(status?: EntityStatus | null): Promise<AdminEventListResponse> {
    const events = await this.eventRepository.findEventsWithTopics(status, [
      { updatedAt: 'desc' },
      { id: 'asc' },
    ]);

    return {
      items: events.map((event) => this.toAdminEventSummary(event)),
    };
  }

  async getAdminEventDetail(
    id: number,
    status?: EntityStatus | null,
  ): Promise<AdminEventDetailResponse> {
    const event = await this.eventRepository.findByIdWithTopics(id, status);
    if (!event) {
      throw new NotFoundException(`No event found with id ${id}${this.statusSuffix(status)}`);
    }

    return this.toAdminEventDetailResponse(event);
  }

  private statusSuffix(status?: EntityStatus | null): string {
    return status ? ` and status ${status}` : '';
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

  private async mapCreateEventRequest(
    reqBody: AdminEventRequest,
  ): Promise<CreateAdminEventRepositoryInput> {
    return {
      title: reqBody.title,
      summary: reqBody.summary,
      description: reqBody.description,
      eventType: reqBody.eventType,
      startTime: new Date(reqBody.startTime),
      endTime: reqBody.endTime ? new Date(reqBody.endTime) : null,
      locationName: reqBody.locationName,
      publicLocationDescription: reqBody.publicLocationDescription ?? null,
      contactEmail: reqBody.contactEmail ?? null,
      addressLine1: reqBody.addressLine1 ?? null,
      addressLine2: reqBody.addressLine2 ?? null,
      city: reqBody.city,
      region: reqBody.region,
      country: reqBody.country,
      postalCode: reqBody.postalCode,
      website: reqBody.website ?? null,
      status: reqBody.status,
      publishedAt: reqBody.status === EntityStatus.PUBLISHED ? new Date() : null,
      topicIds: await this.getTopicIds(reqBody.topicSlugs),
    };
  }

  private async mapUpdateEventRequest(
    reqBody: AdminEventRequest,
  ): Promise<UpdateAdminEventRepositoryInput> {
    return {
      title: reqBody.title,
      summary: reqBody.summary,
      description: reqBody.description,
      eventType: reqBody.eventType,
      startTime: new Date(reqBody.startTime),
      endTime: reqBody.endTime ? new Date(reqBody.endTime) : null,
      locationName: reqBody.locationName,
      publicLocationDescription: reqBody.publicLocationDescription ?? null,
      contactEmail: reqBody.contactEmail ?? null,
      addressLine1: reqBody.addressLine1 ?? null,
      addressLine2: reqBody.addressLine2 ?? null,
      city: reqBody.city,
      region: reqBody.region,
      country: reqBody.country,
      postalCode: reqBody.postalCode,
      website: reqBody.website ?? null,
      status: reqBody.status,
      topicIds: await this.getTopicIds(reqBody.topicSlugs),
    };
  }

  private toAdminEventSummary(event: EventWithTopics): AdminEventSummary {
    return {
      id: event.id,
      title: event.title,
      summary: event.summary,
      eventType: event.eventType,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime ? event.endTime.toISOString() : null,
      locationName: event.locationName,
      city: event.city ?? '',
      region: event.region ?? '',
      country: event.country ?? '',
      postalCode: event.postalCode ?? '',
      status: event.status,
      updatedAt: event.updatedAt.toISOString(),
      publishedAt: event.publishedAt ? event.publishedAt.toISOString() : null,
      topicSlugs: event.topicEvents.map((item) => item.topic.slug),
    };
  }

  private toAdminEventDetailResponse(event: EventWithTopics): AdminEventDetailResponse {
    return {
      ...this.toAdminEventSummary(event),
      description: event.description,
      website: event.website,
      contactEmail: event.contactEmail,
      publicLocationDescription: event.publicLocationDescription,
      addressLine1: event.addressLine1,
      addressLine2: event.addressLine2,
    };
  }

  async create(reqBody: AdminEventRequest): Promise<AdminEventDetailResponse> {
    const event = await this.eventRepository.create(await this.mapCreateEventRequest(reqBody));
    return this.toAdminEventDetailResponse(event);
  }

  async update(id: number, reqBody: AdminEventRequest): Promise<AdminEventDetailResponse> {
    const event = await this.eventRepository.update(id, await this.mapUpdateEventRequest(reqBody));
    return this.toAdminEventDetailResponse(event);
  }

  toEventDetailResponse(
    event: Event,
    topics: Topic[],
    articles: Article[],
    actions: Action[],
  ): EventDetailResponse {
    return {
      id: event.id,
      title: event.title,
      summary: event.summary,
      description: event.description,
      website: event.website,
      contactEmail: event.contactEmail,
      eventType: event.eventType,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime ? event.endTime?.toISOString() : null,
      locationName: event.locationName,
      publicLocationDescription: event.publicLocationDescription,
      addressLine1: event.addressLine1,
      addressLine2: event.addressLine2,
      city: event.city,
      region: event.region,
      postalCode: event.postalCode,
      country: event.country,
      latitude: event.latitude ? event.latitude.toNumber() : null,
      longitude: event.longitude ? event.longitude.toNumber() : null,
      publishedAt: requirePublishedAt(event.publishedAt).toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      topics: topics.map(toTopicSummary),
      actions: actions.map(toActionSummary),
      articles: articles.map(toArticleSummary),
    };
  }
}
