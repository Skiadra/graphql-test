import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}
    @Mutation(() => User)
        createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.userService.create(createUserInput);
    }

    @Query(() => [User], { name: 'allUser' })
    findAll() {
        return this.userService.findAll();
    }

    @Query(() => User, { name: 'user' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.userService.findOne(id);
    }

    @ResolveField(() => [User], { nullable: true })
    async parentChain(@Parent() user: User): Promise<User[]> {
        return this.userService.getParentChain(user.id);
    }
}