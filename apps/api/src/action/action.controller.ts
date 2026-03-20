import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ActionService } from './action.service';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}
  @Get('/:slug')
  async findAction(@Param('slug') slug: string) {
    const article = await this.actionService.getPublishedActionDetail(slug);
    if (!article) {
      throw new NotFoundException(`No published action found with slug ${slug}`);
    }
    return article;
  }
}
