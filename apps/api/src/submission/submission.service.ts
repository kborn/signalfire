import { Injectable } from '@nestjs/common';
import { SubmissionRepository } from './submission.repository';
import {
  SubmissionRequest,
  EventSubmissionRequest,
  ArticleSubmissionRequest,
  SubmissionResponse,
} from '@signal-fire/api-contracts';
import {
  CreateSubmissionInputCommonFields,
  CreateSubmissionInputEntityFields,
} from './submission.type';
import { Submission, SubmissionType } from '@prisma/client';
import { TopicRepository } from '../topic/topic.repository';

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
    return recs.map((rec) => rec.id);
  }

  async mapCommonRequestFields(req: SubmissionRequest): Promise<CreateSubmissionInputCommonFields> {
    return {
      title: req.payload.title,
      summary: req.payload.summary,
      topicIds: await this.getTopicIds(req.payload.topicSlugs),
      author: req.author,
      submitterName: req.submitter_name,
      submitterEmail: req.submitter_email,
    };
  }

  mapEventSubmissionRequest(req: EventSubmissionRequest): CreateSubmissionInputEntityFields {
    return {
      submissionType: SubmissionType.EVENT,
      resourceLinks: [req.payload.source_link],
      submittedContent: req.payload.description,
      eventType: req.payload.event_type,
      startTime: new Date(req.payload.start_datetime),
      endTime: req.payload.end_datetime ? new Date(req.payload.end_datetime) : null,
      locationName: req.payload.location_name,
      // addressRaw: null TODO why don't we have this?
      // null:location_address_street //TODO why don't we have this?
      city: req.payload.location_address_city,
      region: req.payload.location_address_region,
      postalCode: req.payload.location_address_zip,
      // country: req.payload.lo, TODO why dont we have this?
      // website: req.payload.website, TODO this should be removed
      // contactEmail: req.payload.event_type, TODO why dont we have this?
    };
  }

  mapArticleSubmissionRequest(req: ArticleSubmissionRequest): CreateSubmissionInputEntityFields {
    return {
      submissionType: SubmissionType.ARTICLE,
      submittedContent: req.payload.content,
      resourceLinks: req.payload.source_links,
    };
  }

  async create(submission: SubmissionRequest): Promise<SubmissionResponse> {
    const commonFields = await this.mapCommonRequestFields(submission);
    let fields: CreateSubmissionInputEntityFields;
    if (submission.submission_type === 'EVENT') {
      fields = this.mapEventSubmissionRequest(submission);
    } else {
      fields = this.mapArticleSubmissionRequest(submission);
    }

    const created_submission = await this.repository.create({ ...commonFields, ...fields });
    return { id: created_submission.id };
  }
}
