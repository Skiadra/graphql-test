import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class DeleteRequestInput {
  @Field(() => Int)
  id: number;
}
