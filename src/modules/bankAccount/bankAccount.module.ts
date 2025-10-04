import { Module } from '@nestjs/common';
import { BankAccountController } from './bankAccount.controller';

@Module({
  controllers: [BankAccountController],
})
export class BankAccountModule {}
