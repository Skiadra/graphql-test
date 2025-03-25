import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../graphql/user/entities/user.entity';
import { Request } from '../graphql/request/entities/request.entity';
import { Answer } from 'src/graphql/answer/entities/answer.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  // constructor(
  //   @InjectRepository(User)
  //   private readonly userRepository: Repository<User>,
  //   @InjectRepository(Request)
  //   private readonly requestRepository: Repository<Request>,
  //   @InjectRepository(Comment)
  //   private readonly commentRepository: Repository<Comment>,
  // ) {}
  // async seed(): Promise<void> {
  //   console.log('Starting seeding process...');
  //   await this.requestRepository.delete({});
  //   await this.userRepository.delete({});
  //   await this.commentRepository.delete({});
  //   const hashedPassword = await bcrypt.hash('password', 10);
  //   const user1 = this.userRepository.create({
  //     username: 'user1',
  //     email: 'user1@example.com',
  //     password: hashedPassword,
  //   });
  //   await this.userRepository.save(user1);
  //   const user2 = this.userRepository.create({
  //     username: 'user2',
  //     email: 'user2@example.com',
  //     password: hashedPassword,
  //     parent: user1,
  //   });
  //   await this.userRepository.save(user2);
  //   const user3 = this.userRepository.create({
  //     username: 'user3',
  //     email: 'user3@example.com',
  //     password: hashedPassword,
  //     parent: user2,
  //   });
  //   await this.userRepository.save(user3);
  //   const user4 = this.userRepository.create({
  //     username: 'user4',
  //     email: 'user4@example.com',
  //     password: hashedPassword,
  //     parent: user3,
  //   });
  //   await this.userRepository.save(user4);
  //   const user5 = this.userRepository.create({
  //     username: 'user5',
  //     email: 'user5@example.com',
  //     password: hashedPassword,
  //     parent: user4,
  //   });
  //   await this.userRepository.save(user5);
  //   const user6 = this.userRepository.create({
  //     username: 'user6',
  //     email: 'user6@example.com',
  //     password: hashedPassword,
  //     parent: user5,
  //   });
  //   await this.userRepository.save(user6);
  //   const user7 = this.userRepository.create({
  //     username: 'user7',
  //     email: 'user7@example.com',
  //     password: hashedPassword,
  //     parent: user6,
  //   });
  //   await this.userRepository.save(user7);
  //   const user8 = this.userRepository.create({
  //     username: 'user8',
  //     email: 'user8@example.com',
  //     password: hashedPassword,
  //     parent: user7,
  //   });
  //   await this.userRepository.save(user8);
  //   const user9 = this.userRepository.create({
  //     username: 'user9',
  //     email: 'user9@example.com',
  //     password: hashedPassword,
  //     parent: user8,
  //   });
  //   await this.userRepository.save(user9);
  //   const user10 = this.userRepository.create({
  //     username: 'user10',
  //     email: 'user10@example.com',
  //     password: hashedPassword,
  //     parent: user9,
  //   });
  //   await this.userRepository.save(user10);
  //   // const request1 = this.requestRepository.create({
  //   //   title: 'First Request',
  //   //   content: 'This is the first Request.',
  //   //   user: user1,
  //   // });
  //   // const request2 = this.requestRepository.create({
  //   //   title: 'Second Request',
  //   //   content: 'This is the second Request.',
  //   //   user: user2,
  //   // });
  //   await this.requestRepository.save([request1, request2]);
  //   const comment1 = this.commentRepository.create({
  //     content: 'This is the first comment for first Request.',
  //     user: user2,
  //     request: request1,
  //   });
  //   await this.commentRepository.save(comment1);
  //   console.log('Seeding complete.');
  // }
}
