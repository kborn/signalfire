import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';
import type { ValidatedEventListQuery } from './event.type';
import { EventValidationPipe } from './event-validation.pipe';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findEvents(
    @Query(new EventValidationPipe()) reqBody: ValidatedEventListQuery,
  ): Promise<EventListResponse> {
    return this.eventService.getPublishedEventList(reqBody);
  }

  @Get('/:id')
  async findEvent(@Param('id', ParseIntPipe) id: number): Promise<EventDetailResponse> {
    return this.eventService.getPublishedEventDetail(id);
  }
}
