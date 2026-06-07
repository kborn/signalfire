import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminUser } from '@prisma/client';
import { AdminAuthenticatedRequest } from './admin-auth.request';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AdminUser | undefined => {
    const request = context.switchToHttp().getRequest<AdminAuthenticatedRequest>();
    return request.adminUser;
  },
);
