import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateBankAccountRequestDto,
  GetBankAccountRequestDto,
  UpdateBankAccountRequestDto,
} from './dto/bankAccount.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import type { BankAccount, Prisma } from '@internal/prisma/client';

@Injectable()
export class BankAccountService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(accountId: number, dto: CreateBankAccountRequestDto) {
    const mainBankAccount = await this.getMainBA(accountId);

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

  async getAllBA(accountId: number, dto: GetBankAccountRequestDto) {
    const bankAccountWhereInput: Prisma.BankAccountWhereInput = {};

    if (dto.name && dto.name.length > 0) {
      bankAccountWhereInput.name = {
        startsWith: dto.name,
      };
    }

    bankAccountWhereInput.account_id = accountId;

    const result = await this.prismaService.bankAccount.findMany({
      where: bankAccountWhereInput,
    });

    return result;
  }

  async getMainBA(
    accountId: number,
  ): Promise<Pick<BankAccount, 'id' | 'main' | 'name'>> {
    const bankAccount = await this.prismaService.bankAccount.findFirst({
      where: {
        account_id: accountId,
        main: true,
      },
      select: {
        id: true,
        name: true,
        main: true,
      },
    });

    if (!bankAccount)
      throw new NotFoundException('There is not bank account with this id');

    return bankAccount;
  }

  async getBankAccountById(
    accountId: number,
    id: number,
  ): Promise<BankAccount> {
    const bankAccount = await this.prismaService.bankAccount.findUnique({
      where: {
        id,
        account_id: accountId,
      },
      select: {
        id: true,
        name: true,
        main: true,
        created_at: true,
        account_id: true,
        currency_id: true,
        deleted: true,
      },
    });

    if (!bankAccount)
      throw new NotFoundException('There is not bank account by this id');

    return bankAccount;
  }

  async deleteBankAccount(accountId: number, id: number): Promise<BankAccount> {
    const mainBankAccount = await this.getMainBA(accountId);

    if (mainBankAccount.id === id) {
      throw new BadRequestException('Cannot delete main account');
    }

    const deleted = await this.prismaService.bankAccount.update({
      where: { account_id: accountId, id, main: false },
      data: {
        deleted: true,
      },
    });

    return deleted;
  }

  async update(accountId: number, dto: UpdateBankAccountRequestDto) {
    const bankAccount = await this.getBankAccountById(accountId, dto.id);

    if (!bankAccount)
      throw new BadRequestException('There is not bank account');

    return await this.prismaService.$transaction(async (tx) => {
      const updateData: Prisma.BankAccountUpdateInput = {};
      if (dto.main === true && bankAccount.main === false) {
        updateData.main = true;

        const mainBankAccount = await this.getMainBA(accountId);

        if (mainBankAccount) {
          await tx.bankAccount.update({
            where: {
              id: mainBankAccount.id,
              account_id: accountId,
              main: true,
            },
            data: {
              main: false,
            },
          });
        }
      }

      if (dto.name && dto.name.length > 0) {
        updateData.name = dto.name;
      }

      await tx.bankAccount.update({
        where: {
          id: bankAccount.id,
          account_id: accountId,
        },
        data: updateData,
      });
    });
  }
}
