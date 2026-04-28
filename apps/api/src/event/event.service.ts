import { Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { Action, Article, Event, Topic } from '@prisma/client';
import { TopicRepository } from '../topic/topic.repository';
import { ActionRepository } from '../action/action.repository';
import { ArticleRepository } from '../article/article.repository';
import { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';

@Injectable()
export class EventService {
  constructor(
    private eventRepository: EventRepository,
    private topicRepository: TopicRepository,
    private actionRepository: ActionRepository,
    private articleRepository: ArticleRepository,
  ) {}

  private requirePublishedAt(publishedAt: Date | null): Date {
    if (!publishedAt) {
      throw new Error('Published entity is missing publishedAt');
    }

    return publishedAt;
  }

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
      items: events.map((event) => ({
        id: event.id,
        title: event.title,
        summary: event.summary,
        eventType: event.eventType,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime ? event.endTime.toISOString() : null,
        city: event.city,
        region: event.region,
        postalCode: event.postalCode,
        country: event.country,
      })),
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
    const topicSummaries = topics.map((topic) => ({
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
    }));

    const actionSummaries = actions.map((action) => ({
      id: action.id,
      slug: action.slug,
      title: action.title,
      summary: action.summary,
      actionType: action.actionType,
      publishedAt: this.requirePublishedAt(action.publishedAt).toISOString(),
    }));

    const articleSummaries = articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      publishedAt: this.requirePublishedAt(article.publishedAt).toISOString(),
    }));

    return {
      id: event.id,
      title: event.title,
      summary: event.summary,
      description: event.description,
      website: event.website,
      eventType: event.eventType,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime ? event.endTime?.toISOString() : null,
      locationName: event.locationName,
      addressRaw: event.addressRaw,
      city: event.city,
      region: event.region,
      postalCode: event.postalCode,
      country: event.country,
      latitude: event.latitude ? event.latitude.toNumber() : null,
      longitude: event.longitude ? event.longitude.toNumber() : null,
      publishedAt: this.requirePublishedAt(event.publishedAt).toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      topics: topicSummaries,
      actions: actionSummaries,
      articles: articleSummaries,
    };
  }
}
