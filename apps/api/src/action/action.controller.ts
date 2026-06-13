import { Controller, Get, Param, Query } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionDetailResponse, ActionListResponse } from '@signal-fire/api-contracts';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get()
  async findActions(@Query('topicSlug') topicSlug?: string): Promise<ActionListResponse> {
    return this.actionService.getActionList(topicSlug);
  }

  @Get('/:slug')
  async findAction(@Param('slug') slug: string): Promise<ActionDetailResponse> {
    return this.actionService.getActionDetail(slug);
  }
}
