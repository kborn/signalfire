import { EventType } from './common.types.js';
import { TopicSummary } from './common.types.js';

export type SubmissionType = 'ARTICLE' | 'EVENT';
export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

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
  startDatetime: string;
  endDatetime?: string | null;
  locationName: string;
  locationAddressStreet?: string | null;
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
  field: string;
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
      reviewedAt: string | null;
      submittedContent: {
        title: string;
        summary: string;
        description: string;
        eventType: EventType;
        startTime: string;
        endTime: string | null;
        locationName: string;
        addressRaw: string | null;
        city: string;
        region: string;
        country: string;
        postalCode: string | null;
        website: string | null;
        contactEmail: string | null;
        topics: TopicSummary[];
      };
    };
