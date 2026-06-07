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
  AdminArticleDetailResponse,
  AdminArticleListResponse,
  AdminArticleRequest,
} from '@signal-fire/api-contracts';
import { AdminArticleValidationPipe } from './admin-article-validation.pipe';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminArticleService } from './admin-article.service';
import { UnknownSubmissionTopicsError } from '../../submission/submission.error';

@Controller('admin/articles')
@UseGuards(AdminAuthGuard)
export class AdminArticleController {
  constructor(private readonly articleService: AdminArticleService) {}

  @Post()
  async create(
    @Body(new AdminArticleValidationPipe()) reqBody: AdminArticleRequest,
  ): Promise<AdminArticleDetailResponse> {
    try {
      return await this.articleService.create(reqBody);
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
    @Body(new AdminArticleValidationPipe()) reqBody: AdminArticleRequest,
  ): Promise<AdminArticleDetailResponse> {
    try {
      return await this.articleService.update(slug, reqBody);
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
  async findArticles(@Query('status') publishedStatus?: string): Promise<AdminArticleListResponse> {
    return this.articleService.getAdminArticleList(this.parsePublishedStatus(publishedStatus));
  }

  @Get('/:slug')
  async findArticle(@Param('slug') slug: string): Promise<AdminArticleDetailResponse> {
    return this.articleService.getAdminArticleDetail(slug);
  }
}
