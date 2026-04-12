import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Submission, SubmissionStatus } from '@prisma/client';
import { CreateSubmissionRepositoryInput } from './submission.repository.types';

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

  create(submission: CreateSubmissionRepositoryInput): Promise<Submission> {
    return this.prisma.submission.create({
      data: {
        submissionType: submission.submissionType,
        status: SubmissionStatus.PENDING,
        title: submission.title,
        summary: submission.summary,
        submittedContent: submission.submittedContent,
        author: submission.author,
        submitterName: submission.submitterName,
        submitterEmail: submission.submitterEmail,
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
        submissionTopics: submission.topicIds.length
          ? {
              create: submission.topicIds.map((topicId) => ({
                topic: {
                  connect: { id: topicId },
                },
              })),
            }
          : undefined,
        submissionResourceLinks: submission.resourceLinks?.length
          ? {
              create: submission.resourceLinks.map((url) => ({
                resourceLink: {
                  connectOrCreate: {
                    where: { url },
                    create: { url },
                  },
                },
              })),
            }
          : undefined,
      },
    });
  }
}
