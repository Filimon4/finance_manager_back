import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AccountModule } from './modules/account/account.module';
import { BankAccountModule } from './modules/bankAccount/bankAccount.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { OperationsModule } from './modules/operations/operations.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),

    AccountModule,
    BankAccountModule,
    CategoriesModule,
    CurrenciesModule,
    OperationsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
