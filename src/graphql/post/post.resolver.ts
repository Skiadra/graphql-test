import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './entities/post.entity';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}
  @Mutation(() => Post)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
  ): Promise<Post> {
    return await this.postService.create(createPostInput);
  }

  @Query(() => [Post], { name: 'allPosts' })
  async findAll(): Promise<Post[]> {
    return await this.postService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Post | null> {
    return await this.postService.findOne(id);
  }
}
