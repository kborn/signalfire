import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';
import { TopicModule } from '../topic/topic.module';

@Module({
  imports: [PrismaModule, TopicModule],
  providers: [SubmissionService, SubmissionRepository],
  exports: [SubmissionService],
})
export class SubmissionModule {}
