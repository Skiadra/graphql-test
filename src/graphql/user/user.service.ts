import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { FetchAllUsersArgs } from './dto/fetch-all-users.input';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly allRelations: string[];
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {
    // Initialize the class variable with all relations
    this.allRelations = this.repo.metadata.relations.map(
      (rel) => rel.propertyName,
    );
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { username, email, password, parentId } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.repo.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    if (parentId) {
      const parent = await this.repo.findOne({ where: { id: parentId } });
      if (parent) {
        user.parent = parent;
      }
    }
    return await this.repo.save(user);
  }

  async findAll(args: FetchAllUsersArgs): Promise<User[]> {
    const page = args.page ?? 1;
    const limit = args.limit ?? 5;

    return await this.repo.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: this.allRelations,
    });
  }

  async findOne(id: number): Promise<User | null> {
    return await this.repo.findOne({
      where: { id },
      relations: this.allRelations,
    });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password') // Ensure password is retrieved
      .where('user.username = :username', { username })
      .getOneOrFail();
  }

  // CTE For efficient recursive

  async getDescendant(userId: number, limit: number): Promise<User[]> {
    const descendants: User[] = (await this.repo.query(
      `WITH RECURSIVE descendants AS (
          SELECT *, 1 AS level FROM user WHERE id = ? -- Start with the given user ID
          UNION ALL
          SELECT u.*, d.level + 1 FROM user u
          INNER JOIN descendants d ON u.parentId = d.id -- Recursive join
          WHERE d.level < ?
      ) 
      SELECT * FROM descendants WHERE id != ?;`,
      [userId, userId, limit],
    )) as User[];

    return descendants;
  }

  async getAncestor(userId: number, limit: number): Promise<User[]> {
    const parents: User[] = (await this.repo.query(
      `WITH RECURSIVE ancestor AS (
          SELECT *, 1 AS level FROM user WHERE id = ? -- Start with the given user
          UNION ALL
          SELECT u.*, a.level + 1 FROM user u
          INNER JOIN ancestor a ON u.id = a.parentId -- Recursive join
          WHERE a.level < ?
      ) 
      SELECT * FROM ancestor WHERE id != ?;`,
      [userId, userId, limit],
    )) as User[];

    return parents;
  }
}
