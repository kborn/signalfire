import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ActionService } from './action.service';
import { AdminActionValidationPipe } from './admin-action-validation.pipe';
import type {
  AdminActionDetailResponse,
  AdminActionListResponse,
  AdminActionRequest,
} from '@signal-fire/api-contracts';

import { EntityStatus } from '@prisma/client';
import { UnknownSubmissionTopicsError } from '../submission/submission.error';

@Controller('admin/actions')
export class AdminActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  async create(
    @Body(new AdminActionValidationPipe()) reqBody: AdminActionRequest,
  ): Promise<AdminActionDetailResponse> {
    try {
      return await this.actionService.create(reqBody);
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

  @Patch('/:slug')
  async update(
    @Param('slug') slug: string,
    @Body(new AdminActionValidationPipe()) reqBody: AdminActionRequest,
  ): Promise<AdminActionDetailResponse> {
    try {
      return await this.actionService.update(slug, reqBody);
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
  async findActions(@Query('status') publishedStatus?: string): Promise<AdminActionListResponse> {
    return this.actionService.getAdminActionList(this.parsePublishedStatus(publishedStatus));
  }

  @Get('/:slug')
  async findAction(@Param('slug') slug: string): Promise<AdminActionDetailResponse> {
    return this.actionService.getAdminActionDetail(slug);
  }
}
