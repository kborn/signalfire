import { Injectable } from '@nestjs/common';
import { SubmissionRepository } from './submission.repository';
import { Submission } from '@prisma/client';
import { CreateSubmissionInput } from './submission.type';

@Injectable()
export class SubmissionService {
  constructor(private repository: SubmissionRepository) {}

  getPendingSubmissions(): Promise<Submission[]> {
    return this.repository.findPending();
  }

  create(submission: CreateSubmissionInput): Promise<Submission> {
    return this.repository.create(submission);
  }
}
