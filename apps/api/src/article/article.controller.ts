import { Controller, Get, Param } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDetailResponse, ArticleListResponse } from './article.types';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findArticles(): Promise<ArticleListResponse> {
    return this.articleService.getPublishedArticleList();
  }

  @Get('/:slug')
  async findArticle(@Param('slug') slug: string): Promise<ArticleDetailResponse> {
    return this.articleService.getPublishedArticleDetail(slug);
  }
}
