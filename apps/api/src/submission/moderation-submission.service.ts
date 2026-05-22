import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SubmissionRepository } from './submission.repository';
import {
  ModerationSubmissionList,
  ModerationSubmissionListFilters,
  ModerationReviewRequest,
  ModerationReviewResponse,
  ModerationSubmissionDetail,
  TopicSummary,
  ModerationReviewSuccess,
  ModerationReviewApproveArticleRequest,
  ModerationReviewApproveEventRequest,
  ModerationReviewRejectRequest,
} from '@signal-fire/api-contracts';
import {
  ArticleSubmissionApprovedRepositoryInput,
  EventSubmissionApprovedRepositoryInput,
} from './submission.repository.types';
import { Submission, SubmissionStatus, SubmissionType, Topic } from '@prisma/client';
import { TopicRepository } from '../topic/topic.repository';
import { ReviewSubmissionTypeError, UnknownSubmissionTopicsError } from './submission.error';

function requireSubmissionField<T>(
  value: T | null | undefined,
  fieldName: string,
  submissionId: number,
): T {
  if (value == null) {
    throw new InternalServerErrorException(
      `Submission ${submissionId} is missing required field ${fieldName}`,
    );
  }

  return value;
}

type ModerationSubmissionCommonParts = {
  id: number;
  status: SubmissionStatus;
  submittedAt: string;
  submitterName: string | null;
  submitterEmail: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  submittedContentCommon: {
    title: string;
    summary: string;
    topics: TopicSummary[];
  };
};

@Injectable()
export class ModerationSubmissionService {
  constructor(
    private repository: SubmissionRepository,
    private topicRepository: TopicRepository,
  ) {}

  private async requireSubmissionType(submissionId: number, expectedType: SubmissionType) {
    const submission = await this.repository.findById(submissionId);

    if (!submission) {
      throw new NotFoundException(`No submission found with id ${submissionId}`);
    }

    if (submission.submissionType !== expectedType) {
      throw new ReviewSubmissionTypeError(expectedType, submission.submissionType);
    }

    return submission;
  }

  private parseOptionalDate(dateString?: string | null): Date | null {
    return dateString == null ? null : new Date(dateString);
  }

  async mapCommonSubmissionParts(submission: Submission): Promise<ModerationSubmissionCommonParts> {
    const topics: Topic[] = await this.topicRepository.findBySubmissionId(submission.id);
    return {
      id: submission.id,
      status: submission.status,
      submittedAt: submission.submittedAt.toISOString(),
      submitterName: submission.submitterName,
      submitterEmail: submission.submitterEmail,
      reviewedAt: submission.reviewedAt ? submission.reviewedAt.toISOString() : null,
      reviewNotes: submission.reviewNotes ? submission.reviewNotes : null,
      submittedContentCommon: {
        title: submission.title,
        summary: submission.summary,
        topics: topics.map((topic) => ({
          id: topic.id,
          slug: topic.slug,
          name: topic.name,
          description: topic.description,
        })),
      },
    };
  }

  async getModerationSubmissionList(
    filters: ModerationSubmissionListFilters = {},
  ): Promise<ModerationSubmissionList> {
    const submissions = await this.repository.findModerationSubmissions(filters);
    return {
      items: submissions.map((submission) => ({
        id: submission.id,
        submissionType: submission.submissionType,
        status: submission.status,
        title: submission.title,
        summary: submission.summary,
        submittedAt: submission.submittedAt.toISOString(),
        submitterName: submission.submitterName,
        submitterEmail: submission.submitterEmail,
      })),
    };
  }

  async mapEventSubmissionResponse(submission: Submission): Promise<ModerationSubmissionDetail> {
    const common = await this.mapCommonSubmissionParts(submission);
    return {
      id: common.id,
      submissionType: 'EVENT',
      status: common.status,
      submittedAt: common.submittedAt,
      submitterName: common.submitterName,
      submitterEmail: common.submitterEmail,
      reviewedAt: common.reviewedAt,
      reviewNotes: common.reviewNotes,
      submittedContent: {
        ...common.submittedContentCommon,
        description: submission.submittedContent,
        eventType: requireSubmissionField(submission.eventType, 'eventType', submission.id),
        startTime: requireSubmissionField(
          submission.startTime,
          'startTime',
          submission.id,
        ).toISOString(),
        endTime: submission.endTime ? submission.endTime.toISOString() : null,
        locationName: requireSubmissionField(
          submission.locationName,
          'locationName',
          submission.id,
        ),
        publicLocationDescription: submission.publicLocationDescription,
        addressLine1: submission.addressLine1,
        addressLine2: submission.addressLine2,
        city: requireSubmissionField(submission.city, 'city', submission.id),
        region: requireSubmissionField(submission.region, 'region', submission.id),
        country: requireSubmissionField(submission.country, 'country', submission.id),
        postalCode: submission.postalCode,
        website: submission.website,
        contactEmail: submission.contactEmail,
      },
    };
  }

  async mapArticleSubmissionResponse(submission: Submission): Promise<ModerationSubmissionDetail> {
    const common = await this.mapCommonSubmissionParts(submission);
    const resourceLinks = await this.repository.findResourceLinksBySubmissionId(submission.id);
    return {
      id: common.id,
      submissionType: 'ARTICLE',
      status: common.status,
      submittedAt: common.submittedAt,
      submitterName: common.submitterName,
      submitterEmail: common.submitterEmail,
      reviewedAt: common.reviewedAt,
      reviewNotes: common.reviewNotes,
      submittedContent: {
        ...common.submittedContentCommon,
        content: submission.submittedContent,
        resourceLinks: resourceLinks.map((resourceLink) => resourceLink.url),
        author: submission.author,
      },
    };
  }

  async getModerationSubmissionDetails(id: number): Promise<ModerationSubmissionDetail> {
    const submission = await this.repository.findById(id);
    if (!submission) {
      throw new NotFoundException(`No submission found with id ${id}`);
    }
    if (submission.submissionType === 'EVENT') {
      return this.mapEventSubmissionResponse(submission);
    } else {
      return this.mapArticleSubmissionResponse(submission);
    }
  }

  async getTopicIds(slugs: string[]): Promise<number[]> {
    const recs: { id: number; slug: string }[] = await this.topicRepository.findIdsBySlugs(slugs);
    const foundSlugs = new Set(recs.map((rec) => rec.slug));
    const unknownSlugs = slugs.filter((slug) => !foundSlugs.has(slug));

    if (unknownSlugs.length) {
      throw new UnknownSubmissionTopicsError(unknownSlugs);
    }

    return recs.map((rec) => rec.id);
  }

  private titleToSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async rejectSubmission(
    submissionId: number,
    result: ModerationReviewRejectRequest,
    reviewedAt: Date,
  ): Promise<ModerationReviewSuccess> {
    const submission = await this.repository.markSubmissionRejected({
      ...result,
      reviewedAt: reviewedAt,
      submissionId: submissionId,
    });
    if (!submission) {
      throw new NotFoundException(`No pending submission found with id ${submissionId}`);
    }
    return {
      submissionId: submissionId,
      status: 'REJECTED',
      reviewedAt: reviewedAt.toISOString(),
    };
  }

  private async approveArticleSubmission(
    submissionId: number,
    result: ModerationReviewApproveArticleRequest,
    reviewedAt: Date,
  ): Promise<ModerationReviewSuccess> {
    await this.requireSubmissionType(submissionId, SubmissionType.ARTICLE);
    const repoInput: ArticleSubmissionApprovedRepositoryInput = {
      reviewNotes: result.reviewNotes,
      reviewedAt: reviewedAt,
      submissionId: submissionId,
      articleData: await this.buildArticleApprovalInput(result, reviewedAt),
    };

    const reviewResponse = await this.repository.approveArticleSubmission(repoInput);
    if (!reviewResponse) {
      throw new ConflictException(
        `Submission ${submissionId} has already been reviewed or converted`,
      );
    }

    const article = reviewResponse.article;
    return {
      submissionId: submissionId,
      status: 'APPROVED',
      reviewedAt: reviewedAt.toISOString(),
      createdRecord: {
        recordType: 'ARTICLE',
        id: article.id,
        slug: article.slug,
        publishStatus: article.status,
      },
    };
  }

  private async buildArticleApprovalInput(
    result: ModerationReviewApproveArticleRequest,
    reviewedAt: Date,
  ) {
    return {
      title: result.normalized.title,
      slug: this.titleToSlug(result.normalized.title),
      summary: result.normalized.summary,
      content: result.normalized.content,
      status: result.publishStatus,
      author: result.normalized.author,
      publishedAt: result.publishStatus === 'PUBLISHED' ? reviewedAt : null,
      topicIds: await this.getTopicIds(result.normalized.topicSlugs),
    };
  }

  private async approveEventSubmission(
    submissionId: number,
    result: ModerationReviewApproveEventRequest,
    reviewedAt: Date,
  ): Promise<ModerationReviewSuccess> {
    await this.requireSubmissionType(submissionId, SubmissionType.EVENT);
    const repoInput: EventSubmissionApprovedRepositoryInput = {
      reviewNotes: result.reviewNotes,
      reviewedAt: reviewedAt,
      submissionId: submissionId,
      eventData: await this.buildEventApprovalInput(result, reviewedAt),
    };
    const reviewResponse = await this.repository.approveEventSubmission(repoInput);
    if (!reviewResponse) {
      throw new NotFoundException(`No pending submission found with id ${submissionId}`);
    }
    const event = reviewResponse.event;
    return {
      submissionId: submissionId,
      status: 'APPROVED',
      reviewedAt: reviewedAt.toISOString(),
      createdRecord: {
        recordType: 'EVENT',
        id: event.id,
        publishStatus: event.status,
      },
    };
  }

  private async buildEventApprovalInput(
    result: ModerationReviewApproveEventRequest,
    reviewedAt: Date,
  ) {
    return {
      title: result.normalized.title,
      summary: result.normalized.summary,
      description: result.normalized.description,
      eventType: result.normalized.eventType,
      startTime: new Date(result.normalized.startTime),
      endTime: this.parseOptionalDate(result.normalized.endTime),
      locationName: result.normalized.locationName,
      publicLocationDescription: result.normalized.publicLocationDescription ?? null,
      addressLine1: result.normalized.addressLine1 ?? null,
      addressLine2: result.normalized.addressLine2 ?? null,
      city: result.normalized.city ?? null,
      region: result.normalized.region ?? null,
      country: result.normalized.country ?? null,
      postalCode: result.normalized.postalCode ?? null,
      website: result.normalized.website ?? null,
      contactEmail: result.normalized.contactEmail ?? null,
      status: result.publishStatus,
      publishedAt: result.publishStatus === 'PUBLISHED' ? reviewedAt : null,
      topicIds: await this.getTopicIds(result.normalized.topicSlugs),
    };
  }

  async reviewSubmission(
    submissionId: number,
    result: ModerationReviewRequest,
  ): Promise<ModerationReviewResponse> {
    const reviewedAt = new Date();
    if (result.decision === 'REJECT') {
      return this.rejectSubmission(submissionId, result, reviewedAt);
    } else if (result.decision === 'APPROVE_ARTICLE') {
      return this.approveArticleSubmission(submissionId, result, reviewedAt);
    } else if (result.decision === 'APPROVE_EVENT') {
      return this.approveEventSubmission(submissionId, result, reviewedAt);
    }
    throw new Error('Unexpected moderation review decision');
  }
}
