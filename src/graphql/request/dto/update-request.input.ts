import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class UpdateRequestInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  assignment?: string;

  @Field({ nullable: true })
  faculty?: string;

  @Field({ nullable: true })
  study_program?: string;

  @Field({ nullable: true })
  lecturer?: string;

  @Field({ nullable: true })
  attachment?: string;

  @Field({ nullable: true })
  status?: string;

  @Field(() => ID, { nullable: true })
  requestedId?: number;
}
