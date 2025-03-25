import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../graphql/user/entities/user.entity';
import { Request } from '../graphql/request/entities/request.entity';
import { SeederService } from './seeder.service';
import { config } from 'dotenv';
import { Answer } from 'src/graphql/answer/entities/answer.entity';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '3306'),
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '12345678',
      database: process.env.DATABASE_NAME || 'test_gql',
      entities: [User, Request, Answer],
      synchronize: true,
      dropSchema: process.env.CURRENT_ENV == 'dev' ? true : false,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User, Request, Answer]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
