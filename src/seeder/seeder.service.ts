import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../graphql/user/entities/user.entity';
import { Post } from '../graphql/post/entities/post.entity';
import { Comment } from 'src/graphql/comment/entities/comment.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async seed() {
    console.log('Starting seeding process...');

    await this.postRepository.delete({});
    await this.userRepository.delete({});
    await this.commentRepository.delete({});

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
    
    const user4 = this.userRepository.create({
      email: 'user4@example.com',
      password: 'password',
      parent: user3,
    });
    await this.userRepository.save(user4);
    
    const user5 = this.userRepository.create({
      email: 'user5@example.com',
      password: 'password',
      parent: user4,
    });
    await this.userRepository.save(user5);
    
    const user6 = this.userRepository.create({
      email: 'user6@example.com',
      password: 'password',
      parent: user5,
    });
    await this.userRepository.save(user6);
    
    const user7 = this.userRepository.create({
      email: 'user7@example.com',
      password: 'password',
      parent: user6,
    });
    await this.userRepository.save(user7);
    
    const user8 = this.userRepository.create({
      email: 'user8@example.com',
      password: 'password',
      parent: user7,
    });
    await this.userRepository.save(user8);
    
    const user9 = this.userRepository.create({
      email: 'user9@example.com',
      password: 'password',
      parent: user8,
    });
    await this.userRepository.save(user9);
    
    const user10 = this.userRepository.create({
      email: 'user10@example.com',
      password: 'password',
      parent: user9,
    });
    await this.userRepository.save(user10);

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

    const comment1 = this.commentRepository.create({
      content: 'This is the first comment for first post.',
      user: user2,
      post: post1
    });

    await this.commentRepository.save(comment1);

    console.log('Seeding complete.');
  }
}