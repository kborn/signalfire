import { EntityStatus, EventType, SubmissionStatus, SubmissionType } from '@prisma/client';

export type CreateSubmissionRepositoryInputCommonFields = {
  title: string;
  summary: string;
  topicIds: number[];
  author?: string | null;
  submitterName?: string | null;
  submitterEmail?: string | null;
};

export type CreateSubmissionRepositoryInputEntityFields = {
  resourceLinks?: string[] | null;
  submissionType: SubmissionType;
  submittedContent: string;
  eventType?: EventType | null;
  startTime?: Date | null;
  endTime?: Date | null;
  locationName?: string | null;
  publicLocationDescription?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  website?: string | null;
  contactEmail?: string | null;
};

export type CreateSubmissionRepositoryInput = CreateSubmissionRepositoryInputCommonFields &
  CreateSubmissionRepositoryInputEntityFields;

export type FindModerationSubmissionsInput = {
  status?: SubmissionStatus;
  submissionType?: SubmissionType;
};

export type CommonSubmissionRepositoryInput = {
  submissionId: number;
  reviewNotes?: string | null;
  reviewedAt: Date;
};

export type RejectSubmissionRepositoryInput = CommonSubmissionRepositoryInput;

export type ApproveArticleSubmissionRepositoryInput = {
  articleData: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    status: EntityStatus;
    author: string;
    publishedAt: Date | null;
    topicIds: number[];
  };
};

export type ArticleSubmissionApprovedRepositoryInput = CommonSubmissionRepositoryInput &
  ApproveArticleSubmissionRepositoryInput;

export type ApproveEventSubmissionRepositoryInput = {
  eventData: {
    title: string;
    summary: string;
    description: string;
    eventType: EventType;
    startTime: Date;
    endTime: Date | null;
    locationName: string;
    publicLocationDescription: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    region: string | null;
    country: string | null;
    postalCode: string | null;
    website: string | null;
    status: EntityStatus;
    publishedAt: Date | null;
    topicIds: number[];
  };
};

export type EventSubmissionApprovedRepositoryInput = CommonSubmissionRepositoryInput &
  ApproveEventSubmissionRepositoryInput;
