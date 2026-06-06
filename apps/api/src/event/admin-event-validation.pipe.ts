import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import type { AdminEventRequest } from '@signal-fire/api-contracts';
import { validateAdminEventRequest } from './admin-event.validation';

@Injectable()
export class AdminEventValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): AdminEventRequest {
    if (metadata.type !== 'body') {
      return value as AdminEventRequest;
    }

    return validateAdminEventRequest(value);
  }
}
