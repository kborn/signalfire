import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SubmissionRepository } from './submission.repository';
import {
  SubmissionRequest,
  EventSubmissionRequest,
  ArticleSubmissionRequest,
  SubmissionResponseSuccess,
  ModerationSubmissionList,
  ModerationSubmissionDetail,
  ModerationSubmissionListFilters,
  TopicSummary,
  ModerationReviewRequest,
  ModerationReviewResponse,
} from '@signal-fire/api-contracts';
import {
  ArticleSubmissionApprovedRepositoryInput,
  CreateSubmissionRepositoryInputCommonFields,
  CreateSubmissionRepositoryInputEntityFields,
  EventSubmissionApprovedRepositoryInput,
} from './submission.repository.types';
import { Submission, SubmissionStatus, SubmissionType, Topic } from '@prisma/client';
import { TopicRepository } from '../topic/topic.repository';
import { ReviewSubmissionTypeError, UnknownSubmissionTopicsError } from './submission.error';

type ModerationSubmissionCommonParts = {
  id: number;
  status: SubmissionStatus;
  submittedAt: string;
  submitterName: string | null;
  submitterEmail: string | null;
  reviewedAt: string | null;
  submittedContentCommon: {
    title: string;
    summary: string;
    topics: TopicSummary[];
  };
};

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

@Injectable()
export class SubmissionService {
  constructor(
    private repository: SubmissionRepository,
    private topicRepository: TopicRepository,
  ) {}

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
        submittedAt: submission.submittedAt.toISOString(),
        submitterName: submission.submitterName,
        submitterEmail: submission.submitterEmail,
      })),
    };
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
        addressRaw: submission.addressRaw,
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

  async mapCommonRequestFields(
    req: SubmissionRequest,
  ): Promise<CreateSubmissionRepositoryInputCommonFields> {
    return {
      title: req.payload.title,
      summary: req.payload.summary,
      topicIds: await this.getTopicIds(req.payload.topicSlugs),
      author: req.author,
      submitterName: req.submitterName,
      submitterEmail: req.submitterEmail,
    };
  }

  private buildAddressRaw(req: EventSubmissionRequest): string {
    const street = req.payload.locationAddressStreet?.trim() ?? '';
    const city = req.payload.locationAddressCity.trim();
    const region = req.payload.locationAddressRegion.trim();
    const postalCode = req.payload.locationAddressZip?.trim() ?? '';
    const country = req.payload.locationAddressCountry.trim();

    const localityParts = [city, region].filter((part) => part.length > 0);
    const locality = localityParts.join(', ');
    const localityWithPostalCode =
      postalCode.length > 0
        ? locality.length > 0
          ? `${locality} ${postalCode}`
          : postalCode
        : locality;

    return [street, localityWithPostalCode, country].filter((part) => part.length > 0).join(', ');
  }

  mapEventSubmissionRequest(
    req: EventSubmissionRequest,
  ): CreateSubmissionRepositoryInputEntityFields {
    return {
      submissionType: SubmissionType.EVENT,
      submittedContent: req.payload.description,
      eventType: req.payload.eventType,
      startTime: new Date(req.payload.startDatetime),
      endTime: req.payload.endDatetime ? new Date(req.payload.endDatetime) : null,
      locationName: req.payload.locationName,
      addressRaw: this.buildAddressRaw(req),
      city: req.payload.locationAddressCity,
      region: req.payload.locationAddressRegion,
      postalCode: req.payload.locationAddressZip ?? null,
      country: req.payload.locationAddressCountry,
      website: req.payload.websiteUrl ?? null,
      contactEmail: req.payload.contactEmail,
    };
  }

  mapArticleSubmissionRequest(
    req: ArticleSubmissionRequest,
  ): CreateSubmissionRepositoryInputEntityFields {
    return {
      submissionType: SubmissionType.ARTICLE,
      submittedContent: req.payload.content,
      resourceLinks: req.payload.resourceLinks,
    };
  }

  async create(submission: SubmissionRequest): Promise<SubmissionResponseSuccess> {
    const commonFields = await this.mapCommonRequestFields(submission);
    let fields: CreateSubmissionRepositoryInputEntityFields;
    if (submission.submissionType === 'EVENT') {
      fields = this.mapEventSubmissionRequest(submission);
    } else {
      fields = this.mapArticleSubmissionRequest(submission);
    }

    const created_submission = await this.repository.create({ ...commonFields, ...fields });
    return { id: created_submission.id };
  }

  titleToSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  async reviewSubmission(
    submissionId: number,
    result: ModerationReviewRequest,
  ): Promise<ModerationReviewResponse> {
    const reviewedAt = new Date();
    if (result.decision === 'REJECT') {
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
    } else if (result.decision === 'APPROVE_ARTICLE') {
      const submission = await this.repository.findById(submissionId);
      if (!submission) {
        throw new NotFoundException(`No submission found with id ${submissionId}`);
      }
      if (submission.submissionType !== SubmissionType.ARTICLE) {
        throw new ReviewSubmissionTypeError(SubmissionType.ARTICLE, submission.submissionType);
      }
      const repoInput: ArticleSubmissionApprovedRepositoryInput = {
        reviewNotes: result.reviewNotes,
        reviewedAt: reviewedAt,
        submissionId: submissionId,
        articleData: {
          title: result.normalized.title,
          slug: this.titleToSlug(result.normalized.title),
          summary: result.normalized.summary,
          content: result.normalized.content,
          status: result.publishStatus,
          author: result.normalized.author,
          publishedAt: result.publishStatus === 'PUBLISHED' ? reviewedAt : null,
          topicIds: await this.getTopicIds(result.normalized.topicSlugs),
        },
      };

      const reviewResponse = await this.repository.approveArticleSubmission(repoInput);
      if (!reviewResponse) {
        throw new NotFoundException(`No pending submission found with id ${submissionId}`);
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
    } else if (result.decision === 'APPROVE_EVENT') {
      const submission = await this.repository.findById(submissionId);
      if (!submission) {
        throw new NotFoundException(`No submission found with id ${submissionId}`);
      }
      if (submission.submissionType !== SubmissionType.EVENT) {
        throw new ReviewSubmissionTypeError(SubmissionType.EVENT, submission.submissionType);
      }
      const repoInput: EventSubmissionApprovedRepositoryInput = {
        reviewNotes: result.reviewNotes,
        reviewedAt: reviewedAt,
        submissionId: submissionId,
        eventData: {
          title: result.normalized.title,
          summary: result.normalized.summary,
          description: result.normalized.description,
          eventType: result.normalized.eventType,
          startTime: new Date(result.normalized.startTime),
          endTime: result.normalized.endTime == null ? null : new Date(result.normalized.endTime),
          locationName: result.normalized.locationName,
          addressRaw: result.normalized.addressRaw,
          city: result.normalized.city ?? null,
          region: result.normalized.region ?? null,
          country: result.normalized.country ?? null,
          postalCode: result.normalized.postalCode ?? null,
          website: result.normalized.website ?? null,
          status: result.publishStatus,
          publishedAt: result.publishStatus === 'PUBLISHED' ? reviewedAt : null,
          topicIds: await this.getTopicIds(result.normalized.topicSlugs),
        },
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
    throw new Error('Unexpected moderation review decision');
  }
}
