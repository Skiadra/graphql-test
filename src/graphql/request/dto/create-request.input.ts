import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateRequestInput {
  @Field()
  assignment: string;

  @Field()
  faculty: string;

  @Field()
  study_program: string;

  @Field()
  lecturer: string;

  @Field({ nullable: true })
  attachment?: string;

  @Field()
  status: string;

  @Field(() => ID)
  requestorId: number; // Foreign key reference to requestor (User)

  @Field(() => ID, { nullable: true })
  requestedId?: number; // Foreign key reference to requested user (optional)
}
