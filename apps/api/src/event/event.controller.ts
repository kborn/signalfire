import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDetailResponse, EventListResponse } from '@signal-fire/api-contracts';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  private parseDateParam(value: string, fieldName: string): Date {
    if (!value) {
      throw new BadRequestException(`${fieldName} is required`);
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException(`${fieldName} must be a valid ISO-8601 date`);
    }

    return parsedDate;
  }

  private getDateEnd(startDate: Date, endDateString: string | undefined): Date {
    const endDateBase = endDateString ? this.parseDateParam(endDateString, 'endDate') : startDate;
    const endDate = new Date(endDateBase);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    endDate.setUTCHours(0, 0, 0, 0);
    return endDate;
  }

  @Get()
  async findEvents(
    @Query('startDate') startDate: string,
    @Query('region') region: string,
    @Query('topicSlug') topicSlug?: string,
    @Query('endDate') endDate?: string,
  ): Promise<EventListResponse> {
    if (!region) {
      throw new BadRequestException('region is required');
    }

    const parsedStartDate = this.parseDateParam(startDate, 'startDate');
    const parsedEndDate = this.getDateEnd(parsedStartDate, endDate);

    return this.eventService.getPublishedEventList({
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      region,
      topicSlug,
    });
  }

  @Get('/:id')
  async findEvent(@Param('id', ParseIntPipe) id: number): Promise<EventDetailResponse> {
    return this.eventService.getPublishedEventDetail(id);
  }
}
