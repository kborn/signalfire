export type CreateAdminSessionInput = {
  sessionToken: string;
  adminUserId: number;
  expiresAt: Date;
  createdAt: Date;
};

export type UpdateAdminSessionInput = {
  sessionToken: string;
  expiresAt: Date;
  lastUsedAt?: Date;
};
