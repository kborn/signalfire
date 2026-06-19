import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';
import { TopicModule } from '../topic/topic.module';
import { ArticleModule } from '../article/article.module';
import { SubmissionValidationPipe } from './submission-validation.pipe';
import { SubmissionController } from './submission.controller';
import { EventModule } from '../event/event.module';
import { SubmissionRateLimitService } from './submission-rate-limit.service';

@Module({
  imports: [PrismaModule, TopicModule, ArticleModule, EventModule],
  providers: [
    SubmissionService,
    SubmissionRepository,
    SubmissionValidationPipe,
    SubmissionRateLimitService,
  ],
  exports: [SubmissionService],
  controllers: [SubmissionController],
})
export class SubmissionModule {}
