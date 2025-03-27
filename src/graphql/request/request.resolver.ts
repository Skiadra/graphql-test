import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { RequestService } from './request.service';
import { CreateRequestInput } from './dto/create-request.input';
import { Request } from './entities/request.entity';
import { AuthRequest } from '../user/auth/interface/auth-request.interface';
import { GqlAuthGuard } from '../user/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../user/auth/gql-role.guard';
import { Roles } from 'src/decorator/role.decorator';
import { UserRole } from '@enum/user-role.enum';
import { UpdateRequestInput } from './dto/update-request.input';
import { DeleteRequestInput } from './dto/delete-request.input';
import { Response } from 'src/common/default.response';

@Resolver(() => Request)
export class RequestResolver {
  constructor(private readonly RequestService: RequestService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Request)
  async create(
    @Args('createRequestInput') createRequestInput: CreateRequestInput,
    @Context() context: { req: AuthRequest },
  ): Promise<Request> {
    const userId = context.req.user.userId;
    if (!userId) {
      throw new Error('User not found');
    }

    return await this.RequestService.create(createRequestInput, userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Request)
  async update(
    @Args('updateRequestInput') updateRequestInput: UpdateRequestInput,
    @Context() context: { req: AuthRequest },
  ): Promise<Request> {
    const userId = context.req.user.userId;
    const request = await this.RequestService.findOne(updateRequestInput.id);
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.requestor.id != userId) {
      throw new Error('Unauthenticated');
    }

    const result = await this.RequestService.update(updateRequestInput);

    if (!result) {
      throw new Error('No request found');
    }

    return result;
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Mutation(() => Response)
  async delete(
    @Args('deleteRequestInput') deleteRequestInput: DeleteRequestInput,
    @Context() context: { req: AuthRequest },
  ) {
    const userId = context.req.user.userId;
    const request = await this.RequestService.findOne(deleteRequestInput.id);
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.requestor.id != userId) {
      throw new Error('Unauthenticated');
    }

    const result = await this.RequestService.delete(deleteRequestInput);

    return {
      message: result
        ? 'Request deleted successfully'
        : 'Failed to delete request',
    };
  }

  @Query(() => [Request], { name: 'allRequests' })
  async findAll(): Promise<Request[]> {
    return await this.RequestService.findAll();
  }

  @Query(() => Request, { name: 'Request' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Request | null> {
    return await this.RequestService.findOne(id);
  }
}
