import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { TagsModule } from './modules/tags/tags.module';
import { UsersModule } from './modules/users/users.module';
import { UserEntity, TagEntity, PostEntity } from './entities';
import { JwtAuthGuard } from './common/guards';
import { AllExceptionsFilter } from './common/filters';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // In Docker, env variables are passed via docker-compose env_file
      // Locally, load from root .env file
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '../../.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        // Use PostgreSQL if DATABASE_URL is set, otherwise SQLite
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [UserEntity, TagEntity, PostEntity],
            synchronize: configService.get('NODE_ENV') !== 'production',
            ssl:
              configService.get('NODE_ENV') === 'production'
                ? { rejectUnauthorized: false }
                : false,
          };
        }

        return {
          type: 'better-sqlite3' as const,
          database: configService.get<string>('DATABASE_PATH') ?? 'database.sqlite',
          entities: [UserEntity, TagEntity, PostEntity],
          synchronize: true,
        };
      },
    }),
    AuthModule,
    PostsModule,
    TagsModule,
    UsersModule,
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
