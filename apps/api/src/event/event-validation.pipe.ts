import { Injectable, PipeTransform } from '@nestjs/common';

import { validateEventRequest } from './event.validation';
import { ValidatedEventListQuery } from './event.type';

@Injectable()
export class EventValidationPipe implements PipeTransform {
  transform(value: unknown): ValidatedEventListQuery {
    return validateEventRequest(value);
  }
}
