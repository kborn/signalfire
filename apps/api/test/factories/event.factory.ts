import { PrismaService } from '../../src/prisma/prisma.service';
import { EntityStatus, EventType, Prisma } from '@prisma/client';

export async function createEvent(
  prisma: PrismaService,
  overrides: Partial<Prisma.EventCreateInput> = {},
) {
  return prisma.event.create({
    data: {
      title: 'Protest Now! presents: Stop the protests! A protest to end protests',
      summary: "Exactly what it sounds like. Let's protest protests",
      description: 'You should have been able to figure it out by now....',
      eventType: EventType.PROTEST,
      status: EntityStatus.PUBLISHED,
      startTime: new Date(2025, 2, 15, 0, 0, 0, 0),
      locationName: "The mayor's house",
      addressRaw: '123 Fake st, Summerville, MD 02543',
      ...overrides,
    },
  });
}
