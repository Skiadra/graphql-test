import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../graphql/user/entities/user.entity';
import { Post } from '../graphql/post/entities/post.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async seed() {
    console.log('Starting seeding process...');

    await this.postRepository.delete({});
    await this.userRepository.delete({});

    const user1 = this.userRepository.create({
      email: 'user1@example.com',
      password: 'password',
    });
    await this.userRepository.save(user1);

    const user2 = this.userRepository.create({
      email: 'user2@example.com',
      password: 'password',
      parent: user1,
    });
    await this.userRepository.save(user2);

    const user3 = this.userRepository.create({
      email: 'user3@example.com',
      password: 'password',
      parent: user2,
    });
    await this.userRepository.save(user3);


    const post1 = this.postRepository.create({
      title: 'First Post',
      content: 'This is the first post.',
      user: user1,
    });

    const post2 = this.postRepository.create({
      title: 'Second Post',
      content: 'This is the second post.',
      user: user2,
    });

    await this.postRepository.save([post1, post2]);

    console.log('Seeding complete.');
  }
}