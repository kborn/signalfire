import { EventService } from './event.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EventRepository } from './event.repository';

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

describe('EventService', () => {
  let service: EventService;
  const repoMock = {
    getById: jest.fn(),
    getPublishedById: jest.fn(),
    findByArticleId: jest.fn(),
    findByActionId: jest.fn(),
  };
  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, { provide: EventRepository, useValue: repoMock }],
    }).compile();
    service = module.get(EventService);
  });

  it('getEventDetail', async () => {
    repoMock.getById.mockResolvedValue(event);

    const id = 1;
    const ret = await service.getEventDetail(id);

    expect(ret).toEqual(event);
    expect(repoMock.getById).toHaveBeenCalledWith(id);
  });

  it('getPublishedEventDetail', async () => {
    repoMock.getPublishedById.mockResolvedValue(event);

    const id = 1;
    const ret = await service.getPublishedEventDetail(id);

    expect(ret).toEqual(event);
    expect(repoMock.getPublishedById).toHaveBeenCalledWith(id);
  });

  it('getEventsByArticle', async () => {
    repoMock.findByArticleId.mockResolvedValue([event]);

    const id = 1;
    const ret = await service.getEventsByArticle(id);

    expect(ret).toEqual([event]);
    expect(repoMock.findByArticleId).toHaveBeenCalledWith(id);
  });

  it('getEventsByAction', async () => {
    repoMock.findByActionId.mockResolvedValue([event]);

    const id = 1;
    const ret = await service.getEventsByAction(id);

    expect(ret).toEqual([event]);
    expect(repoMock.findByActionId).toHaveBeenCalledWith(id);
  });
});
