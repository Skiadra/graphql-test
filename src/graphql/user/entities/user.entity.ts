import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/graphql/post/entities/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, BeforeInsert } from 'typeorm';

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

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, (user) => user.children, { nullable: true })
    parent: User;

    @OneToMany(() => User, (user) => user.parent)
    children: User[];
}