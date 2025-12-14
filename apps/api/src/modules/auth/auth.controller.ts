import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService, TokenPair } from './auth.service';
import { SignUpDto, SignInDto, AuthResponseDto, SuccessResponseDto } from './dto';
import { GoogleAuthGuard, JwtRefreshGuard } from './guards';
import { GoogleProfile } from './strategies';
import { Public, CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setAuthCookies(res: Response, tokens: TokenPair): void {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, description: 'User created', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.signUp(dto);
    this.setAuthCookies(res, result.tokens);
    return { user: result.user };
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with credentials' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'Signed in', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.signIn(dto);
    this.setAuthCookies(res, result.tokens);
    return { user: result.user };
  }

  @Public()
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'Tokens refreshed', type: SuccessResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponseDto> {
    const tokens = await this.authService.refresh(user.sub);
    this.setAuthCookies(res, tokens);
    return { success: true };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign out and clear cookies' })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'Signed out', type: SuccessResponseDto })
  async signOut(@Res({ passthrough: true }) res: Response): Promise<SuccessResponseDto> {
    this.clearAuthCookies(res);
    return { success: true };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'Current user', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async getMe(@CurrentUser() user: JwtPayload): Promise<AuthResponseDto> {
    const authUser = await this.authService.getMe(user.sub);
    return { user: authUser };
  }

  @Public()
  @Get('google/start')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Start Google OAuth flow' })
  @ApiResponse({ status: 302, description: 'Redirect to Google' })
  googleStart(): void {
    // Guard handles the redirect
  }

  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirect to web app' })
  async googleRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const googleProfile = req.user as GoogleProfile;
    const result = await this.authService.handleGoogleAuth(googleProfile);
    this.setAuthCookies(res, result.tokens);

    const webUrl = this.configService.get<string>('WEB_URL') ?? 'http://localhost:3000';
    res.redirect(webUrl);
  }
}
