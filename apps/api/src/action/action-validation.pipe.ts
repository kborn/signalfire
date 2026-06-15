import { Injectable, PipeTransform } from '@nestjs/common';
import { validateActionRequest } from './action.validation';
import { ValidatedActionListQuery } from './action.type';

@Injectable()
export class ActionValidationPipe implements PipeTransform {
  transform(value: unknown): ValidatedActionListQuery {
    return validateActionRequest(value);
  }
}
