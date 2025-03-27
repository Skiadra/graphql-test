import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DefaultResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  data?: string;
}
