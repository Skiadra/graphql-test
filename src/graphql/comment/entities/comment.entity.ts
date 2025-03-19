import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/graphql/post/entities/post.entity';
import { User } from 'src/graphql/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Comment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
