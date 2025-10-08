import { Controller, Get, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import type { Request } from 'express';

@Controller({
  path: 'account',
  version: '1',
})
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get('/')
  getAccount(@Req() req: Request) {
    return this.accountService.findByEmail(req.user.email);
  }
}
