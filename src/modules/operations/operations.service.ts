import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { $Enums, Operations, Prisma } from '@internal/prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  CreateOperationRequestDto,
  GetMainAllOperationsRequestDto,
  GetOperationsRequestDto,
  UpdateOperationsRequestDto,
} from './dto/operations.dto';
import { BankAccountService } from '../bankAccount/bankAccount.service';
import moment from 'moment';
import { IOperationsOverview } from './interfaces/operations-overview.interface';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class OperationsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => BankAccountService))
    private readonly bankAccountService: BankAccountService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  async getById(accountId: number, id: number): Promise<Operations> {
    const operation = await this.prismaService.operations.findFirst({
      where: {
        id,
        account_id: accountId,
      },
    });

    if (!operation) throw new NotFoundException('There is no operation');

    return operation;
  }

  async getOperationsMain(
    accountId: number,
    dto: GetMainAllOperationsRequestDto,
  ): Promise<Operations[]> {
    const mainBankAccount =
      await this.bankAccountService.getMainBankAccount(accountId);

    const operations = await this.getOperations(accountId, {
      bankAccountId: mainBankAccount.id,
      fromDate: dto.fromDate,
      dateOrder: dto.dateOrder,
      toDate: dto.toDate,
    });

    return operations;
  }

  async getOperations(
    accountId: number,
    dto: GetOperationsRequestDto,
  ): Promise<Operations[]> {
    const operationsWhereInput: Prisma.OperationsWhereInput = {};
    const operationsOrderBy: Prisma.OperationsOrderByWithRelationInput = {};

    // Filters
    if (dto.amount !== undefined && !isNaN(+dto.amount)) {
      const amountWhereInput: Prisma.DecimalFilter = {};
      if (dto.amount.equals) {
        amountWhereInput.equals = dto.amount.equals;
      }
      if (dto.amount.gte) {
        amountWhereInput.gte = dto.amount.gte;
      }
      if (dto.amount.lte) {
        amountWhereInput.lte = dto.amount.lte;
      }
      operationsWhereInput.amount = amountWhereInput;
    }

    if (dto.categoryId && !isNaN(dto.categoryId)) {
      operationsWhereInput.category_id = dto.categoryId;
    }

    if (dto.name && dto.name.length > 0) {
      operationsWhereInput.name = {
        startsWith: dto.name,
      };
    }

    if (dto.bankAccountId && !isNaN(dto.bankAccountId)) {
      operationsWhereInput.bank_account_id = dto.bankAccountId;
    }

    if (
      dto.bankAccountIds &&
      Array.isArray(dto.bankAccountIds) &&
      dto.bankAccountIds.length > 0
    ) {
      operationsWhereInput.bank_account_id = {
        in: dto.bankAccountIds,
      };
    }

    let gte, lte;

    if (dto.fromDate && moment(dto.fromDate).isValid()) {
      gte = new Date(dto.fromDate);
    }

    if (dto.toDate && moment(dto.toDate).isValid()) {
      lte = new Date(dto.toDate);
    }

    if (gte && lte) {
      operationsWhereInput.created_at = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        lte,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        gte,
      };
    }

    // Order
    if (dto.dateOrder && typeof dto.dateOrder === 'string') {
      operationsOrderBy.created_at = dto.dateOrder;
    }

    // Query
    const operations = await this.prismaService.operations.findMany({
      where: {
        account_id: accountId,
        ...operationsWhereInput,
      },
      orderBy: operationsOrderBy,
    });

    return operations;
  }

  async createOperation(
    accountId: number,
    dto: CreateOperationRequestDto,
  ): Promise<Operations> {
    const baseOperationData: Omit<
      Prisma.OperationsCreateInput,
      'type' | 'bank_account'
    > = {
      amount: dto.amount,
      name: dto.name,
      description: dto.description,
      account: {
        connect: { id: accountId },
      },
      category: {},
    };

    const mainBankAccount =
      await this.bankAccountService.getMainBankAccount(accountId);

    const category = await this.categoriesService.getCategoryById(
      accountId,
      dto.categoryId,
    );

    baseOperationData.category = { connect: { id: dto.categoryId } };

    if (dto.type === 'TRANSFER') {
      if (!dto.toBankAccountId) {
        throw new BadRequestException(
          'toBankAccountId is required for transfer',
        );
      }

      if (dto.toBankAccountId === mainBankAccount.id) {
        throw new BadRequestException('Cannot transfer to the same account');
      }

      const transferBankAccount =
        await this.bankAccountService.getBankAccountById(
          accountId,
          dto.toBankAccountId,
        );

      if (transferBankAccount.deleted === true)
        throw new BadRequestException('Bank account to trasfer is delete');

      return await this.prismaService.$transaction(async (tx) => {
        const outgoingOperation = await tx.operations.create({
          data: {
            ...baseOperationData,
            type: $Enums.OperationType.TRANSFER_OUT,
            bank_account: {
              connect: { id: mainBankAccount.id },
            },
          },
        });

        const incomingOperation = await tx.operations.create({
          data: {
            ...baseOperationData,
            type: $Enums.OperationType.TRANSFER_IN,
            bank_account: {
              connect: { id: dto.toBankAccountId },
            },
            transfer_pair: {
              connect: { id: outgoingOperation.id },
            },
          },
        });

        await tx.operations.update({
          where: { id: outgoingOperation.id },
          data: {
            transfer_pair: { connect: { id: incomingOperation.id } },
          },
        });

        return outgoingOperation;
      });
    }

    return await this.prismaService.operations.create({
      data: {
        ...baseOperationData,
        type: category.base_type,
        bank_account: { connect: { id: mainBankAccount.id } },
      },
    });
  }

  async updateOperation(
    accountId: number,
    dto: UpdateOperationsRequestDto,
  ): Promise<Operations> {
    const operation = await this.prismaService.operations.findFirst({
      where: {
        id: dto.id,
        account_id: accountId,
      },
    });

    if (!operation) {
      throw new NotFoundException('Operation not found');
    }

    if (operation.type === 'TRANSFER_OUT' || operation.type === 'TRANSFER_IN') {
      throw new BadRequestException(
        'Transfer operations cannot be updated. Delete and recreate instead.',
      );
    }

    return await this.prismaService.$transaction(async (tx) => {
      const data: Prisma.OperationsUpdateInput = {};

      if (dto.name && dto.name.length > 0) data.name = dto.name;

      if (dto.description && dto.description.length > 0)
        data.description = dto.description;

      if (!isNaN(Number(dto.amount))) data.amount = dto.amount;

      if (dto.type && typeof dto.type === 'string')
        data.type = dto.type as $Enums.OperationType;

      const updated = await tx.operations.update({
        where: { id: dto.id },
        data,
      });

      return updated;
    });
  }

  async delete(accountId: number, id: number) {
    return await this.prismaService.$transaction(async (tx) => {
      const operation = await tx.operations.findFirst({
        where: {
          id,
          account_id: accountId,
        },
      });

      if (!operation) {
        throw new NotFoundException('Operation not found');
      }

      if (operation.transfer_pair_id && !isNaN(+operation.transfer_pair_id)) {
        const pairedOperation = await tx.operations.findUnique({
          where: { id: operation.transfer_pair_id },
        });

        await tx.operations.deleteMany({
          where: {
            id: {
              in: [+operation.id, pairedOperation?.id].filter(
                Boolean,
              ) as number[],
            },
          },
        });

        return true;
      }

      await tx.operations.delete({
        where: { id: operation.id },
      });

      return true;
    });
  }

  public getOperationsOverview(operations: Operations[]): IOperationsOverview {
    const overview = {
      totalIncome: 0,
      totalExpense: 0,
      totalProfit: 0,
    };

    for (const operation of operations) {
      if (operation.type === 'INCOME') {
        overview.totalIncome += Number(operation.amount);
      } else if (operation.type === 'EXPENSE') {
        overview.totalExpense += Number(operation.amount);
      }
    }

    overview.totalProfit = overview.totalIncome - overview.totalExpense;

    return overview;
  }
}
