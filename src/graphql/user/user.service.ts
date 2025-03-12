import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    async create(createUserInput: CreateUserInput) {
        const { email, password } = createUserInput;
        const user = this.repo.create({ email, password });
        return await this.repo.save(user);
    }
    
    // Fetch all users from the database
    async findAll(): Promise<User[]> {
        return await this.repo.find();
    }

    // Fetch a single user by ID
    async findOne(id: number): Promise<User | null> {
        return await this.repo.findOne({ where: { id } });
    }
}