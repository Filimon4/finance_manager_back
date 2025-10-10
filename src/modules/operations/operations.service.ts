import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums, Operations, Prisma } from '@internal/prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  CreatOperationRequestDto,
  GetOperationsRequestDto,
  UpdateOperationsRequestDto,
} from './dto/operations.dto';

@Injectable()
export class OperationsService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async getOperations(
    accountId: number,
    dto: GetOperationsRequestDto,
  ): Promise<Operations[]> {
    const operationsWhereInput: Prisma.OperationsWhereInput = {};

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

    const operations = await this.prismaService.operations.findMany({
      where: {
        account_id: accountId,
        ...operationsWhereInput,
      },
    });

    return operations;
  }

  async createOperation(
    accountId: number,
    dto: CreatOperationRequestDto,
  ): Promise<Operations> {
    const baseOperationData: Omit<
      Prisma.OperationsCreateInput,
      'type' | 'bank_account'
    > = {
      amount: dto.amount,
      name: dto.name,
      description: dto.description,
      exchange_rate: dto.exchangeRate,
      account: {
        connect: { id: accountId },
      },
      category: {
        connect: { id: dto.categoryId },
      },
    };

    if (dto.type === 'TRANSFER') {
      return await this.prismaService.$transaction(async (tx) => {
        const outgoingOperation = await tx.operations.create({
          data: {
            ...baseOperationData,
            type: $Enums.OperationType.TRANSFER_OUT as $Enums.OperationType,
            bank_account: {
              connect: { id: dto.bankAccountid },
            },
          },
        });

        const incomingOperation = await tx.operations.create({
          data: {
            ...baseOperationData,
            type: $Enums.OperationType.TRANSFER_IN as $Enums.OperationType,
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

    const operationsCreateInput: Prisma.OperationsCreateInput = {
      ...baseOperationData,
      type: dto.type as $Enums.TransactionType,
      bank_account: {
        connect: { id: dto.bankAccountid },
      },
    };

    return await this.prismaService.$transaction(async (tx) => {
      const operation = await tx.operations.create({
        data: operationsCreateInput,
      });
      return operation;
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
      if (!isNaN(Number(dto.exchangeRate)))
        data.exchange_rate = dto.exchangeRate;

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

      if (!isNaN(+operation.transfer_pair_id)) {
        const pairedOperation = await tx.operations.findUnique({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
}
