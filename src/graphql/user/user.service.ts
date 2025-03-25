import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { FetchAllUsersArgs } from './dto/fetch-all-users.input';
import * as bcrypt from 'bcryptjs';
import { FetchAllUsersByRoleArgs } from './dto/fetch-by-role.input';

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
    const { password, ...rest } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.repo.create({
      ...rest,
      password: hashedPassword,
    });

    // if (parentId) {
    //   const parent = await this.repo.findOne({ where: { id: parentId } });
    //   if (parent) {
    //     user.parent = parent;
    //   }
    // }
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

  async findAllByRole(args: FetchAllUsersByRoleArgs): Promise<User[]> {
    const page = args.page ?? 1;
    const limit = args.limit ?? 5;
    const role = args.role;

    return await this.repo.find({
      where: { role },
      take: limit,
      skip: (page - 1) * limit,
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
}
