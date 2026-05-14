import { Injectable, PipeTransform } from '@nestjs/common';
import { ModerationReviewRequest, SubmissionRequest } from '@signal-fire/api-contracts';
import { validateSubmissionRequest } from './submission.validation';

import { validateSubmissionModerationRequest } from './submission.validation';

@Injectable()
export class SubmissionValidationPipe implements PipeTransform {
  transform(value: unknown): SubmissionRequest {
    return validateSubmissionRequest(value);
  }
}

@Injectable()
export class SubmissionModerationValidationPipe implements PipeTransform {
  transform(value: unknown): ModerationReviewRequest {
    return validateSubmissionModerationRequest(value);
  }
}
