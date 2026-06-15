import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { Action, Article, Event, Topic } from '@prisma/client';
import { TopicRepository } from '../topic/topic.repository';
import { ActionRepository } from '../action/action.repository';
import { ArticleRepository } from '../article/article.repository';
import { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';
import {
  requirePublishedAt,
  toActionSummary,
  toArticleSummary,
  toEventSummary,
  toTopicSummary,
} from '../common/public-content.mapper';
import type { ValidatedEventListQuery } from './event.type';

@Injectable()
export class EventService {
  constructor(
    private eventRepository: EventRepository,
    private topicRepository: TopicRepository,
    private actionRepository: ActionRepository,
    private articleRepository: ArticleRepository,
  ) {}

  async getPublishedEventList(reqBody: ValidatedEventListQuery): Promise<EventListResponse> {
    const events = await this.eventRepository.findPublished(reqBody);
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
