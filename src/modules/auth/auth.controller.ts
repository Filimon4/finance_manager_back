import { Body, Controller, Patch, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountRequestDto } from '../account/dto/account.dto';
import { IJwtTokens } from './interface/jwt.interface';
import { SinginRequestDto } from './dto/signin.dto';
import type { Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth / Авторизация')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signUp(
    @Body() dto: CreateAccountRequestDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ): Promise<Pick<IJwtTokens, 'accessToken'>> {
    const tokens = await this.authService.signUp(dto);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('/signin')
  async signIn(
    @Body() dto: SinginRequestDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ): Promise<Pick<IJwtTokens, 'accessToken'>> {
    const tokens = await this.authService.signIn(dto);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Patch('/verify')
  async verify() {}
}
