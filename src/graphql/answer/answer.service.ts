import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';

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
