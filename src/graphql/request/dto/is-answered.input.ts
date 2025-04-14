import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class IsAnsweredInput {
  @Field(() => Int)
  id: number;
}
