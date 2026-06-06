import { Controller, Get, Param } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDetailResponse, ArticleListResponse } from '@signal-fire/api-contracts';
import { EntityStatus } from '@prisma/client';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findArticles(): Promise<ArticleListResponse> {
    return this.articleService.getArticleList();
  }

  @Get('/:slug')
  async findArticle(@Param('slug') slug: string): Promise<ArticleDetailResponse> {
    return this.articleService.getArticleDetail(slug, EntityStatus.PUBLISHED);
  }
}
