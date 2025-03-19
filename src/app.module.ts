import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { User } from './graphql/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './graphql/user/user.module';
import { Post } from './graphql/post/entities/post.entity';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PostModule } from './graphql/post/post.module';
import * as depthLimit from 'graphql-depth-limit';
import * as costAnalysis from 'graphql-cost-analysis';
import { GraphQLError } from 'graphql';
import { CommentModule } from './graphql/comment/comment.module';
import { Comment } from './graphql/comment/entities/comment.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './graphql/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available everywhere
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      validationRules: [
        depthLimit(5), // Dipakai untuk membatasi depth query (nesting)
        // (validationContext) =>
        //   costAnalysis({
        //     maximumCost: 1000,
        //     defaultCost: 1,
        //     variables: validationContext.getVariableUsages,
        //     createError: (max, actual) =>
        //       new Error(
        //         `Query cost is ${actual}, which exceeds the max cost of ${max}`,
        //       ),
        //   }),
      ],
      formatError: (error: GraphQLError) => {
        const configService = new ConfigService();
        const isDev = configService.get<string>('CURRENT_ENV') === 'dev';

        const formattedError: any = {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        };

        if (isDev) {
          formattedError.path = error.path;
          formattedError.locations = error.locations;
        }

        return formattedError;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DATABASE_TYPE', 'mysql'),
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 3306),
        username: configService.get<string>('DATABASE_USER', 'root'),
        password: configService.get<string>('DATABASE_PASSWORD', '123456'),
        database: configService.get<string>('DATABASE_NAME', 'test-gql'),
        entities: [User, Post, Comment],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    UserModule,
    PostModule,
    CommentModule,
    AuthModule,
  ],
})
export class AppModule {}
