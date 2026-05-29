import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ModerationSubmissionService } from './moderation-submission.service';
import {
  type ModerationReviewRequest,
  ModerationReviewResponse,
  ModerationSubmissionDetail,
  ModerationSubmissionList,
  ModerationSubmissionListFilters,
} from '@signal-fire/api-contracts';
import type { SubmissionStatus, SubmissionType } from '@signal-fire/api-contracts';
import { SubmissionModerationValidationPipe } from './submission-validation.pipe';
import { ReviewSubmissionTypeError, UnknownSubmissionTopicsError } from './submission.error';

@Controller('admin/submissions')
export class ModerationSubmissionController {
  constructor(private readonly moderationSubmissionService: ModerationSubmissionService) {}

  @Get()
  async findQueuedSubmissions(
    @Query('status') submissionStatus?: string,
    @Query('submissionType') submissionType?: string,
  ): Promise<ModerationSubmissionList> {
    const filters: ModerationSubmissionListFilters = {
      status: this.parseSubmissionStatus(submissionStatus),
      submissionType: this.parseSubmissionType(submissionType),
    };
    return this.moderationSubmissionService.getModerationSubmissionList(filters);
  }

  @Get('/:id')
  async findSubmission(
    @Param('id', ParseIntPipe) submissionId: number,
  ): Promise<ModerationSubmissionDetail> {
    return this.moderationSubmissionService.getModerationSubmissionDetails(submissionId);
  }

  private parseSubmissionStatus(value: string | undefined): SubmissionStatus {
    if (value == null) {
      return 'PENDING';
    }

    if (value === 'PENDING' || value === 'APPROVED' || value === 'REJECTED') {
      return value;
    }

    throw new BadRequestException('Invalid submission status');
  }

  private parseSubmissionType(value: string | undefined): SubmissionType | undefined {
    if (value == null) {
      return undefined;
    }

    if (value === 'ARTICLE' || value === 'EVENT') {
      return value;
    }

    throw new BadRequestException('Invalid submission type');
  }

  @Post('/:id/review')
  @HttpCode(200)
  async reviewSubmission(
    @Param('id', ParseIntPipe) submissionId: number,
    @Body(new SubmissionModerationValidationPipe()) reqBody: ModerationReviewRequest,
  ): Promise<ModerationReviewResponse> {
    try {
      return await this.moderationSubmissionService.reviewSubmission(submissionId, reqBody);
    } catch (error) {
      if (error instanceof ReviewSubmissionTypeError) {
        throw new ConflictException({
          errors: [{ type: 'form', message: error.message }],
        });
      }

      if (error instanceof UnknownSubmissionTopicsError) {
        throw new BadRequestException({
          errors: [
            {
              type: 'field',
              field: 'normalized.topicSlugs',
              message: error.message,
            },
          ],
        });
      }

      throw error;
    }
  }
}
