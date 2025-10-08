import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountRequestDto } from '../account/dto/account.dto';
import { IJwtTokens } from './interface/jwt.interface';
import { SinginRequestDto } from './dto/signin.dto';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  signUp(@Body() dto: CreateAccountRequestDto): Promise<IJwtTokens> {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post('/signin')
  async signIn(@Body() dto: SinginRequestDto) {
    return this.authService.signIn(dto);
  }

  @Post('/refresh')
  refresh(@Req() req: Request) {
    console.log(req.cookies, req.headers);
  }
}
