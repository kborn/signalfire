import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { buildEntityDetailResponse, buildEventListResponse } from './event.test-fixtures';

describe('EventController', () => {
  let eventController: EventController;

  const serviceMock = {
    getPublishedEventDetail: jest.fn(),
    getPublishedEventList: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [{ provide: EventService, useValue: serviceMock }],
    }).compile();

    eventController = app.get<EventController>(EventController);
  });

  it('findEvents', async () => {
    const eventListResponse = buildEventListResponse();
    serviceMock.getPublishedEventList.mockResolvedValue(eventListResponse);

    const ret = await eventController.findEvents('2025-03-15T00:00:00.000Z', 'PA', undefined);

    expect(ret).toEqual(eventListResponse);
    expect(serviceMock.getPublishedEventList).toHaveBeenCalledWith({
      startDate: new Date('2025-03-15T00:00:00.000Z'),
      endDate: new Date('2025-03-16T00:00:00.000Z'),
      region: 'PA',
      topicSlug: undefined,
    });
  });

  it('findEvents rejects invalid startDate', async () => {
    await expect(eventController.findEvents('bad-date', 'PA', undefined)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('findEvent', async () => {
    const eventDetailResponse = buildEntityDetailResponse();
    serviceMock.getPublishedEventDetail.mockResolvedValue(eventDetailResponse);

    const ret = await eventController.findEvent(1);

    expect(ret).toEqual(eventDetailResponse);
    expect(serviceMock.getPublishedEventDetail).toHaveBeenCalledWith(1);
  });

  it('findEventNotFound', async () => {
    serviceMock.getPublishedEventDetail.mockRejectedValue(new NotFoundException());

    await expect(eventController.findEvent(1)).rejects.toThrow(NotFoundException);
  });
});
