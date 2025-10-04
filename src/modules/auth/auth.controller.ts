import { Controller, Get, Patch, Post } from '@nestjs/common';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  @Post('/signup')
  async signUp() {}

  @Get('/login')
  async login() {}

  @Patch('/mail/verify')
  async mainVerify() {}
}
