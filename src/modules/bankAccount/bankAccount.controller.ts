import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Account } from '../../common/decorators/account.decorator';
import type { IReqAccount } from '../auth/interface/account.interface';
import { BankAccountService } from './bankAccount.service';
import { CreateBankAccountRequestDto } from './dto/bankAccount.dto';

@Controller({
  path: 'bankAccount',
  version: '1',
})
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Get('/main')
  async getMain() {}

  @Get('/')
  async getAll() {}

  @Get('/:id')
  async getById(@Param('id') id: number) {}

  @Get('/:id/overview')
  async getOverview(@Param('id') id: number) {}

  @Post('/')
  async create(
    @Account('id') account: IReqAccount,
    @Body() dto: CreateBankAccountRequestDto,
  ) {
    this.bankAccountService.create();
  }

  @Patch('/')
  async update() {}

  @Delete('/')
  async delete() {}
}
