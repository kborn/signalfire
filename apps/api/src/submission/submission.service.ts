import { Injectable } from '@nestjs/common';
import { SubmissionRepository } from './submission.repository';
import {
  SubmissionRequest,
  EventSubmissionRequest,
  ArticleSubmissionRequest,
  SubmissionResponseSuccess,
} from '@signal-fire/api-contracts';
import {
  CreateSubmissionRepositoryInputCommonFields,
  CreateSubmissionRepositoryInputEntityFields,
} from './submission.repository.types';
import { SubmissionType } from '@prisma/client';
import { TopicRepository } from '../topic/topic.repository';
import { UnknownSubmissionTopicsError } from './submission.error';

@Injectable()
export class SubmissionService {
  constructor(
    private repository: SubmissionRepository,
    private topicRepository: TopicRepository,
  ) {}

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

  mapEventSubmissionRequest(
    req: EventSubmissionRequest,
  ): CreateSubmissionRepositoryInputEntityFields {
    return {
      submissionType: SubmissionType.EVENT,
      submittedContent: req.payload.description,
      eventType: req.payload.eventType,
      startTime: new Date(req.payload.startTime),
      endTime: req.payload.endTime ? new Date(req.payload.endTime) : null,
      locationName: req.payload.locationName,
      publicLocationDescription: req.payload.publicLocationDescription,
      addressLine1: req.payload.locationAddressLine1,
      addressLine2: req.payload.locationAddressLine2,
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
}
