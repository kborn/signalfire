import { Controller, Get, Param } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionDetailResponse, ActionListResponse } from '@signal-fire/api-contracts';
import { EntityStatus } from '@prisma/client';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get()
  async findActions(): Promise<ActionListResponse> {
    return this.actionService.getActionList(EntityStatus.PUBLISHED);
  }

  @Get('/:slug')
  async findAction(@Param('slug') slug: string): Promise<ActionDetailResponse> {
    return this.actionService.getActionDetail(slug, EntityStatus.PUBLISHED);
  }
}
