import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';
import { TopicModule } from '../topic/topic.module';
import { SubmissionValidationPipe } from './submission-validation.pipe';
import { SubmissionController } from './submission.controller';
import { ModerationSubmissionController } from './moderation-submission.controller';

@Module({
  imports: [PrismaModule, TopicModule],
  providers: [SubmissionService, SubmissionRepository, SubmissionValidationPipe],
  exports: [SubmissionService],
  controllers: [SubmissionController, ModerationSubmissionController],
})
export class SubmissionModule {}
