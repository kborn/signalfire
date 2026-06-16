import { Injectable, PipeTransform } from '@nestjs/common';
import { validateArticleRequest } from './article.validation';
import { ValidatedArticleListQuery } from './article.type';

@Injectable()
export class ArticleValidationPipe implements PipeTransform {
  transform(value: unknown): ValidatedArticleListQuery {
    return validateArticleRequest(value);
  }
}
