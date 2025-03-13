import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../graphql/user/entities/user.entity';
import { Post } from '../graphql/post/entities/post.entity';
import { SeederService } from './seeder.service';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: process.env.DATABASE_TYPE as 'mysql',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT ?? '3306'),
        username: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '123456',
        database: process.env.DATABASE_NAME || 'test-gql',
        entities: [User, Post],
        synchronize: true,
        autoLoadEntities: true,
      }),
    TypeOrmModule.forFeature([User, Post]),
  ],
  providers: [SeederService],
})
export class SeederModule {}