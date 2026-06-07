import { AdminUser } from '@prisma/client';
import { Request } from 'express';

export interface AdminAuthenticatedRequest extends Request {
  adminUser?: AdminUser;
}
