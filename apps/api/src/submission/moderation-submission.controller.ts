import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import {
  type ModerationReviewRequest,
  ModerationReviewResponse,
  ModerationSubmissionDetail,
  ModerationSubmissionList,
  ModerationSubmissionListFilters,
} from '@signal-fire/api-contracts';
import type { SubmissionStatus, SubmissionType } from '@signal-fire/api-contracts';
import { SubmissionModerationValidationPipe } from './submission-validation.pipe';

@Controller('admin/submissions')
export class ModerationSubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get()
  async findQueuedSubmissions(
    @Query('status') submissionStatus?: string,
    @Query('type') submissionType?: string,
  ): Promise<ModerationSubmissionList> {
    const filters: ModerationSubmissionListFilters = {
      status: this.parseSubmissionStatus(submissionStatus),
      submissionType: this.parseSubmissionType(submissionType),
    };
    return this.submissionService.getModerationSubmissionList(filters);
  }

  @Get('/:id')
  async findSubmission(
    @Param('id', ParseIntPipe) submissionId: number,
  ): Promise<ModerationSubmissionDetail> {
    return this.submissionService.getModerationSubmissionDetails(submissionId);
  }

  parseSubmissionStatus(value: string | undefined): SubmissionStatus {
    if (value == null) {
      return 'PENDING';
    }

    if (value === 'PENDING' || value === 'APPROVED' || value === 'REJECTED') {
      return value;
    }

    throw new BadRequestException('Invalid submission status');
  }

  parseSubmissionType(value: string | undefined): SubmissionType | undefined {
    if (value == null) {
      return undefined;
    }

    if (value === 'ARTICLE' || value === 'EVENT') {
      return value;
    }

    throw new BadRequestException('Invalid submission type');
  }

  @Post('/:id/review')
  async reviewSubmission(
    @Param('id', ParseIntPipe) submissionId: number,
    @Body(new SubmissionModerationValidationPipe()) reqBody: ModerationReviewRequest,
  ): Promise<ModerationReviewResponse> {
    return this.submissionService.reviewSubmission(submissionId, reqBody);
  }
}
