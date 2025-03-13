import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/graphql/post/entities/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    email: string;

    @Column({ select: false })
    @HideField()
    password: string;

    @Field(() => [Post], { nullable: true })
    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];
}