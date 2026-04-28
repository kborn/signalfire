import { EventType } from './common.types.js';

export type SubmissionType = 'ARTICLE' | 'EVENT';

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
  contactEmail?: string | null; //  add me?
  topicSlugs: string[];
  resourceLinks?: string[] | null;
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
