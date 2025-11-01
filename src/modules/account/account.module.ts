import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { OperationsModule } from '../operations/operations.module';
import { BankAccountModule } from '../bankAccount/bankAccount.module';

@Module({
  imports: [OperationsModule, BankAccountModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
