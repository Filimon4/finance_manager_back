import { Injectable } from '@nestjs/common';
import { CreateBankAccountRequestDto } from './dto/bankAccount.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class BankAccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(accountId: number, dto: CreateBankAccountRequestDto) {
    const mainBankAccount = await this.findMainBankAccount(accountId);
    const currency = { id: 1 };

    const bankAccount = await this.prismaService.bankAccount.create({
      data: {
        name: dto.name,
        account_id: accountId,
        main: mainBankAccount ? false : true,
        currency_id: currency.id,
      },
      select: {
        id: true,
        currency_id: true,
        main: true,
        name: true,
      },
    });

    return bankAccount;
  }

  private async findMainBankAccount(accountId: number) {
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
