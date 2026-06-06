import { Injectable, PipeTransform } from '@nestjs/common';
import type { AdminArticleRequest } from '@signal-fire/api-contracts';
import { validateAdminArticleRequest } from './admin-article.validation';

@Injectable()
export class AdminArticleValidationPipe implements PipeTransform {
  transform(value: unknown): AdminArticleRequest {
    return validateAdminArticleRequest(value);
  }
}
