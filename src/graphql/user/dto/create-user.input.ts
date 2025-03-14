import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
    @Field()
    email: string;
    
    @Field()
    password: string;

    @Field(() => Int, { nullable: true })
    parentId?: number;
}