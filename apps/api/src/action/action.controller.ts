import { Controller, Get, Param } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionDetailResponse } from './action.types';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}
  @Get('/:slug')
  async findAction(@Param('slug') slug: string): Promise<ActionDetailResponse> {
    return this.actionService.getPublishedActionDetail(slug);
  }
}
