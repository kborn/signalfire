import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityStatus } from '@prisma/client';
import { AdminEventController } from './admin-event.controller';
import { AdminEventService } from './admin-event.service';
import { UnknownSubmissionTopicsError } from '../../submission/submission.error';

describe('AdminEventController', () => {
  let controller: AdminEventController;

  const serviceMock = {
    create: jest.fn(),
    update: jest.fn(),
    getAdminEventList: jest.fn(),
    getAdminEventDetail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AdminEventController],
      providers: [{ provide: AdminEventService, useValue: serviceMock }],
    }).compile();

    controller = app.get(AdminEventController);
  });

  it('create maps unknown topic errors to BadRequestException', async () => {
    serviceMock.create.mockRejectedValue(new UnknownSubmissionTopicsError(['unknown-topic']));

    await expect(
      controller.create({
        title: 'Town Hall',
        summary: 'Summary',
        description: 'Description',
        eventType: 'RALLY',
        startTime: '2026-01-01T12:00:00.000Z',
        endTime: null,
        locationName: 'City Hall',
        publicLocationDescription: null,
        addressLine1: null,
        addressLine2: null,
        city: 'Boston',
        region: 'MA',
        country: 'USA',
        postalCode: '02108',
        website: null,
        topicSlugs: ['unknown-topic'],
        status: EntityStatus.PUBLISHED,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('update maps unknown topic errors to BadRequestException', async () => {
    serviceMock.update.mockRejectedValue(new UnknownSubmissionTopicsError(['unknown-topic']));

    await expect(
      controller.update(7, {
        title: 'Town Hall',
        summary: 'Summary',
        description: 'Description',
        eventType: 'RALLY',
        startTime: '2026-01-01T12:00:00.000Z',
        endTime: null,
        locationName: 'City Hall',
        publicLocationDescription: null,
        addressLine1: null,
        addressLine2: null,
        city: 'Boston',
        region: 'MA',
        country: 'USA',
        postalCode: '02108',
        website: null,
        topicSlugs: ['unknown-topic'],
        status: EntityStatus.PUBLISHED,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects invalid list status values', async () => {
    await expect(controller.findEvents('ARCHIVED' as never)).rejects.toThrow(BadRequestException);
  });

  it('delegates list and detail reads to the service', async () => {
    serviceMock.getAdminEventList.mockResolvedValue({ items: [] });
    serviceMock.getAdminEventDetail.mockResolvedValue({ id: 1, title: 'a' });

    await expect(controller.findEvents('DRAFT')).resolves.toEqual({ items: [] });
    await expect(controller.findEvent(1)).resolves.toEqual({
      id: 1,
      title: 'a',
    });
  });
});
