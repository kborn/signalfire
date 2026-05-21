import { EntityStatus, EventType, Prisma } from '@prisma/client';

export async function createEvent(overrides: Partial<Prisma.EventCreateInput> = {}) {
  const status = overrides.status ?? EntityStatus.PUBLISHED;
  return jestPrisma.client.event.create({
    data: {
      title: 'Test event',
      summary: 'Summary',
      description: 'Description',
      eventType: EventType.PROTEST,
      status,
      startTime: new Date(2025, 2, 15, 0, 0, 0, 0),
      locationName: 'Location',
      addressLine1: 'Address',
      addressLine2: 'Address',
      publicLocationDescription: 'ac',
      publishedAt: overrides.publishedAt ?? (status === EntityStatus.PUBLISHED ? new Date() : null),
      ...overrides,
    },
  });
}
