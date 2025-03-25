import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/enum/user-role.enum';
import { Answer } from 'src/graphql/answer/entities/answer.entity';
import { Request } from 'src/graphql/request/entities/request.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  email: string;

  @Column({ select: false })
  @HideField()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  wallet?: string;

  @Field()
  @Column()
  description: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Request, (request) => request.requestor, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  requests: Request[];

  @OneToMany(() => Request, (request) => request.requested, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  requestsReceived: Request[];

  @OneToMany(() => Answer, (answers) => answers.user, { nullable: true })
  answers: Answer[];
}
