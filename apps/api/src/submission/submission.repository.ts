import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Article, Event, ResourceLink, Submission, SubmissionStatus } from '@prisma/client';
import {
  ArticleSubmissionApprovedRepositoryInput,
  CreateSubmissionRepositoryInput,
  EventSubmissionApprovedRepositoryInput,
  FindModerationSubmissionsInput,
  RejectSubmissionRepositoryInput,
} from './submission.repository.types';
import { Prisma } from '@prisma/client';

function isUniqueConstraintError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

@Injectable()
export class SubmissionRepository {
  constructor(private prisma: PrismaService) {}

  private buildTopicCreates(topicIds: number[]) {
    const assignedAt = new Date();
    return topicIds.map((topicId) => ({
      topic: { connect: { id: topicId } },
      assignedAt: assignedAt,
      assignedBy: 'moderation',
    }));
  }

  findModerationSubmissions(filters: FindModerationSubmissionsInput = {}): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: {
        status: filters.status,
        submissionType: filters.submissionType,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  findById(id: number): Promise<Submission | null> {
    return this.prisma.submission.findUnique({
      where: {
        id: id,
      },
    });
  }

  findResourceLinksBySubmissionId(submissionId: number): Promise<ResourceLink[]> {
    return this.prisma.resourceLink.findMany({
      where: {
        submissionResourceLinks: {
          some: {
            submissionId,
          },
        },
      },
      orderBy: {
        id: 'asc',
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

  async markSubmissionRejected(input: RejectSubmissionRepositoryInput): Promise<Submission | null> {
    const result = await this.prisma.submission.updateMany({
      where: {
        id: input.submissionId,
        status: SubmissionStatus.PENDING,
        articleId: null,
        eventId: null,
      },
      data: {
        status: SubmissionStatus.REJECTED,
        reviewNotes: input.reviewNotes ?? null,
        reviewedAt: input.reviewedAt,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(input.submissionId);
  }

  async approveArticleSubmission(
    input: ArticleSubmissionApprovedRepositoryInput,
  ): Promise<{ submission: Submission; article: Article } | null> {
    return this.prisma.$transaction(async (tx) => {
      const claim = await tx.submission.updateMany({
        where: {
          id: input.submissionId,
          status: 'PENDING',
          articleId: null,
          eventId: null,
        },
        data: {
          status: 'APPROVED',
          reviewNotes: input.reviewNotes ?? null,
          reviewedAt: input.reviewedAt,
        },
      });

      if (claim.count === 0) {
        return null;
      }

      const { topicIds, ...articleData } = input.articleData;
      let article: Article;
      try {
        article = await tx.article.create({
          data: {
            ...articleData,
            topicArticles: {
              create: this.buildTopicCreates(topicIds),
            },
          },
        });
      } catch (error) {
        if (!isUniqueConstraintError(error)) {
          throw error;
        }
        article = await tx.article.create({
          data: {
            ...articleData,
            slug: `${input.articleData.slug}-${input.submissionId}`,
            topicArticles: {
              create: this.buildTopicCreates(topicIds),
            },
          },
        });
      }

      const submission = await tx.submission.update({
        where: { id: input.submissionId },
        data: {
          articleId: article.id,
        },
      });

      return { submission, article };
    });
  }

  async approveEventSubmission(
    input: EventSubmissionApprovedRepositoryInput,
  ): Promise<{ submission: Submission; event: Event } | null> {
    return this.prisma.$transaction(async (tx) => {
      const claim = await tx.submission.updateMany({
        where: {
          id: input.submissionId,
          status: 'PENDING',
          articleId: null,
          eventId: null,
        },
        data: {
          status: 'APPROVED',
          reviewNotes: input.reviewNotes ?? null,
          reviewedAt: input.reviewedAt,
        },
      });

      if (claim.count === 0) {
        return null;
      }

      const { topicIds, ...eventData } = input.eventData;

      const event = await tx.event.create({
        data: {
          ...eventData,
          topicEvents: {
            create: this.buildTopicCreates(topicIds),
          },
        },
      });

      const submission = await tx.submission.update({
        where: { id: input.submissionId },
        data: {
          eventId: event.id,
        },
      });

      return { submission, event };
    });
  }
}
