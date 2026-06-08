export type CreateAdminSessionInput = {
  sessionToken: string;
  adminUserId: number;
  expiresAt: Date;
  createdAt: Date;
};

export type ReauthrorizeSessionInput = {
  sessionToken: string;
  expiresAt: Date;
  lastUsedAt: Date;
};
