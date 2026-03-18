import { EventModule } from '../../src/event/event.module';
import { EventService } from '../../src/event/event.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { EntityStatus, EventType } from '@prisma/client';
import { createEvent } from '../factories/event.factory';
import { createArticle } from '../factories/article.factory';
import { createAction } from '../factories/action.factory';
import { linkActionEvent, linkArticleEvent, linkTopicEvent } from '../factories/relation.factory';
import { setupIntegrationTest } from '../harness/integration.harness';
import { TopicModule } from '../../src/topic/topic.module';
import { TopicService } from '../../src/topic/topic.service';

describe('Event Service Integration Test', () => {
  const harness = setupIntegrationTest([EventModule, TopicModule]);

  it('returns draft event by id from unrestricted lookup', async () => {
    const eventService = harness.module.get(EventService);
    const prisma = harness.module.get(PrismaService);

    // test that we don't filter by published status when calling getEventDetail
    const createdEvent = await createEvent(prisma, { status: EntityStatus.DRAFT });
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
    const prisma = harness.module.get(PrismaService);

    const createdEvent = await createEvent(prisma);
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
    const prisma = harness.module.get(PrismaService);

    // test that unpublished events are not returned
    const createdEvent = await createEvent(prisma, { status: EntityStatus.DRAFT });
    const event = await eventService.getPublishedEventDetail(createdEvent.id);
    expect(event).toBeNull();
  });

  it('returns published events by related article', async () => {
    const eventService = harness.module.get(EventService);
    const prisma = harness.module.get(PrismaService);

    const createdEvent1 = await createEvent(prisma);
    const createdEvent2 = await createEvent(prisma);
    // this event is used to ensure only the published events linked with the article are returned
    // it is not otherwise used
    const createdEvent3 = await createEvent(prisma, { status: EntityStatus.DRAFT });
    // this event is used to ensure only the events linked with the article are returned
    // it is not otherwise used
    const createdEvent4 = await createEvent(prisma);
    const createdArticle = await createArticle(prisma);
    await linkArticleEvent(prisma, createdArticle.id, createdEvent1.id);
    await linkArticleEvent(prisma, createdArticle.id, createdEvent2.id);
    await linkArticleEvent(prisma, createdArticle.id, createdEvent3.id);
    const events = await eventService.getEventsByArticle(createdArticle.id);

    const eventIds = events.map((event) => event.id);
    expect(eventIds).toEqual(expect.arrayContaining([createdEvent1.id, createdEvent2.id]));
    expect(eventIds).not.toContain(createdEvent3.id);
    expect(eventIds).not.toContain(createdEvent4.id);
    expect(events).toHaveLength(2);
  });

  it('returns an empty array when no events are related to article', async () => {
    const eventService = harness.module.get(EventService);
    const prisma = harness.module.get(PrismaService);

    const createdArticle = await createArticle(prisma);
    const events = await eventService.getEventsByArticle(createdArticle.id);
    expect(events.length).toEqual(0);
  });

  it('returns published events by related action', async () => {
    const eventService = harness.module.get(EventService);
    const prisma = harness.module.get(PrismaService);

    const createdEvent1 = await createEvent(prisma);
    const createdEvent2 = await createEvent(prisma);
    // this event is used to ensure only the published events linked with the action are returned
    // it is not otherwise used
    const createdEvent3 = await createEvent(prisma, { status: EntityStatus.DRAFT });
    // this event is used to ensure only the events linked with the action are returned
    // it is not otherwise used
    const createdEvent4 = await createEvent(prisma);
    const createdAction = await createAction(prisma);
    await linkActionEvent(prisma, createdAction.id, createdEvent1.id);
    await linkActionEvent(prisma, createdAction.id, createdEvent2.id);
    await linkActionEvent(prisma, createdAction.id, createdEvent3.id);
    const events = await eventService.getEventsByAction(createdAction.id);

    const eventIds = events.map((event) => event.id);
    expect(eventIds).toEqual(expect.arrayContaining([createdEvent1.id, createdEvent2.id]));
    expect(eventIds).not.toContain(createdEvent3.id);
    expect(eventIds).not.toContain(createdEvent4.id);
    expect(events).toHaveLength(2);
  });

  it('returns an empty array when no events are related to action', async () => {
    const eventService = harness.module.get(EventService);
    const prisma = harness.module.get(PrismaService);

    const createdAction = await createAction(prisma);
    const events = await eventService.getEventsByAction(createdAction.id);
    expect(events.length).toEqual(0);
  });

  // this test is arbitrarily contained in this suite. It could also live in apps/api/test/topic/topic.service.intg-spec.ts
  it('throws exception when trying to link event and topic redundantly', async () => {
    const topicService = harness.module.get(TopicService);
    const prisma = harness.prisma;

    const createdEvent1 = await createEvent(prisma);
    const createdEvent2 = await createEvent(prisma);
    const topic = await topicService.getTopicDetail('democracy');
    expect(topic).not.toBeNull();
    if (!topic) {
      throw new Error('Seeded topic unexpectedly null');
    }
    await linkTopicEvent(prisma, topic.id, createdEvent1.id);
    await linkTopicEvent(prisma, topic.id, createdEvent2.id);
    await expect(linkTopicEvent(prisma, topic.id, createdEvent1.id)).toThrowUniqueViolation();
  });
});
