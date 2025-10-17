import { UserRole } from '@enum/user-role.enum';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  role: UserRole;
}
