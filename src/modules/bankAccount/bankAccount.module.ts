import { Module, forwardRef } from '@nestjs/common';
import { BankAccountController } from './bankAccount.controller';
import { BankAccountService } from './bankAccount.service';
import { CurrenciesModule } from '../currencies/currencies.module';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [CurrenciesModule, forwardRef(() => OperationsModule)],
  controllers: [BankAccountController],
  providers: [BankAccountService],
  exports: [BankAccountService],
})
export class BankAccountModule {}
