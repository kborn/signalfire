import { EntityStatus } from '@prisma/client';
import request from 'supertest';
import type { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';
import { createAction } from '../factories/action.factory';
import { createArticle } from '../factories/article.factory';
import { createEvent } from '../factories/event.factory';
import { createTopic } from '../factories/topic.factory';
import { linkActionEvent, linkArticleEvent, linkTopicEvent } from '../factories/relation.factory';
import { setupE2ETest } from '../harness/e2e.harness';

describe('EventController (e2e)', () => {
  const harness = setupE2ETest();

  it('/events (GET) returns published events filtered by region/date/topic with stable ordering', async () => {
    const topic = await createTopic({
      slug: 'event-topic',
      name: 'Event Topic',
      description: 'Topic used for event list assertions',
    });
    const earlierEvent = await createEvent({
      title: 'Earlier Event',
      summary: 'Earlier event summary',
      region: 'PA',
      city: 'Philadelphia',
      postalCode: '19107',
      country: 'USA',
      startTime: new Date('2025-03-15T09:00:00.000Z'),
    });
    const laterEvent = await createEvent({
      title: 'Later Event',
      summary: 'Later event summary',
      region: 'PA',
      city: 'Philadelphia',
      postalCode: '19107',
      country: 'USA',
      startTime: new Date('2025-03-15T18:00:00.000Z'),
    });
    const draftEvent = await createEvent({
      title: 'Draft Event',
      summary: 'Draft event summary',
      status: EntityStatus.DRAFT,
      region: 'PA',
      city: 'Philadelphia',
      postalCode: '19107',
      country: 'USA',
      startTime: new Date('2025-03-15T12:00:00.000Z'),
      publishedAt: null,
    });
    const wrongRegionEvent = await createEvent({
      title: 'Wrong Region Event',
      summary: 'Wrong region event summary',
      region: 'NY',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
      startTime: new Date('2025-03-15T11:00:00.000Z'),
    });
    const wrongDayEvent = await createEvent({
      title: 'Wrong Day Event',
      summary: 'Wrong day event summary',
      region: 'PA',
      city: 'Philadelphia',
      postalCode: '19107',
      country: 'USA',
      startTime: new Date('2025-03-16T09:00:00.000Z'),
    });
    const otherTopicEvent = await createEvent({
      title: 'Other Topic Event',
      summary: 'Other topic event summary',
      region: 'PA',
      city: 'Philadelphia',
      postalCode: '19107',
      country: 'USA',
      startTime: new Date('2025-03-15T14:00:00.000Z'),
    });
    const otherTopic = await createTopic({
      slug: 'other-event-topic',
      name: 'Other Event Topic',
      description: 'Other topic used for event list assertions',
    });

    await linkTopicEvent(topic.id, earlierEvent.id);
    await linkTopicEvent(topic.id, laterEvent.id);
    await linkTopicEvent(topic.id, draftEvent.id);
    await linkTopicEvent(topic.id, wrongRegionEvent.id);
    await linkTopicEvent(topic.id, wrongDayEvent.id);
    await linkTopicEvent(otherTopic.id, otherTopicEvent.id);

    const response = await request(harness.httpServer)
      .get('/events')
      .query({
        startDate: '2025-03-15T00:00:00.000Z',
        region: 'PA',
        topicSlug: topic.slug,
      })
      .expect(200);
    const body = response.body as EventListResponse;

    expect(body.items.map((item) => item.id)).toEqual([earlierEvent.id, laterEvent.id]);
    expect(body.items).toEqual([
      expect.objectContaining({
        id: earlierEvent.id,
        title: earlierEvent.title,
        summary: earlierEvent.summary,
        region: 'PA',
        startTime: '2025-03-15T09:00:00.000Z',
      }),
      expect.objectContaining({
        id: laterEvent.id,
        title: laterEvent.title,
        summary: laterEvent.summary,
        region: 'PA',
        startTime: '2025-03-15T18:00:00.000Z',
      }),
    ]);
    expect(body.items.map((item) => item.id)).not.toContain(draftEvent.id);
    expect(body.items.map((item) => item.id)).not.toContain(wrongRegionEvent.id);
    expect(body.items.map((item) => item.id)).not.toContain(wrongDayEvent.id);
    expect(body.items.map((item) => item.id)).not.toContain(otherTopicEvent.id);
  });

  it('/events/:id (GET) returns the published event detail payload', async () => {
    const firstTopic = await createTopic({
      slug: 'event-detail-topic-first',
      name: 'Event Detail Topic First',
      description: 'First topic used for event detail assertions',
    });
    const secondTopic = await createTopic({
      slug: 'event-detail-topic-second',
      name: 'Event Detail Topic Second',
      description: 'Second topic used for event detail assertions',
    });
    const event = await createEvent({
      title: 'Published Event',
      summary: 'Published event summary',
      description: 'Published event description',
      locationName: 'City Hall Plaza',
      addressRaw: '1400 John F Kennedy Blvd, Philadelphia, PA 19107',
      city: 'Philadelphia',
      region: 'PA',
      postalCode: '19107',
      country: 'USA',
      startTime: new Date('2026-04-12T17:00:00.000Z'),
      endTime: new Date('2026-04-12T19:00:00.000Z'),
      publishedAt: new Date('2026-04-01T15:00:00.000Z'),
    });
    const firstPublishedAction = await createAction({
      slug: 'event-published-action-first',
      title: 'Event Published Action First',
      summary: 'Event published action summary first',
      publishedAt: new Date('2026-03-12T00:00:00.000Z'),
    });
    const secondPublishedAction = await createAction({
      slug: 'event-published-action-second',
      title: 'Event Published Action Second',
      summary: 'Event published action summary second',
      publishedAt: new Date('2026-03-13T00:00:00.000Z'),
    });
    const draftAction = await createAction({
      slug: 'event-draft-action',
      title: 'Event Draft Action',
      summary: 'Event draft action summary',
      status: EntityStatus.DRAFT,
    });
    const firstPublishedArticle = await createArticle({
      slug: 'event-published-article-first',
      title: 'Event Published Article First',
      summary: 'Event published article summary first',
      publishedAt: new Date('2026-03-10T00:00:00.000Z'),
    });
    const secondPublishedArticle = await createArticle({
      slug: 'event-published-article-second',
      title: 'Event Published Article Second',
      summary: 'Event published article summary second',
      publishedAt: new Date('2026-03-11T00:00:00.000Z'),
    });
    const draftArticle = await createArticle({
      slug: 'event-draft-article',
      title: 'Event Draft Article',
      summary: 'Event draft article summary',
      status: EntityStatus.DRAFT,
    });

    await linkTopicEvent(firstTopic.id, event.id);
    await linkTopicEvent(secondTopic.id, event.id);
    await linkActionEvent(firstPublishedAction.id, event.id);
    await linkActionEvent(secondPublishedAction.id, event.id);
    await linkActionEvent(draftAction.id, event.id);
    await linkArticleEvent(firstPublishedArticle.id, event.id);
    await linkArticleEvent(secondPublishedArticle.id, event.id);
    await linkArticleEvent(draftArticle.id, event.id);

    const response = await request(harness.httpServer).get(`/events/${event.id}`).expect(200);
    const body = response.body as EventDetailResponse;

    expect(body).toEqual({
      id: event.id,
      title: event.title,
      summary: event.summary,
      description: event.description,
      eventType: event.eventType,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime?.toISOString() ?? null,
      locationName: event.locationName,
      addressRaw: event.addressRaw,
      city: event.city,
      region: event.region,
      postalCode: event.postalCode,
      country: event.country,
      latitude: null,
      longitude: null,
      publishedAt: event.publishedAt?.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      topics: [
        {
          id: firstTopic.id,
          slug: firstTopic.slug,
          name: firstTopic.name,
          description: firstTopic.description,
        },
        {
          id: secondTopic.id,
          slug: secondTopic.slug,
          name: secondTopic.name,
          description: secondTopic.description,
        },
      ],
      actions: [
        {
          id: firstPublishedAction.id,
          slug: firstPublishedAction.slug,
          title: firstPublishedAction.title,
          summary: firstPublishedAction.summary,
          actionType: firstPublishedAction.actionType,
          publishedAt: firstPublishedAction.publishedAt?.toISOString(),
        },
        {
          id: secondPublishedAction.id,
          slug: secondPublishedAction.slug,
          title: secondPublishedAction.title,
          summary: secondPublishedAction.summary,
          actionType: secondPublishedAction.actionType,
          publishedAt: secondPublishedAction.publishedAt?.toISOString(),
        },
      ],
      articles: [
        {
          id: firstPublishedArticle.id,
          slug: firstPublishedArticle.slug,
          title: firstPublishedArticle.title,
          summary: firstPublishedArticle.summary,
          publishedAt: firstPublishedArticle.publishedAt?.toISOString(),
        },
        {
          id: secondPublishedArticle.id,
          slug: secondPublishedArticle.slug,
          title: secondPublishedArticle.title,
          summary: secondPublishedArticle.summary,
          publishedAt: secondPublishedArticle.publishedAt?.toISOString(),
        },
      ],
    });
  });

  it('/events/:id (GET) returns 404 when the event is missing', async () => {
    await request(harness.httpServer).get('/events/999999').expect(404);
  });

  it('/events/:id (GET) returns 404 when the event is unpublished', async () => {
    const event = await createEvent({
      status: EntityStatus.DRAFT,
      publishedAt: null,
    });

    await request(harness.httpServer).get(`/events/${event.id}`).expect(404);
  });
});
