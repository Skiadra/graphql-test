import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FetchAllAnswersArgs {
  @Field(() => Int)
  id?: number;
}