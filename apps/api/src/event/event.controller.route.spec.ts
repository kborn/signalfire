import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { buildEntityDetailResponse, buildEventListResponse } from './event.test-fixtures';

describe('EventController HTTP', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];

  const eventServiceMock: jest.Mocked<
    Pick<EventService, 'getPublishedEventDetail' | 'getPublishedEventList'>
  > = {
    getPublishedEventDetail: jest.fn(),
    getPublishedEventList: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [{ provide: EventService, useValue: eventServiceMock }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /events returns the event discovery list', async () => {
    const eventListResponse = buildEventListResponse();
    eventServiceMock.getPublishedEventList.mockResolvedValue(eventListResponse);

    await request(httpServer)
      .get('/events')
      .query({ startDate: '2025-03-15T00:00:00.000Z', region: 'PA', topicSlug: 'democracy' })
      .expect(200)
      .expect(eventListResponse);

    expect(eventServiceMock.getPublishedEventList).toHaveBeenCalledWith({
      startDate: new Date('2025-03-15T00:00:00.000Z'),
      endDate: new Date('2025-03-16T00:00:00.000Z'),
      region: 'PA',
      topicSlug: 'democracy',
    });
  });

  it('GET /events returns 400 when startDate is missing', async () => {
    await request(httpServer).get('/events').query({ region: 'PA' }).expect(400);
  });

  it('GET /events returns 400 when startDate is invalid', async () => {
    await request(httpServer)
      .get('/events')
      .query({ startDate: 'not-a-date', region: 'PA' })
      .expect(400);
  });

  it('GET /events returns 400 when region is missing', async () => {
    await request(httpServer)
      .get('/events')
      .query({ startDate: '2025-03-15T00:00:00.000Z' })
      .expect(400);
  });

  it('GET /events/:id returns the event detail payload', async () => {
    const eventDetailResponse = buildEntityDetailResponse();
    eventServiceMock.getPublishedEventDetail.mockResolvedValue(eventDetailResponse);

    await request(httpServer)
      .get(`/events/${eventDetailResponse.id}`)
      .expect(200)
      .expect(eventDetailResponse);

    expect(eventServiceMock.getPublishedEventDetail).toHaveBeenCalledWith(eventDetailResponse.id);
  });

  it('GET /events/:id returns 400 when id is not numeric', async () => {
    await request(httpServer).get('/events/not-a-number').expect(400);
  });

  it('GET /events/:id returns 404 when the event is missing', async () => {
    eventServiceMock.getPublishedEventDetail.mockRejectedValue(
      new NotFoundException('No published event found with id 999'),
    );

    await request(httpServer).get('/events/999').expect(404);
  });
});
