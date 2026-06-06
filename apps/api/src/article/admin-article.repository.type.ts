import { EntityStatus } from '@prisma/client';

export type CreateAdminArticleRepositoryInput = {
  title: string;
  summary: string;
  slug: string;
  content: string;
  author: string;
  status: EntityStatus;
  publishedAt: Date | null;
  topicIds: number[];
};

export type UpdateAdminArticleRepositoryInput = {
  title: string;
  summary: string;
  content: string;
  author: string;
  status: EntityStatus;
  topicIds: number[];
};
