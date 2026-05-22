import { EventType } from './common.types.js';
import { TopicSummary } from './common.types.js';

export type SubmissionType = 'ARTICLE' | 'EVENT';
export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type EntityStatus = 'DRAFT' | 'PUBLISHED';

type SubmissionRequestCommon = {
  submissionType: SubmissionType;
  author?: string | null;
  submitterName?: string | null;
  submitterEmail?: string | null;
};

type SubmissionRequestArticlePayload = {
  title: string;
  summary: string;
  content: string;
  topicSlugs: string[];
  resourceLinks?: string[] | null;
};

type SubmissionRequestEventPayload = {
  title: string;
  summary: string;
  description: string;
  eventType: EventType;
  startTime: string;
  endTime?: string | null;
  locationName: string;
  publicLocationDescription?: string | null;
  locationAddressLine1?: string | null;
  locationAddressLine2?: string | null;
  locationAddressCity: string;
  locationAddressRegion: string;
  locationAddressCountry: string;
  locationAddressZip?: string | null;
  contactEmail?: string | null;
  topicSlugs: string[];
  websiteUrl?: string | null;
};

export type ArticleSubmissionRequest = SubmissionRequestCommon & {
  submissionType: 'ARTICLE';
  payload: SubmissionRequestArticlePayload;
};

export type EventSubmissionRequest = SubmissionRequestCommon & {
  submissionType: 'EVENT';
  payload: SubmissionRequestEventPayload;
};

export type SubmissionRequest = ArticleSubmissionRequest | EventSubmissionRequest;

type ValidationError = {
  field?: string;
  message: string;
};
export type SubmissionResponseSuccess = {
  id: number;
};

export type SubmissionResponseError = {
  errors: ValidationError[];
};

export type SubmissionResponse = SubmissionResponseSuccess | SubmissionResponseError;

export type ModerationSubmissionList = {
  items: ModerationSubmissionSummary[];
};

export type ModerationSubmissionListFilters = {
  status?: SubmissionStatus;
  submissionType?: SubmissionType;
};

export type ModerationSubmissionSummary = {
  id: number;
  submissionType: SubmissionType;
  status: SubmissionStatus;
  title: string;
  summary: string;
  submittedAt: string;
  submitterName: string | null;
  submitterEmail: string | null;
};

export type ModerationSubmissionDetail =
  | {
      id: number;
      submissionType: 'ARTICLE';
      status: SubmissionStatus;
      submittedAt: string;
      submitterName: string | null;
      submitterEmail: string | null;
      reviewedAt: string | null;
      reviewNotes: string | null;
      submittedContent: {
        title: string;
        summary: string;
        content: string;
        topics: TopicSummary[];
        resourceLinks: string[];
        author: string | null;
      };
    }
  | {
      id: number;
      submissionType: 'EVENT';
      status: SubmissionStatus;
      submittedAt: string;
      submitterName: string | null;
      submitterEmail: string | null;
      reviewNotes: string | null;
      reviewedAt: string | null;
      submittedContent: {
        title: string;
        summary: string;
        description: string;
        eventType: EventType;
        startTime: string;
        endTime: string | null;
        locationName: string;
        publicLocationDescription: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string;
        region: string;
        country: string;
        postalCode: string | null;
        website: string | null;
        contactEmail: string | null;
        topics: TopicSummary[];
      };
    };

export type ModerationReviewDecision = 'REJECT' | 'APPROVE_ARTICLE' | 'APPROVE_EVENT';

export type ArticleApprovalPayload = {
  title: string;
  summary: string;
  content: string;
  topicSlugs: string[];
  author: string;
};

export type EventApprovalPayload = {
  title: string;
  summary: string;
  description: string;
  eventType: EventType;
  startTime: string;
  endTime?: string | null;
  locationName: string;
  publicLocationDescription?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  website?: string | null;
  contactEmail?: string | null;
  topicSlugs: string[];
};

export type ModerationReviewRejectRequest = {
  decision: 'REJECT';
  reviewNotes?: string | null;
};

export type ModerationReviewApproveArticleRequest = {
  decision: 'APPROVE_ARTICLE';
  reviewNotes?: string | null;
  publishStatus: EntityStatus;
  normalized: ArticleApprovalPayload;
};

export type ModerationReviewApproveEventRequest = {
  decision: 'APPROVE_EVENT';
  reviewNotes?: string | null;
  publishStatus: EntityStatus;
  normalized: EventApprovalPayload;
};

export type ModerationReviewRequest =
  | ModerationReviewRejectRequest
  | ModerationReviewApproveArticleRequest
  | ModerationReviewApproveEventRequest;

export type ModerationReviewResponse = ModerationReviewSuccess | ModerationReviewError;

export type ModerationReviewSuccess = {
  submissionId: number;
  status: 'APPROVED' | 'REJECTED';
  reviewedAt: string;
  createdRecord?: {
    recordType: 'ARTICLE' | 'EVENT';
    id: number;
    slug?: string;
    publishStatus: EntityStatus;
  };
};

export type ModerationReviewError = {
  errors: ValidationError[];
};
