import { Injectable, PipeTransform } from '@nestjs/common';
import type { AdminLoginRequest } from '@signal-fire/api-contracts';
import { validateAdminLoginRequest } from './admin-auth.validation';

@Injectable()
export class AdminAuthValidationPipe implements PipeTransform {
  transform(value: unknown): AdminLoginRequest {
    return validateAdminLoginRequest(value);
  }
}
