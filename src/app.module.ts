import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { User } from './graphql/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './graphql/user/user.module';
import { Post } from './graphql/post/entities/post.entity';
import { config } from 'dotenv';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PostModule } from './graphql/post/post.module';
import * as depthLimit from 'graphql-depth-limit';
import * as costAnalysis from 'graphql-cost-analysis';
import { GraphQLError } from 'graphql';
import { CommentModule } from './graphql/comment/comment.module';
import { Comment } from './graphql/comment/entities/comment.entity';

// Load environment variables early
config();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      validationRules: [
        depthLimit(5), // Dipakai untuk membatasi depth query (nesting)
        (validationContext) =>
          costAnalysis.default({
            maximumCost: 1000,
            defaultCost: 1,
            variables: validationContext.getVariableUsages,
            createError: (max, actual) =>
              new Error(`Query cost is ${actual}, which exceeds the max cost of ${max}`),
          }),
      ],
      formatError: (error: GraphQLError) => { // Format error message
        return {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '3306'),
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '123456',
      database: process.env.DATABASE_NAME || 'test-gql',
      entities: [User, Post, Comment],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
