import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAnswerInput {
  @Field(() => Int)
  id: number;

  @Field()
  description?: string;

  @Field({ nullable: true })
  attachment?: string;
  
}
