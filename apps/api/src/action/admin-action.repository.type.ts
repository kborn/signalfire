import { ActionType } from '@signal-fire/api-contracts';
import { EntityStatus } from '@prisma/client';

export type CreateAdminActionRepositoryInput = {
  title: string;
  summary: string;
  slug: string;
  description: string;
  actionType: ActionType;
  status: EntityStatus;
  publishedAt: Date | null;
  topicIds: number[];
};

export type UpdateAdminActionRepositoryInput = {
  title: string;
  summary: string;
  description: string;
  actionType: ActionType;
  status: EntityStatus;
  topicIds: number[];
};

export type AdminActionResponse = {
  id: number;
  slug: string;
};
