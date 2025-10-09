import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Account } from '../../common/decorators/account.decorator';
import type { IReqAccount } from '../auth/interface/account.interface';
import { BankAccountService } from './bankAccount.service';
import {
  CreateBankAccountRequestDto,
  GetBankAccountRequestDto,
} from './dto/bankAccount.dto';

@Controller({
  path: 'bankAccount',
  version: '1',
})
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Get('/main')
  getMain(@Account('id') accountId: IReqAccount['id']) {
    return this.bankAccountService.getMainBankAccount(accountId);
  }

  @Get('/')
  async getAll(
    @Account('id') accountId: IReqAccount['id'],
    @Query() dto: GetBankAccountRequestDto,
  ) {
    return this.bankAccountService.getAllBankAccounts(accountId, dto);
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {}

  @Get('/:id/overview')
  async getOverview(@Param('id') id: number) {}

  @Post('/')
  create(
    @Account('id') accountId: IReqAccount['id'],
    @Body() dto: CreateBankAccountRequestDto,
  ) {
    return this.bankAccountService.create(accountId, dto);
  }

  @Patch('/')
  async update() {}

  @Delete('/')
  async delete() {}
}
