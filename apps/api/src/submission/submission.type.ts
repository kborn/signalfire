import { SubmissionType } from '@prisma/client';
import { EventType } from '@prisma/client';

export type CreateSubmissionInputCommonFields = {
  title: string;
  summary: string;
  topicIds: number[];
  author?: string | null;
  submitterName?: string | null;
  submitterEmail?: string | null;
};

export type CreateSubmissionInputEntityFields = {
  resourceLinks?: string[] | null;
  submissionType: SubmissionType;
  submittedContent: string;
  eventType?: EventType | null;
  startTime?: Date | null;
  endTime?: Date | null;
  locationName?: string | null;
  addressRaw?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  website?: string | null;
  contactEmail?: string | null;
};

export type CreateSubmissionInput = CreateSubmissionInputCommonFields &
  CreateSubmissionInputEntityFields;
