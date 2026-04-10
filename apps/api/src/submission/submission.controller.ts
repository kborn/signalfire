import { BadRequestException, Controller, Post, Body } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionResponse } from '@signal-fire/api-contracts';
import type { SubmissionRequest } from '@signal-fire/api-contracts';
import { UnknownSubmissionTopicsError } from './submission.error';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  async makeSubmission(@Body() reqBody: SubmissionRequest): Promise<SubmissionResponse> {
    try {
      return await this.submissionService.create(reqBody);
    } catch (error) {
      if (error instanceof UnknownSubmissionTopicsError) {
        throw new BadRequestException({
          errors: [
            {
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
