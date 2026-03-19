import { EntityStatus, EventType, Prisma } from '@prisma/client';

export async function createEvent(overrides: Partial<Prisma.EventCreateInput> = {}) {
  return jestPrisma.client.event.create({
    data: {
      title: 'Test event',
      summary: 'Summary',
      description: 'Description',
      eventType: EventType.PROTEST,
      status: EntityStatus.PUBLISHED,
      startTime: new Date(2025, 2, 15, 0, 0, 0, 0),
      locationName: 'Location',
      addressRaw: 'Address',
      ...overrides,
    },
  });
}
