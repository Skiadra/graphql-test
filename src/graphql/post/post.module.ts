import { Module } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([Post])],
    providers: [PostService, PostResolver]
})
export class PostModule {}