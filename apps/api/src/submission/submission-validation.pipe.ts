import { Injectable, PipeTransform } from '@nestjs/common';
import type { SubmissionRequest } from '@signal-fire/api-contracts';
import { validateSubmissionRequest } from './submission.validation';

@Injectable()
export class SubmissionValidationPipe implements PipeTransform {
  transform(value: unknown): SubmissionRequest {
    return validateSubmissionRequest(value);
  }
}
