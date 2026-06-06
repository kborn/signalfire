import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { EntityStatus } from '@prisma/client';
import type {
  AdminEventDetailResponse,
  AdminEventListResponse,
  AdminEventRequest,
} from '@signal-fire/api-contracts';
import { UnknownSubmissionTopicsError } from '../submission/submission.error';
import { EventService } from './event.service';
import { AdminEventValidationPipe } from './admin-event-validation.pipe';

@Controller('admin/events')
export class AdminEventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(
    @Body(new AdminEventValidationPipe()) reqBody: AdminEventRequest,
  ): Promise<AdminEventDetailResponse> {
    try {
      return await this.eventService.create(reqBody);
    } catch (error) {
      if (error instanceof UnknownSubmissionTopicsError) {
        throw new BadRequestException({
          errors: [
            {
              type: 'field',
              field: 'topicSlugs',
              message: error.message,
            },
          ],
        });
      }

      throw error;
    }
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new AdminEventValidationPipe()) reqBody: AdminEventRequest,
  ): Promise<AdminEventDetailResponse> {
    try {
      return await this.eventService.update(Number(id), reqBody);
    } catch (error) {
      if (error instanceof UnknownSubmissionTopicsError) {
        throw new BadRequestException({
          errors: [
            {
              type: 'field',
              field: 'topicSlugs',
              message: error.message,
            },
          ],
        });
      }

      throw error;
    }
  }

  private parsePublishedStatus(value: string | undefined): EntityStatus | null {
    if (value == null) {
      return null;
    }

    if (value === 'PUBLISHED' || value === 'DRAFT') {
      return value;
    }

    throw new BadRequestException('Invalid entity status');
  }

  @Get()
  async findEvents(@Query('status') publishedStatus?: string): Promise<AdminEventListResponse> {
    return this.eventService.getAdminEventList(this.parsePublishedStatus(publishedStatus));
  }

  @Get('/:id')
  async findEvent(@Param('id', ParseIntPipe) id: number): Promise<AdminEventDetailResponse> {
    return this.eventService.getAdminEventDetail(id);
  }
}
