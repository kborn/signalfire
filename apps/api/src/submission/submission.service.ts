import { Injectable } from '@nestjs/common';
import { SubmissionRepository } from './submission.repository';
import {
  SubmissionRequest,
  EventSubmissionRequest,
  ArticleSubmissionRequest,
  SubmissionResponseSuccess,
} from '@signal-fire/api-contracts';
import {
  CreateSubmissionInputCommonFields,
  CreateSubmissionInputEntityFields,
} from './submission.type';
import { Submission, SubmissionType } from '@prisma/client';
import { TopicRepository } from '../topic/topic.repository';
import { UnknownSubmissionTopicsError } from './submission.error';

@Injectable()
export class SubmissionService {
  constructor(
    private repository: SubmissionRepository,
    private topicRepository: TopicRepository,
  ) {}

  getPendingSubmissions(): Promise<Submission[]> {
    return this.repository.findPending();
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

  async mapCommonRequestFields(req: SubmissionRequest): Promise<CreateSubmissionInputCommonFields> {
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

  mapEventSubmissionRequest(req: EventSubmissionRequest): CreateSubmissionInputEntityFields {
    return {
      submissionType: SubmissionType.EVENT,
      resourceLinks: req.payload.resourceLinks,
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
      contactEmail: req.payload.contactEmail,
    };
  }

  mapArticleSubmissionRequest(req: ArticleSubmissionRequest): CreateSubmissionInputEntityFields {
    return {
      submissionType: SubmissionType.ARTICLE,
      submittedContent: req.payload.content,
      resourceLinks: req.payload.resourceLinks,
    };
  }

  async create(submission: SubmissionRequest): Promise<SubmissionResponseSuccess> {
    const commonFields = await this.mapCommonRequestFields(submission);
    let fields: CreateSubmissionInputEntityFields;
    if (submission.submissionType === 'EVENT') {
      fields = this.mapEventSubmissionRequest(submission);
    } else {
      fields = this.mapArticleSubmissionRequest(submission);
    }

    const created_submission = await this.repository.create({ ...commonFields, ...fields });
    return { id: created_submission.id };
  }
}
