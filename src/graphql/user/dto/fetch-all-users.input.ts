import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@ArgsType()
export class FetchAllUsersArgs {
  @Field(() => Int, { nullable: true })
  @Min(0)
  limit?: number;

  @Field(() => Int, { nullable: true })
  @Min(1)
  page?: number;
}
