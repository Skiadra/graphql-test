import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { DeleteAnswerInput } from './dto/delete-answer.input';

@Injectable()
export class AnswerService {
  private readonly allRelations: string[];
  constructor(
    @InjectRepository(Answer)
    private repo: Repository<Answer>,
  ) {
    this.allRelations = this.repo.metadata.relations.map(
      (rel) => rel.propertyName,
    );
  }

  async create(
      createAnswerInput: CreateAnswerInput,
      userId: number,
    ): Promise<Answer> {
      const { requestId, ...rest } = createAnswerInput;
  
      const request = this.repo.create({
        ...rest,
        user: { id: userId },
        request: { id: requestId }
      });
  
      return await this.repo.save(request);
    }
  
    async update(
      updateAnswerInput: UpdateAnswerInput,
    ): Promise<Answer | null> {
      const { id, ...rest } = updateAnswerInput;
  
      const result = await this.repo.update(id, {
        ...rest,
      });
  
      if (!result.affected && result.affected == 0) {
        throw new Error('No changes occured');
      }
  
      return await this.findOne(id);
    }
  
    async delete(deleteAnswerInput: DeleteAnswerInput): Promise<boolean> {
      const { id } = deleteAnswerInput;
  
      await this.repo.delete(id);
  
      return true;
    }

  async findAll(): Promise<Answer[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Answer | null> {
    return await this.repo.findOne({
      where: { id },
      relations: this.allRelations,
    });
  }
}
