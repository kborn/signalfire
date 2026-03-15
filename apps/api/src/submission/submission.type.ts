import { SubmissionType } from '@prisma/client';
import { EventType } from '@prisma/client';

export type CreateSubmissionInput = {
  submissionType: SubmissionType;
  title: string;
  summary: string;
  submittedContent: string;
  submitterFirstName: string;
  submitterLastName?: string;
  submitterEmail?: string;
  eventType?: EventType | null;
  startTime?: Date | string | null;
  endTime?: Date | string | null;
  locationName?: string | null;
  addressRaw?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  website?: string | null;
  contactEmail?: string | null;
};
