import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  private getDateRangeEnd(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setUTCMonth(endDate.getUTCMonth() + 3);
    return endDate;
  }

  @Get()
  async findEvents(@Query('topicSlug') topicSlug?: string): Promise<EventListResponse> {
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = this.getDateRangeEnd(startDate);
    return this.eventService.getPublishedEventList({
      startDate,
      endDate,
      topicSlug,
    });
  }

  @Get('/:id')
  async findEvent(@Param('id', ParseIntPipe) id: number): Promise<EventDetailResponse> {
    return this.eventService.getPublishedEventDetail(id);
  }
}
