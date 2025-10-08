import { Module } from '@nestjs/common';
import { BankAccountController } from './bankAccount.controller';
import { BankAccountService } from './bankAccount.service';

@Module({
  controllers: [BankAccountController],
  providers: [BankAccountService],
  exports: [BankAccountService],
})
export class BankAccountModule {}
