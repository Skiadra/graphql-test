import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enum/user-role.enum'; // Update path based on your project structure

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

