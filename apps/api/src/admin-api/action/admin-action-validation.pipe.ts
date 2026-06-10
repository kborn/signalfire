import { Injectable, PipeTransform } from '@nestjs/common';
import type { AdminActionRequest } from '@signal-fire/api-contracts';
import { validateAdminActionRequest } from './admin-action.validation';

@Injectable()
export class AdminActionValidationPipe implements PipeTransform {
  transform(value: unknown): AdminActionRequest {
    return validateAdminActionRequest(value);
  }
}
