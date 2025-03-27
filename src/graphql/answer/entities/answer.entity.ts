import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Request } from 'src/graphql/request/entities/request.entity';
import { User } from 'src/graphql/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Answer {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  attachment?: string;

  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Request, (request) => request.answers, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'requestId' })
  request: Request;
}
