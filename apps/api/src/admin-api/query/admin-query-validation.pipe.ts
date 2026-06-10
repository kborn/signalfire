import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EntityStatus } from '@prisma/client';
import type { SubmissionStatus, SubmissionType } from '@signal-fire/api-contracts';

@Injectable()
export class OptionalEntityStatusQueryPipe implements PipeTransform<
  string | undefined,
  EntityStatus | null
> {
  transform(value: string | undefined): EntityStatus | null {
    if (value == null) {
      return null;
    }

    if (value === EntityStatus.PUBLISHED || value === EntityStatus.DRAFT) {
      return value;
    }

    throw new BadRequestException('Invalid entity status');
  }
}

@Injectable()
export class SubmissionStatusQueryPipe implements PipeTransform<
  string | undefined,
  SubmissionStatus
> {
  transform(value: string | undefined): SubmissionStatus {
    if (value == null) {
      return 'PENDING';
    }

    if (value === 'PENDING' || value === 'APPROVED' || value === 'REJECTED') {
      return value;
    }

    throw new BadRequestException('Invalid submission status');
  }
}

@Injectable()
export class OptionalSubmissionTypeQueryPipe implements PipeTransform<
  string | undefined,
  SubmissionType | undefined
> {
  transform(value: string | undefined): SubmissionType | undefined {
    if (value == null) {
      return undefined;
    }

    if (value === 'ARTICLE' || value === 'EVENT') {
      return value;
    }

    throw new BadRequestException('Invalid submission type');
  }
}
