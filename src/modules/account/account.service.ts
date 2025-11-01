import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateAccountRequestDto } from './dto/account.dto';
import { IAccount } from '../auth/interface/account.interface';
import { OperationsService } from '../operations/operations.service';
import { BankAccountService } from '../bankAccount/bankAccount.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly operationsService: OperationsService,
    private readonly bankAccountService: BankAccountService,
  ) {}

  async createAccount(dto: CreateAccountRequestDto): Promise<IAccount> {
    const createdAccount = (await this.prismaService.account.create({
      data: {
        email: dto.email,
        password: dto.password,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    })) satisfies IAccount;

    if (!createdAccount) throw new Error('could not create account');

    return createdAccount;
  }

  async findByEmail(email: string): Promise<IAccount> {
    const account = await this.prismaService.account.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        password: true,
        id: true,
      },
    });

    if (!account) throw new Error('there is no account');

    return account satisfies IAccount;
  }

  async getBalance(accountId: number) {
    const mainBankAccount =
      await this.bankAccountService.getMainBankAccount(accountId);

    const operations = await this.operationsService.getOperations(accountId, {
      bankAccountId: mainBankAccount.id,
    });

    const overview = this.operationsService.getOperationsOverview(operations);

    return {
      overview,
    };
  }
}
