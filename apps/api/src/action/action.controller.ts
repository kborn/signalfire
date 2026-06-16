import { Controller, Get, Param, Query } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionDetailResponse, ActionListResponse } from '@signal-fire/api-contracts';
import { ActionValidationPipe } from './action-validation.pipe';
import type { ValidatedActionListQuery } from './action.type';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get()
  async findActions(
    @Query(new ActionValidationPipe()) reqBody: ValidatedActionListQuery,
  ): Promise<ActionListResponse> {
    return this.actionService.getActionList(reqBody);
  }

  @Get('/:slug')
  async findAction(@Param('slug') slug: string): Promise<ActionDetailResponse> {
    return this.actionService.getActionDetail(slug);
  }
}
