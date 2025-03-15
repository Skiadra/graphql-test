import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/graphql/comment/entities/comment.entity';
import { User } from 'src/graphql/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Post {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Column()
    @Field()
    content: string;
 
    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Field(() => [Comment], { nullable: true })
    @OneToMany(() => Comment, (comments) => comments.post, { nullable: true })
    comments: Comment[];
}