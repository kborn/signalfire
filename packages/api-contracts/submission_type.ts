import { EventType } from './common.types.js';

export type SubmissionType = 'ARTICLE' | 'EVENT';

type SubmissionRequestCommon = {
  submission_type: SubmissionType;
  author: string | null;
  submitter_name: string | null;
  submitter_email: string | null;
};

type SubmissionRequestArticlePayload = {
  title: string;
  summary: string;
  content: string;
  topicSlugs: string[];
  source_links?: string[] | null;
};

type SubmissionRequestEventPayload = {
  title: string;
  summary: string;
  description: string;
  event_type: EventType;
  start_datetime: string;
  end_datetime: string | null;
  location_name: string;
  location_address_street?: string | null;
  location_address_city: string;
  location_address_region: string;
  location_address_state?: string | null;
  location_address_zip?: string | null;
  topicSlugs: string[];
  source_link: string;
};

type ArticleSubmissionRequest = SubmissionRequestCommon & {
  submission_type: 'ARTICLE';
  payload: SubmissionRequestArticlePayload;
};

type EventSubmissionRequest = SubmissionRequestCommon & {
  submission_type: 'EVENT';
  payload: SubmissionRequestEventPayload;
};

export type SubmissionRequest = ArticleSubmissionRequest | EventSubmissionRequest;

type ValidationError = {
  field: string;
  message: string;
};
type SubmissionResponseSuccess = {
  id: number;
};

type SubmissionResponseError = {
  errors: ValidationError[];
};

export type SubmissionResponse = SubmissionResponseSuccess | SubmissionResponseError;
