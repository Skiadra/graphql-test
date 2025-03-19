import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [Comment], { name: 'allComments' })
  async findAll(): Promise<Comment[]> {
    return this.commentService.findAll();
  }

  @Query(() => Comment, { name: 'comment' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Comment | null> {
    return this.commentService.findOne(id);
  }
}
