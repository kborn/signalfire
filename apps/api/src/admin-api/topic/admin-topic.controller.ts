import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type {
  AdminTopicDetailResponse,
  AdminTopicListResponse,
  AdminTopicRequest,
} from '@signal-fire/api-contracts';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminTopicService } from './admin-topic.service';
import { AdminTopicValidationPipe } from './admin-topic-validation.pipe';

@Controller('admin/topics')
@UseGuards(AdminAuthGuard)
export class AdminTopicController {
  constructor(private readonly topicService: AdminTopicService) {}

  @Get()
  async findTopics(): Promise<AdminTopicListResponse> {
    return this.topicService.getAdminTopicList();
  }

  @Get('/:slug')
  async findTopic(@Param('slug') slug: string): Promise<AdminTopicDetailResponse> {
    return this.topicService.getAdminTopicDetail(slug);
  }

  @Post()
  async create(
    @Body(new AdminTopicValidationPipe()) reqBody: AdminTopicRequest,
  ): Promise<AdminTopicDetailResponse> {
    return this.topicService.create(reqBody);
  }

  @Patch('/:slug')
  async update(
    @Param('slug') slug: string,
    @Body(new AdminTopicValidationPipe()) reqBody: AdminTopicRequest,
  ): Promise<AdminTopicDetailResponse> {
    return this.topicService.update(slug, reqBody);
  }

  @Delete('/:slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('slug') slug: string): Promise<void> {
    return this.topicService.delete(slug);
  }
}
