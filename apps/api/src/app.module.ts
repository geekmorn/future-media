import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { TagsModule } from './modules/tags/tags.module';
import { UserEntity, TagEntity, PostEntity } from './entities';
import { JwtAuthGuard } from './common/guards';
import { AllExceptionsFilter } from './common/filters';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: configService.get<string>('DATABASE_PATH') ?? 'database.sqlite',
        entities: [UserEntity, TagEntity, PostEntity],
        synchronize: true,
      }),
    }),
    AuthModule,
    PostsModule,
    TagsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
