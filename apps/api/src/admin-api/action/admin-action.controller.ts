import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EntityStatus } from '@prisma/client';
import type {
  AdminActionDetailResponse,
  AdminActionListResponse,
  AdminActionRequest,
} from '@signal-fire/api-contracts';
import { AdminActionValidationPipe } from './admin-action-validation.pipe';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminActionService } from './admin-action.service';
import { UnknownSubmissionTopicsError } from '../../submission/submission.error';
import { OptionalEntityStatusQueryPipe } from '../query/admin-query-validation.pipe';

@Controller('admin/actions')
@UseGuards(AdminAuthGuard)
export class AdminActionController {
  constructor(private readonly actionService: AdminActionService) {}

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

  @Get()
  async findActions(
    @Query('status', new OptionalEntityStatusQueryPipe()) publishedStatus: EntityStatus | null,
  ): Promise<AdminActionListResponse> {
    return this.actionService.getAdminActionList(publishedStatus);
  }

  @Get('/:slug')
  async findAction(@Param('slug') slug: string): Promise<AdminActionDetailResponse> {
    return this.actionService.getAdminActionDetail(slug);
  }
}
