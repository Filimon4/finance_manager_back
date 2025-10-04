import { Controller, Get, Post } from '@nestjs/common';

@Controller({
  path: 'account',
  version: '1',
})
export class AccountController {
  @Get('/')
  async getAccount() {}

  @Get('/balance')
  async getBalance() {}

  @Post('/')
  async createAccount() {}
}
