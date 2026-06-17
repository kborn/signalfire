import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { buildEntityDetailResponse, buildEventListResponse } from './event.test-fixtures';
import { withFrozenTime } from '../../common/test/time';

type RequestTarget = Parameters<typeof request>[0];

function getHttpApp(app: INestApplication) {
  return app.getHttpAdapter().getInstance() as RequestTarget;
}

describe('EventController HTTP', () => {
  let app: INestApplication;
  let httpApp: RequestTarget;

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
    httpApp = getHttpApp(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /events returns the event discovery list', async () => {
    await withFrozenTime('2025-03-15T12:34:56.001Z', async () => {
      const eventListResponse = buildEventListResponse();
      eventServiceMock.getPublishedEventList.mockResolvedValue(eventListResponse);

      await request(httpApp)
        .get('/events')
        .query({ topicSlug: 'democracy' })
        .expect(200)
        .expect(eventListResponse);

      expect(eventServiceMock.getPublishedEventList).toHaveBeenCalledWith({
        startDate: new Date('2025-03-15T00:00:00.000Z'),
        endDate: new Date('2025-06-15T00:00:00.000Z'),
        topicSlug: 'democracy',
        page: 1,
        pageSize: 10,
      });
    });
  });

  it('GET /events/:id returns the event detail payload', async () => {
    const eventDetailResponse = buildEntityDetailResponse();
    eventServiceMock.getPublishedEventDetail.mockResolvedValue(eventDetailResponse);

    await request(httpApp)
      .get(`/events/${eventDetailResponse.id}`)
      .expect(200)
      .expect(eventDetailResponse);

    expect(eventServiceMock.getPublishedEventDetail).toHaveBeenCalledWith(eventDetailResponse.id);
  });

  it('GET /events/:id returns 400 when id is not numeric', async () => {
    await request(httpApp).get('/events/not-a-number').expect(400);
  });

  it('GET /events/:id returns 404 when the event is missing', async () => {
    eventServiceMock.getPublishedEventDetail.mockRejectedValue(
      new NotFoundException('No published event found with id 999'),
    );

    await request(httpApp).get('/events/999').expect(404);
  });
});
