import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionResponse } from '@signal-fire/api-contracts';
import type { SubmissionRequest } from '@signal-fire/api-contracts';
import { UnknownSubmissionTopicsError } from './submission.error';
import { SubmissionValidationPipe } from './submission-validation.pipe';
import { SubmissionRateLimitService } from './submission-rate-limit.service';
import type { Request, Response } from 'express';

@Controller('submissions')
export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly submissionRateLimitService: SubmissionRateLimitService,
  ) {}

  @Post()
  async makeSubmission(
    @Body(new SubmissionValidationPipe()) reqBody: SubmissionRequest,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Headers('x-forwarded-for') forwardedFor?: string,
  ): Promise<SubmissionResponse> {
    const rateLimit = this.submissionRateLimitService.consume(
      getSubmissionRateLimitSubject(request, forwardedFor),
    );

    if (!rateLimit.allowed) {
      response.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
      throw new HttpException(
        {
          errors: [
            {
              type: 'form',
              message:
                'Too many submissions were sent from this connection. Please wait a few minutes and try again.',
            },
          ],
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    try {
      return await this.submissionService.create(reqBody);
    } catch (error) {
      if (error instanceof UnknownSubmissionTopicsError) {
        throw new BadRequestException({
          errors: [
            {
              type: 'field',
              field: 'payload.topicSlugs',
              message: `Unknown topic slugs: ${error.slugs.join(', ')}`,
            },
          ],
        });
      } else {
        throw error;
      }
    }
  }
}

function getSubmissionRateLimitSubject(request: Request, forwardedFor?: string): string {
  const forwardedValue = forwardedFor?.split(',')[0]?.trim();
  return forwardedValue || request.ip || request.socket?.remoteAddress || 'unknown';
}
