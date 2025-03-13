import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/graphql/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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
    @ManyToOne(() => User, (user) => user.posts)
    user: User;
}