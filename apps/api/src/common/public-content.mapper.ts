import type {
  ActionSummary,
  ArticleSummary,
  EventSummary,
  TopicSummary,
} from '@signal-fire/api-contracts';
import type { Action, Article, Event, Topic } from '@prisma/client';

export function requirePublishedAt(publishedAt: Date | null): Date {
  if (!publishedAt) {
    throw new Error('Published entity is missing publishedAt');
  }

  return publishedAt;
}

export function toTopicSummary(topic: Topic): TopicSummary {
  return {
    id: topic.id,
    slug: topic.slug,
    name: topic.name,
    description: topic.description,
  };
}

export function toArticleSummary(article: Article): ArticleSummary {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    publishedAt: requirePublishedAt(article.publishedAt).toISOString(),
  };
}

export function toActionSummary(action: Action): ActionSummary {
  return {
    id: action.id,
    slug: action.slug,
    title: action.title,
    summary: action.summary,
    actionType: action.actionType,
    publishedAt: requirePublishedAt(action.publishedAt).toISOString(),
  };
}

export function toEventSummary(event: Event): EventSummary {
  return {
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
  };
}
