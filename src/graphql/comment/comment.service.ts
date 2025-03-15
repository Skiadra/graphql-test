import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
    private readonly allRelations: string[];
    constructor(
        @InjectRepository(Comment)
        private repo: Repository<Comment>
    ) {
        this.allRelations = this.repo.metadata.relations.map((rel) => rel.propertyName);
    }
  
    async findAll(): Promise<Comment[]> {
        return await this.repo.find();
    }

    async findOne(id: number): Promise<Comment | null> {
        return await this.repo.findOne({ 
            where: { id },
            relations: this.allRelations,
        });
    }
}