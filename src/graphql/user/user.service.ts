import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

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
        return await this.repo.find();
    }

    async findOne(id: number): Promise<User | null> {
        return await this.repo.findOne({ where: { id } });
    }

    async getParentChain(userId: number): Promise<User[]> {
        const parents: User[] = [];
        
        let user = await this.repo.findOne({
          where: { id: userId },
          relations: ['parent'],
        });
    
        while (user?.parent) {
          parents.push(user.parent);
          user = await this.repo.findOne({
            where: { id: user.parent.id },
            relations: ['parent'],
          });
        }
    
        return parents;
      }
}