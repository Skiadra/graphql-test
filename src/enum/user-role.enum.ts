import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  JOKI = 'JOKI',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Different roles a user can have',
});
