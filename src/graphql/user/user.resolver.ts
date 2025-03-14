import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { FetchAllUsersArgs } from './dto/fetch-all-users.input';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}
    @Mutation(() => User)
        createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.userService.create(createUserInput);
    }

    @Query(() => [User], { name: 'allUser' })
    async findAll(@Args() args: FetchAllUsersArgs): Promise<User[]> {
        return this.userService.findAll(args)
    }

    @Query(() => User, { name: 'user' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.userService.findOne(id);
    }

    @ResolveField(() => [User], { nullable: true })
    async descendant(@Parent() user: User): Promise<User[]> {
        return this.userService.getDescendant(user.id);
    }

    @ResolveField(() => [User], { nullable: true })
    async ancestor(@Parent() user: User): Promise<User[]> {
        return this.userService.getAncestor(user.id);
    }
}