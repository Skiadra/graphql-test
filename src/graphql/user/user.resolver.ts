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
import { GqlAuthGuard } from './auth/gql-auth.guard';
import { AuthRequest } from './auth/interface/auth-request.interface';
import { RolesGuard } from './auth/gql-role.guard';
import { Roles } from 'src/decorator/role.decorator';
import { UserRole } from 'src/enum/user-role.enum';
import { FetchAllUsersByRoleArgs } from './dto/fetch-by-role.input';
import { Answer } from '../answer/entities/answer.entity';
import { Request } from '../request/entities/request.entity';

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

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Query(() => [User], { name: 'allUsers' })
  async findAll(@Args() args: FetchAllUsersArgs): Promise<User[]> {
    return await this.userService.findAll(args);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User | null> {
    return await this.userService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [User], { name: 'usersByRole' })
  async findAllByRole(@Args() args: FetchAllUsersByRoleArgs): Promise<User[]> {
    return await this.userService.findAllByRole(args);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Request], { name: 'myRequests' })
  async getMyRequest(
    @Context() context: { req: AuthRequest },
  ): Promise<Request[]> {
    const userId = context.req.user.userId; // From JWT/auth
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user.requests;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Answer], { name: 'myAnswers' })
  async getMyAnswers(
    @Context() context: { req: AuthRequest },
  ): Promise<Answer[]> {
    const userId = context.req.user.userId; // From JWT/auth
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user.answers;
  }
}
