import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  private readonly allRelations: string[];
  constructor(
    @InjectRepository(Post)
    private repo: Repository<Post>,
  ) {
    this.allRelations = this.repo.metadata.relations.map(
      (rel) => rel.propertyName,
    );
  }

  async create(createPostInput: CreatePostInput) {
    const { title, content } = createPostInput;
    const user = this.repo.create({ title, content });
    return await this.repo.save(user);
  }

  // Fetch all posts from the database
  async findAll(): Promise<Post[]> {
    return await this.repo.find();
  }

  // Fetch a single post by ID
  async findOne(id: number): Promise<Post | null> {
    return await this.repo.findOne({
      where: { id },
      relations: this.allRelations,
    });
  }
}
