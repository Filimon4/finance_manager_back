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
  UpdateBankAccountRequestDto,
} from './dto/bankAccount.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller({
  path: 'bankAccount',
  version: '1',
})
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @ApiOperation({ summary: 'Get main bank account' })
  @Get('/main')
  getMain(@Account('id') accountId: IReqAccount['id']) {
    return this.bankAccountService.getMainBA(accountId);
  }

  @ApiOperation({ summary: 'Get all bank accounts by filters' })
  @Get('/')
  getAll(
    @Account('id') accountId: IReqAccount['id'],
    @Query() dto: GetBankAccountRequestDto,
  ) {
    return this.bankAccountService.getAllBA(accountId, dto);
  }

  @ApiOperation({ summary: 'Get bank accounts by id' })
  @Get('/:id')
  getById(
    @Account('id') accountId: IReqAccount['id'],
    @Param('id') id: number,
  ) {
    return this.bankAccountService.getBankAccountById(accountId, id);
  }

  @ApiOperation({ summary: 'Create bank accounts by id' })
  @Post('/')
  create(
    @Account('id') accountId: IReqAccount['id'],
    @Body() dto: CreateBankAccountRequestDto,
  ) {
    return this.bankAccountService.create(accountId, dto);
  }

  @ApiOperation({ summary: 'Delete bank accounts by id' })
  @Delete('/:id')
  delete(@Account('id') accountId: IReqAccount['id'], @Param('id') id: number) {
    return this.bankAccountService.deleteBankAccount(accountId, id);
  }

  @Get('/:id/overview')
  async getOverview(@Param('id') id: number) {}

  @ApiOperation({ summary: 'Update bank account' })
  @Patch('/')
  update(
    @Account('id') accountId: IReqAccount['id'],
    @Body() dto: UpdateBankAccountRequestDto,
  ) {
    return this.bankAccountService.update(accountId, dto);
  }
}
