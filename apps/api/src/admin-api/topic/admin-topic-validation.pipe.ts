import { Injectable, PipeTransform } from '@nestjs/common';
import type { AdminTopicRequest } from '@signal-fire/api-contracts';
import { validateAdminTopicRequest } from './admin-topic.validation';

@Injectable()
export class AdminTopicValidationPipe implements PipeTransform {
  transform(value: unknown): AdminTopicRequest {
    return validateAdminTopicRequest(value);
  }
}
