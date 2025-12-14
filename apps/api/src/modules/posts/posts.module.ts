import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity, TagEntity } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, TagEntity])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
