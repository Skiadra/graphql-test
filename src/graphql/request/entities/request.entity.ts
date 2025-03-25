import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/graphql/answer/entities/answer.entity';
import { User } from 'src/graphql/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Request {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  assignment: string;

  @Field()
  @Column()
  faculty: string;

  @Field()
  @Column()
  studyProgram: string;

  @Field()
  @Column()
  lecturer?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  attachment?: string;

  @Field()
  @Column()
  status: string;

  // Many requests can be made by one requestor
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.requests, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'requestorId' })
  requestor: User;

  // A request may have a requested user (optional)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'requestedId' })
  requested?: User;

  // Comments associated with this request
  @OneToMany(() => Answer, (answer) => answer.request, { nullable: true })
  answers?: Answer[];
}
