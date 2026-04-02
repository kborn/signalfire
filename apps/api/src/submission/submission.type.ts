import { SubmissionType } from '@prisma/client';
import { EventType } from '@prisma/client';

export type CreateSubmissionInput = {
  submissionType: SubmissionType;
  title: string;
  summary: string;
  submittedContent: string;
  topicIds: number[];
  author?: string | null;
  submitterName?: string;
  submitterEmail?: string;
  resourceLinks?: string[] | null;
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
