import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get('/:slug')
  async findArticle(@Param('slug') slug: string) {
    const article = await this.articleService.getPublishedArticleDetail(slug);
    if (!article) {
      throw new NotFoundException(`No published article found with slug ${slug}`);
    }
    return article;
  }
}
