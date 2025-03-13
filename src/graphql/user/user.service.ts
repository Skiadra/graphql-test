import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly allRelations: string[];
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>
  ) {
    // Initialize the class variable with all relations
    this.allRelations = this.repo.metadata.relations.map((rel) => rel.propertyName);
  }

  async create(createUserInput: CreateUserInput) {
    const { email, password, parentId } = createUserInput;
    const user = this.repo.create({ email, password });

    if (parentId) {
        const parent = await this.repo.findOne({ where: { id: parentId } });
        if (parent) {
            user.parent = parent;
        }
    }
    return await this.repo.save(user);
  }
  
  async findAll(): Promise<User[]> {
    return await this.repo.find({
      relations: this.allRelations,
    });
  }

  async findOne(id: number): Promise<User | null> {
    return await this.repo.findOne({ 
      where: { id },
      relations: this.allRelations,
    });
  }

  async getDescendantChain(userId: number): Promise<User[]> {
    const descendants = await this.repo.query(
      `WITH RECURSIVE descendants AS (
          SELECT * FROM user WHERE id = ? -- Start with the given user ID
          UNION ALL
          SELECT u.* FROM user u
          INNER JOIN descendants d ON u.parentId = d.id -- Recursive join
      ) 
      SELECT * FROM descendants WHERE id != ?;`,
      [userId, userId]
    );
  
    return descendants;
  }

  async getParentChain(userId: number): Promise<User[]> {
    const parents = await this.repo.query(
      `WITH RECURSIVE parent_chain AS (
          SELECT * FROM user WHERE id = ? -- Start with the given user
          UNION ALL
          SELECT u.* FROM user u
          INNER JOIN parent_chain p ON u.id = p.parentId -- Recursive join
      ) 
      SELECT * FROM parent_chain WHERE id != ?;`,
      [userId, userId]
    );
   
    return parents;
  }
}