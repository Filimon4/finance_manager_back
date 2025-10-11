import { Module, forwardRef } from '@nestjs/common';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';
import { BankAccountModule } from '../bankAccount/bankAccount.module';

@Module({
  imports: [forwardRef(() => BankAccountModule)],
  controllers: [OperationsController],
  providers: [OperationsService],
  exports: [OperationsService],
})
export class OperationsModule {}
