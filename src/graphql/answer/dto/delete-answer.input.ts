import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class DeleteAnswerInput {
  @Field(() => Int)
  id: number;
}
