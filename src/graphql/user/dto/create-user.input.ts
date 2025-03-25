import { InputType, Int, Field } from '@nestjs/graphql';
import { UserRole } from 'src/enum/user-role.enum';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  wallet?: string;

  @Field()
  description: string;

  @Field(() => UserRole, { nullable: true, defaultValue: UserRole.USER })
  role: UserRole;
}
