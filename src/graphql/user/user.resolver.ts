import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { FetchAllUsersArgs } from './dto/fetch-all-users.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { AuthRequest } from '../auth/interface/auth-request.interface';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.userService.create(createUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'me' })
  async me(@Context() context: { req: AuthRequest }): Promise<User | null> {
    const user = context.req.user;
    return await this.userService.findOne(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'allUsers' })
  async findAll(@Args() args: FetchAllUsersArgs): Promise<User[]> {
    return await this.userService.findAll(args);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User | null> {
    return await this.userService.findOne(id);
  }

  @ResolveField(() => [User], { nullable: true })
  async descendant(@Parent() user: User): Promise<User[]> {
    return await this.userService.getDescendant(user.id, 10);
  }

  @ResolveField(() => [User], { nullable: true })
  async ancestor(@Parent() user: User): Promise<User[]> {
    return await this.userService.getAncestor(user.id, 10);
  }
}
