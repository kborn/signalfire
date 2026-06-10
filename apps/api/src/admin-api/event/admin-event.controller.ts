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
  UseGuards,
} from '@nestjs/common';
import { EntityStatus } from '@prisma/client';
import type {
  AdminEventDetailResponse,
  AdminEventListResponse,
  AdminEventRequest,
} from '@signal-fire/api-contracts';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminEventValidationPipe } from './admin-event-validation.pipe';
import { AdminEventService } from './admin-event.service';
import { UnknownSubmissionTopicsError } from '../../submission/submission.error';
import { OptionalEntityStatusQueryPipe } from '../query/admin-query-validation.pipe';

@Controller('admin/events')
@UseGuards(AdminAuthGuard)
export class AdminEventController {
  constructor(private readonly eventService: AdminEventService) {}

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

  @Get()
  async findEvents(
    @Query('status', new OptionalEntityStatusQueryPipe()) publishedStatus: EntityStatus | null,
  ): Promise<AdminEventListResponse> {
    return this.eventService.getAdminEventList(publishedStatus);
  }

  @Get('/:id')
  async findEvent(@Param('id', ParseIntPipe) id: number): Promise<AdminEventDetailResponse> {
    return this.eventService.getAdminEventDetail(id);
  }
}
