import { EventModule } from '../../src/event/event.module';
import { EventService } from '../../src/event/event.service';
import { EntityStatus, EventType } from '@prisma/client';
import { createEvent } from '../factories/event.factory';
import { createArticle } from '../factories/article.factory';
import { createAction } from '../factories/action.factory';
import { linkActionEvent, linkArticleEvent, linkTopicEvent } from '../factories/relation.factory';
import { setupIntegrationTest } from '../harness/integration.harness';
import { TopicModule } from '../../src/topic/topic.module';
import { TopicService } from '../../src/topic/topic.service';
import { NotFoundException } from '@nestjs/common';

describe('Event Service Integration Test', () => {
  const harness = setupIntegrationTest([EventModule, TopicModule]);

  it('returns published events filtered by region and date ordered by startTime then id', async () => {
    const eventService = harness.module.get(EventService);
    const topicService = harness.module.get(TopicService);

    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }

    const laterEvent = await createEvent({
      region: 'PA',
      startTime: new Date('2025-03-15T18:00:00.000Z'),
    });
    const earlierEvent = await createEvent({
      region: 'PA',
      startTime: new Date('2025-03-15T09:00:00.000Z'),
    });
    const draftEvent = await createEvent({
      status: EntityStatus.DRAFT,
      region: 'PA',
      startTime: new Date('2025-03-15T10:00:00.000Z'),
      publishedAt: null,
    });
    const wrongDayEvent = await createEvent({
      region: 'PA',
      startTime: new Date('2025-03-16T09:00:00.000Z'),
    });

    await linkTopicEvent(topic.id, laterEvent.id);
    await linkTopicEvent(topic.id, earlierEvent.id);
    await linkTopicEvent(topic.id, draftEvent.id);
    await linkTopicEvent(topic.id, wrongDayEvent.id);

    const response = await eventService.getPublishedEventList({
      startDate: new Date('2025-03-15T00:00:00.000Z'),
      endDate: new Date('2025-03-16T00:00:00.000Z'),
    });

    expect(response.items.map((item) => item.id)).toEqual([earlierEvent.id, laterEvent.id]);
    expect(response.items).toEqual([
      expect.objectContaining({
        id: earlierEvent.id,
        region: 'PA',
        startTime: '2025-03-15T09:00:00.000Z',
      }),
      expect.objectContaining({
        id: laterEvent.id,
        region: 'PA',
        startTime: '2025-03-15T18:00:00.000Z',
      }),
    ]);
    expect(response.items.map((item) => item.id)).not.toContain(draftEvent.id);
    expect(response.items.map((item) => item.id)).not.toContain(wrongDayEvent.id);
  });

  it('returns published events filtered by topic slug', async () => {
    const eventService = harness.module.get(EventService);
    const topicService = harness.module.get(TopicService);

    const democracyTopic = await topicService.getTopicDetail('democracy');
    const climateTopic = await topicService.getTopicDetail('climate');
    expect(democracyTopic).not.toBeNull();
    expect(climateTopic).not.toBeNull();
    if (!democracyTopic || !climateTopic) {
      throw new Error('Seeded topics unexpectedly null');
    }

    const matchingEvent = await createEvent({
      region: 'PA',
      startTime: new Date('2025-03-15T14:00:00.000Z'),
    });
    const otherTopicEvent = await createEvent({
      region: 'PA',
      startTime: new Date('2025-03-15T16:00:00.000Z'),
    });

    await linkTopicEvent(democracyTopic.id, matchingEvent.id);
    await linkTopicEvent(climateTopic.id, otherTopicEvent.id);

    const response = await eventService.getPublishedEventList({
      startDate: new Date('2025-03-15T00:00:00.000Z'),
      endDate: new Date('2025-03-16T00:00:00.000Z'),
      topicSlug: 'democracy',
    });

    expect(response.items.map((item) => item.id)).toEqual([matchingEvent.id]);
  });

  it('returns draft event by id from unrestricted lookup', async () => {
    const eventService = harness.module.get(EventService);

    // test that we don't filter by published status when calling getEventDetail
    const createdEvent = await createEvent({ status: EntityStatus.DRAFT });
    const event = await eventService.getEventDetail(createdEvent.id);
    expect(event).toEqual(
      expect.objectContaining({
        id: createdEvent.id,
        eventType: EventType.PROTEST,
        title: 'Test event',
      }),
    );
  });

  it('returns published event by id from published lookup', async () => {
    const eventService = harness.module.get(EventService);

    const createdEvent = await createEvent();
    const event = await eventService.getPublishedEventDetail(createdEvent.id);
    expect(event).toEqual(
      expect.objectContaining({
        id: createdEvent.id,
        eventType: EventType.PROTEST,
        title: 'Test event',
      }),
    );
  });

  it('returns null for draft event from published lookup', async () => {
    const eventService = harness.module.get(EventService);

    // test that unpublished events are not returned
    const createdEvent = await createEvent({ status: EntityStatus.DRAFT });
    await expect(eventService.getPublishedEventDetail(createdEvent.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns published events by related article', async () => {
    const eventService = harness.module.get(EventService);

    const createdEvent1 = await createEvent();
    const createdEvent2 = await createEvent();
    // this event is used to ensure only the published events linked with the article are returned
    // it is not otherwise used
    const createdEvent3 = await createEvent({ status: EntityStatus.DRAFT });
    // this event is used to ensure only the events linked with the article are returned
    // it is not otherwise used
    const createdEvent4 = await createEvent();
    const createdArticle = await createArticle();
    await linkArticleEvent(createdArticle.id, createdEvent1.id);
    await linkArticleEvent(createdArticle.id, createdEvent2.id);
    await linkArticleEvent(createdArticle.id, createdEvent3.id);
    const events = await eventService.getEventsByArticle(createdArticle.id);

    const eventIds = events.map((event) => event.id);
    expect(eventIds).toEqual(expect.arrayContaining([createdEvent1.id, createdEvent2.id]));
    expect(eventIds).not.toContain(createdEvent3.id);
    expect(eventIds).not.toContain(createdEvent4.id);
    expect(events).toHaveLength(2);
  });

  it('returns an empty array when no events are related to article', async () => {
    const eventService = harness.module.get(EventService);

    const createdArticle = await createEvent();
    const events = await eventService.getEventsByArticle(createdArticle.id);
    expect(events.length).toEqual(0);
  });

  it('returns published events by related action', async () => {
    const eventService = harness.module.get(EventService);

    const createdEvent1 = await createEvent();
    const createdEvent2 = await createEvent();
    // this event is used to ensure only the published events linked with the action are returned
    // it is not otherwise used
    const createdEvent3 = await createEvent({ status: EntityStatus.DRAFT });
    // this event is used to ensure only the events linked with the action are returned
    // it is not otherwise used
    const createdEvent4 = await createEvent();
    const createdAction = await createAction();
    await linkActionEvent(createdAction.id, createdEvent1.id);
    await linkActionEvent(createdAction.id, createdEvent2.id);
    await linkActionEvent(createdAction.id, createdEvent3.id);
    const events = await eventService.getEventsByAction(createdAction.id);

    const eventIds = events.map((event) => event.id);
    expect(eventIds).toEqual(expect.arrayContaining([createdEvent1.id, createdEvent2.id]));
    expect(eventIds).not.toContain(createdEvent3.id);
    expect(eventIds).not.toContain(createdEvent4.id);
    expect(events).toHaveLength(2);
  });

  it('returns an empty array when no events are related to action', async () => {
    const eventService = harness.module.get(EventService);

    const createdAction = await createAction();
    const events = await eventService.getEventsByAction(createdAction.id);
    expect(events.length).toEqual(0);
  });

  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/topic/topic.service.intg-spec.ts
  it('throws exception when trying to link event and topic redundantly', async () => {
    const topicService = harness.module.get(TopicService);

    const createdEvent1 = await createEvent();
    const createdEvent2 = await createEvent();
    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }
    await linkTopicEvent(topic.id, createdEvent1.id);
    await linkTopicEvent(topic.id, createdEvent2.id);
    await expect(linkTopicEvent(topic.id, createdEvent1.id)).toThrowUniqueViolation();
  });
});
