import { Injectable } from '@nestjs/common';
import {
  CreateBankAccountRequestDto,
  GetBankAccountRequestDto,
} from './dto/bankAccount.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import type { Prisma } from '@internal/prisma/client';

@Injectable()
export class BankAccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(accountId: number, dto: CreateBankAccountRequestDto) {
    const mainBankAccount = await this.getMainBankAccount(accountId);

    const bankAccount = await this.prismaService.bankAccount.create({
      data: {
        name: dto.name,
        account_id: accountId,
        main: mainBankAccount ? false : true,
        currency_id: dto.currencyId,
      },
      select: {
        id: true,
        currency_id: true,
        main: true,
        name: true,
      },
    });

    // creaet default operation with bankAmount

    return bankAccount;
  }

  async getAllBankAccounts(accountId: number, dto: GetBankAccountRequestDto) {
    const bankAccountWhereInput: Prisma.BankAccountWhereInput = {};

    if (dto.name && dto.name.length > 0) {
      bankAccountWhereInput.name = {
        startsWith: dto.name,
      };
    }

    const result = await this.prismaService.bankAccount.findMany({
      where: bankAccountWhereInput,
    });

    return result;
  }

  async getMainBankAccount(accountId: number) {
    const bankAccount = await this.prismaService.bankAccount.findFirst({
      where: {
        account_id: accountId,
        main: true,
      },
      select: {
        id: true,
      },
    });

    return bankAccount;
  }
}
