import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, JwtRefreshStrategy, GoogleStrategy } from './strategies';
import { UserEntity } from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
