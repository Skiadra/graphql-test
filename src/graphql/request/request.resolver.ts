import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RequestService } from './request.service';
import { CreateRequestInput } from './dto/create-request.input';
import { Request } from './entities/request.entity';

@Resolver(() => Request)
export class RequestResolver {
  constructor(private readonly RequestService: RequestService) {}
  @Mutation(() => Request)
  async createRequest(
    @Args('createRequestInput') createRequestInput: CreateRequestInput,
  ): Promise<Request> {
    return await this.RequestService.create(createRequestInput);
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
