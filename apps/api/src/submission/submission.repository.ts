import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Submission, SubmissionStatus } from '@prisma/client';
import { CreateSubmissionInput } from './submission.type';

@Injectable()
export class SubmissionRepository {
  constructor(private prisma: PrismaService) {}

  findPending(): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: {
        status: SubmissionStatus.PENDING,
      },
    });
  }

  create(submission: CreateSubmissionInput): Promise<Submission> {
    return this.prisma.submission.create({
      data: {
        submissionType: submission.submissionType,
        status: SubmissionStatus.PENDING,
        title: submission.title,
        summary: submission.summary,
        submittedContent: submission.submittedContent,
        eventType: submission.eventType,
        startTime: submission.startTime,
        endTime: submission.endTime,
        locationName: submission.locationName,
        addressRaw: submission.addressRaw,
        city: submission.city,
        region: submission.region,
        postalCode: submission.postalCode,
        country: submission.country,
        website: submission.website,
        contactEmail: submission.contactEmail,
        submitterName: submission.submitterFirstName,
        submitterEmail: submission.submitterEmail,
      },
    });
  }
}
