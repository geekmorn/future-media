import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../entities';
import { SignUpDto, SignInDto } from './dto';
import { AVATAR_COLORS, TOKEN_EXPIRATION } from '../../common/constants';
import type { TokenPair, AuthUser, GoogleProfile } from '../../common/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto): Promise<{ user: AuthUser; tokens: TokenPair }> {
    const existingUser = await this.userRepository.findOne({
      where: { name: dto.name.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this name already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name.toLowerCase(),
      passwordHash,
      color: this.getRandomColor(),
    });

    await this.userRepository.save(user);
    const tokens = await this.generateTokens(user);

    return {
      user: { id: user.id, name: user.name },
      tokens,
    };
  }

  async signIn(dto: SignInDto): Promise<{ user: AuthUser; tokens: TokenPair }> {
    const user = await this.userRepository.findOne({
      where: { name: dto.name.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: { id: user.id, name: user.name },
      tokens,
    };
  }

  async refresh(userId: string): Promise<TokenPair> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user);
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { id: user.id, name: user.name };
  }

  async handleGoogleAuth(profile: GoogleProfile): Promise<{ user: AuthUser; tokens: TokenPair }> {
    let user = await this.userRepository.findOne({
      where: { googleId: profile.googleId },
    });

    if (!user) {
      let userName = profile.displayName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      const existingUser = await this.userRepository.findOne({
        where: { name: userName },
      });

      if (existingUser) {
        userName = `${userName}_${Date.now()}`;
      }

      user = this.userRepository.create({
        name: userName,
        googleId: profile.googleId,
        passwordHash: null,
        color: this.getRandomColor(),
      });

      await this.userRepository.save(user);
    }

    const tokens = await this.generateTokens(user);

    return {
      user: { id: user.id, name: user.name },
      tokens,
    };
  }

  private getRandomColor(): string {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  }

  private async generateTokens(user: UserEntity): Promise<TokenPair> {
    const payload = { sub: user.id, name: user.name };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: TOKEN_EXPIRATION.ACCESS_TOKEN,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: TOKEN_EXPIRATION.REFRESH_TOKEN,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
