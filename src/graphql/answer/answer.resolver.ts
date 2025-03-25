import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Answer } from './entities/answer.entity';
import { AnswerService } from './answer.service';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Query(() => [Answer], { name: 'allAnswers' })
  async findAll(): Promise<Answer[]> {
    return await this.answerService.findAll();
  }

  @Query(() => Answer, { name: 'answer' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Answer | null> {
    return await this.answerService.findOne(id);
  }
}
