import { Module } from '@nestjs/common';
import { Request } from './entities/request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestService } from './request.service';
import { RequestResolver } from './request.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  providers: [RequestService, RequestResolver],
})
export class RequestModule {}
