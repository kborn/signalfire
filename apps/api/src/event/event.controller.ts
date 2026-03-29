import { Controller, Get, Param } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  private getDateEnd(startDate: Date, endDateString?: string) {
    let retDate: Date;
    if (endDateString) {
      retDate = new Date(endDateString);
    } else {
      retDate = startDate;
    }
    retDate = new Date(retDate);
    retDate.setUTCDate(retDate.getUTCDate() + 1);
    retDate.setUTCHours(0, 0, 0, 0);
    return retDate;
  }

  @Get()
  async findEvents(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Param('region') region: string,
    @Param('topicSlug') topicSlug?: string,
  ): Promise<EventListResponse> {
    let parsedStartDate: Date;
    try {
      parsedStartDate = new Date(startDate);
    } catch {
      throw new Error(`Can not parse date from ${startDate}`);
    }
    const parsedEndDate = this.getDateEnd(parsedStartDate, endDate);

    return this.eventService.getPublishedEventList({
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      region: region,
      topicSlug: topicSlug,
    });
  }

  @Get('/:id')
  async findEvent(@Param('id') id: number): Promise<EventDetailResponse> {
    return this.eventService.getPublishedEventDetail(id);
  }
}
