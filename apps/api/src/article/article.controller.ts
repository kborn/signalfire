import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDetailResponse, ArticleListResponse } from '@signal-fire/api-contracts';
import { ArticleValidationPipe } from './article-validation.pipe';
import type { ValidatedArticleListQuery } from './article.type';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findArticles(
    @Query(new ArticleValidationPipe()) reqBody: ValidatedArticleListQuery,
  ): Promise<ArticleListResponse> {
    return this.articleService.getArticleList(reqBody);
  }

  @Get('/:slug')
  async findArticle(@Param('slug') slug: string): Promise<ArticleDetailResponse> {
    console.log('here');
    return this.articleService.getArticleDetail(slug);
  }
}
