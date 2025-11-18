import { Module, forwardRef } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { BankAccountModule } from '../bankAccount/bankAccount.module';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [
    forwardRef(() => BankAccountModule),
    forwardRef(() => OperationsModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
