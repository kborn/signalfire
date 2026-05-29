import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { buildEntityDetailResponse, buildEventListResponse } from './event.test-fixtures';
import { withFrozenTime } from '../../common/test/time';

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
    await withFrozenTime('2025-03-15T12:34:56.001Z', async () => {
      const eventListResponse = buildEventListResponse();
      serviceMock.getPublishedEventList.mockResolvedValue(eventListResponse);

      const ret = await eventController.findEvents(undefined);

      expect(ret).toEqual(eventListResponse);
      expect(serviceMock.getPublishedEventList).toHaveBeenCalledWith({
        startDate: new Date('2025-03-15T00:00:00.000Z'),
        endDate: new Date('2025-06-15T00:00:00.000Z'),
        topicSlug: undefined,
      });
    });
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
