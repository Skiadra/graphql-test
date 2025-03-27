import { Resolver, Query, Args, Int, Mutation, Context } from '@nestjs/graphql';
import { Answer } from './entities/answer.entity';
import { AnswerService } from './answer.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../user/auth/gql-role.guard';
import { GqlAuthGuard } from '../user/auth/gql-auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { UserRole } from '@enum/user-role.enum';
import { CreateAnswerInput } from './dto/create-answer.input';
import { AuthRequest } from '../user/auth/interface/auth-request.interface';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { DeleteAnswerInput } from './dto/delete-answer.input';
import { DefaultResponse } from 'src/common/default.response';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(
    private readonly answerService: AnswerService,
  ) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.JOKI)
  @Mutation(() => Answer)
  async create(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
    @Context() context: { req: AuthRequest },
  ): Promise<Answer> {
    const userId = context.req.user.userId;
    if (!userId) {
      throw new Error('User not found');
    }

    return await this.answerService.create(createAnswerInput, userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.JOKI)
  @Mutation(() => Answer)
  async update(
    @Args('updateAnswerInput') updateAnswerInput: UpdateAnswerInput,
    @Context() context: { req: AuthRequest },
  ): Promise<Answer> {
    const userId = context.req.user.userId;
    const answer = await this.answerService.findOne(updateAnswerInput.id);
    if (!answer) {
      throw new Error('Answer not found');
    }

    if (answer.user.id != userId) {
      throw new Error('Unauthenticated');
    }

    const result = await this.answerService.update(updateAnswerInput);

    if (!result) {
      throw new Error('No Answer found');
    }

    return result;
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.JOKI)
  @Mutation(() => DefaultResponse)
  async delete(
    @Args('deleteAnswerInput') deleteAnswerInput: DeleteAnswerInput,
    @Context() context: { req: AuthRequest },
  ) {
    const userId = context.req.user.userId;
    const Answer = await this.answerService.findOne(deleteAnswerInput.id);
    if (!Answer) {
      throw new Error('Answer not found');
    }

    if (Answer.user.id != userId) {
      throw new Error('Unauthenticated');
    }

    const result = await this.answerService.delete(deleteAnswerInput);

    return {
      message: result
        ? 'Answer deleted successfully'
        : 'Failed to delete Answer',
    };
  }

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
