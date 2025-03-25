import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { UserRole } from 'src/enum/user-role.enum';

@ArgsType()
export class FetchAllUsersByRoleArgs {
  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Int, { nullable: true })
  @Min(0)
  limit?: number;

  @Field(() => Int, { nullable: true })
  @Min(1)
  page?: number;
}
