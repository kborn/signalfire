import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDetailResponse, ArticleListResponse } from '@signal-fire/api-contracts';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findArticles(@Query('topicSlug') topicSlug?: string): Promise<ArticleListResponse> {
    return this.articleService.getArticleList(topicSlug);
  }

  @Get('/:slug')
  async findArticle(@Param('slug') slug: string): Promise<ArticleDetailResponse> {
    return this.articleService.getArticleDetail(slug);
  }
}
