import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../user/entities/user.entity';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: UserRole[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
