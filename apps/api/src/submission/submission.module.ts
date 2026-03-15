import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SubmissionService } from './submission.service';
import { SubmissionRepository } from './submission.repository';

@Module({
  imports: [PrismaModule],
  providers: [SubmissionService, SubmissionRepository],
  exports: [SubmissionService],
})
export class SubmissionModule {}
