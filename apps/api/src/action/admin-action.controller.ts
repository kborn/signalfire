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
import type {
  AdminActionDetailResponse,
  AdminActionListResponse,
  AdminActionRequest,
  AdminActionResponse,
} from '@signal-fire/api-contracts';

import { EntityStatus } from '@prisma/client';

@Controller('admin/actions')
export class AdminActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  async create(@Body() reqBody: AdminActionRequest): Promise<AdminActionResponse> {
    return this.actionService.create(reqBody);
  }

  @Patch('/:slug')
  async update(
    @Param('slug') slug: string,
    @Body() reqBody: AdminActionRequest,
  ): Promise<AdminActionResponse> {
    return this.actionService.update(slug, reqBody);
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
