import { EntityStatus, EventType } from '@prisma/client';

export type CreateAdminEventRepositoryInput = {
  title: string;
  summary: string;
  description: string;
  eventType: EventType;
  startTime: Date;
  endTime: Date | null;
  locationName: string;
  publicLocationDescription: string | null;
  contactEmail: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  website: string | null;
  status: EntityStatus;
  publishedAt: Date | null;
  topicIds: number[];
};

export type UpdateAdminEventRepositoryInput = Omit<
  CreateAdminEventRepositoryInput,
  'publishedAt' | 'topicIds'
> & {
  topicIds: number[];
};
