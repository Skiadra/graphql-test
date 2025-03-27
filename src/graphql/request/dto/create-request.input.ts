import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateRequestInput {
  @Field()
  assignment: string;

  @Field()
  faculty: string;

  @Field()
  study_program: string;

  @Field({ nullable: true })
  lecturer?: string;

  @Field({ nullable: true })
  attachment?: string;

  @Field()
  status: string;

  @Field(() => ID)
  requestorId: number;

  @Field(() => ID, { nullable: true })
  requestedId?: number;
}
