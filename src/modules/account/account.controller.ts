import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '../../common/decorators/account.decorator';
import { IReqAccount } from '../auth/interface/account.interface';

@Controller({
  path: 'account',
  version: '1',
})
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/')
  getAccount(@Account('email') email: IReqAccount['email']) {
    return this.accountService.findByEmail(email);
  }

  // TODO: Доделать анализ
  @Get('/balance')
  async getBalance(@Account('id') accountId: IReqAccount['id']) {
    const operations = await this.accountService.getBalance(accountId);

    return operations;
  }
}
