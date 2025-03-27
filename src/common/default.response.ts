import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Response {
  @Field()
  message: string;

  @Field({ nullable: true })
  data?: string;
}
