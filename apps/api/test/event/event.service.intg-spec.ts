import { Test, TestingModule } from '@nestjs/testing';
import { EventModule } from '../../src/event/event.module';
import { EventService } from '../../src/event/event.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { EntityStatus, EventType } from '@prisma/client';
import { createEvent } from '../factories/event.factory';
import { createArticle } from '../factories/article.factory';
import { createAction } from '../factories/action.factory';
import { linkActionEvent, linkArticleEvent } from '../factories/relation.factory';

describe('Event Service Integration Test', () => {
  let service: EventService;
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EventModule],
    }).compile();
    service = module.get(EventService);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('returns draft event by id from unrestricted lookup', async () => {
    // test that we don't filter by published status when calling getEventDetail
    const createdEvent = await createEvent(prisma, { status: EntityStatus.DRAFT });
    const event = await service.getEventDetail(createdEvent.id);
    expect(event).toEqual(
      expect.objectContaining({
        id: createdEvent.id,
        eventType: EventType.PROTEST,
        title: 'Protest Now! presents: Stop the protests! A protest to end protests',
      }),
    );
  });

  it('returns published event by id from published lookup', async () => {
    const createdEvent = await createEvent(prisma);
    const event = await service.getPublishedEventDetail(createdEvent.id);
    expect(event).toEqual(
      expect.objectContaining({
        id: createdEvent.id,
        eventType: EventType.PROTEST,
        title: 'Protest Now! presents: Stop the protests! A protest to end protests',
      }),
    );
  });

  it('returns null for draft event from published lookup', async () => {
    // test that unpublished events are not returned
    const createdEvent = await createEvent(prisma, { status: EntityStatus.DRAFT });
    const event = await service.getPublishedEventDetail(createdEvent.id);
    expect(event).toBeNull();
  });

  it('returns published events by related article', async () => {
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
    const events = await service.getEventsByArticle(createdArticle.id);

    const eventIds = events.map((event) => event.id);
    expect(eventIds).toEqual(expect.arrayContaining([createdEvent1.id, createdEvent2.id]));
    expect(eventIds).not.toContain(createdEvent3.id);
    expect(eventIds).not.toContain(createdEvent4.id);
    expect(events).toHaveLength(2);
  });

  it('returns an empty array when no events are related to article', async () => {
    const createdArticle = await createArticle(prisma);
    const events = await service.getEventsByArticle(createdArticle.id);
    expect(events.length).toEqual(0);
  });

  it('returns published events by related action', async () => {
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
    const events = await service.getEventsByAction(createdAction.id);

    const eventIds = events.map((event) => event.id);
    expect(eventIds).toEqual(expect.arrayContaining([createdEvent1.id, createdEvent2.id]));
    expect(eventIds).not.toContain(createdEvent3.id);
    expect(eventIds).not.toContain(createdEvent4.id);
    expect(events).toHaveLength(2);
  });

  it('returns an empty array when no events are related to action', async () => {
    const createdAction = await createAction(prisma);
    const events = await service.getEventsByAction(createdAction.id);
    expect(events.length).toEqual(0);
  });
});
