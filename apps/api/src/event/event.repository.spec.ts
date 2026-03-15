import { Test, TestingModule } from '@nestjs/testing';
import { EventRepository } from './event.repository';
import { PrismaService } from '../prisma/prisma.service';
import { EntityStatus } from '@prisma/client';

const event = {
  id: 1,
  title: 'Town Hall Meeting',
  summary: 'A short event summary.',
  description: 'A longer event description.',
  eventType: 'TOWN_HALL',
  status: 'PUBLISHED',
  startTime: new Date(),
  endTime: new Date(),
  locationName: 'City Hall',
  addressRaw: '123 Main St',
  city: 'Springfield',
  region: 'IL',
  postalCode: '62701',
  country: 'USA',
  latitude: null,
  longitude: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('EventRepository', () => {
  let repository: EventRepository;
  const prismaMock = {
    event: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventRepository, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    repository = module.get(EventRepository);
  });

  it('getById', async () => {
    prismaMock.event.findUnique.mockResolvedValue(event);

    const id = 1;
    const ret = await repository.getById(id);

    expect(ret).toEqual(event);
    expect(prismaMock.event.findUnique).toHaveBeenCalledWith({ where: { id: id } });
  });

  it('getPublishedById', async () => {
    prismaMock.event.findUnique.mockResolvedValue(event);

    const id = 1;
    const ret = await repository.getPublishedById(id);

    expect(ret).toEqual(event);
    expect(prismaMock.event.findUnique).toHaveBeenCalledWith({
      where: { status: EntityStatus.PUBLISHED, id: id },
    });
  });

  it('findByArticleId', async () => {
    prismaMock.event.findMany.mockResolvedValue([event]);

    const id = 1;
    const ret = await repository.findByArticleId(id);

    expect(ret).toEqual([event]);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        articleEvents: {
          some: {
            article: {
              id: id,
            },
          },
        },
      },
    });
  });

  it('findByActionId', async () => {
    prismaMock.event.findMany.mockResolvedValue([event]);

    const id = 1;
    const ret = await repository.findByActionId(id);

    expect(ret).toEqual([event]);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith({
      where: {
        status: EntityStatus.PUBLISHED,
        actionEvents: {
          some: {
            action: {
              id: id,
            },
          },
        },
      },
    });
  });
});
