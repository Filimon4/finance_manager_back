import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  CreateCategoryRequestDto,
  GetCategoryOverview,
  GetCategoryRequestDto,
  UpdateCategoryRequestDto,
} from './dto/categories.dto';
import type { Category, Prisma } from '@internal/prisma/client';
import { BankAccountService } from '../bankAccount/bankAccount.service';
import { OperationsService } from '../operations/operations.service';
import moment from 'moment';
import { GetOperationsRequestDto } from '../operations/dto/operations.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bankAccountService: BankAccountService,
    private readonly operationsService: OperationsService,
  ) {}

  async getCategoryById(accountId: number, id: number): Promise<Category> {
    const result = await this.prismaService.category.findFirst({
      where: {
        id,
        account_id: accountId,
      },
    });

    if (!result)
      throw new NotFoundException('There is not category with this id');

    return result;
  }

  async create(
    accountId: number,
    dto: CreateCategoryRequestDto,
  ): Promise<Category> {
    const result = await this.prismaService.category.create({
      data: {
        name: dto.name,
        account_id: accountId,
        base_type: dto.baseType,
      },
    });

    return result;
  }

  async getCategories(
    accountId: number,
    dto: GetCategoryRequestDto,
  ): Promise<Category[]> {
    const categoryWhereInput: Prisma.CategoryWhereInput = {};

    if (dto.name && dto.name.length > 0) {
      categoryWhereInput.name = {
        startsWith: dto.name,
      };
    }

    if (Object.hasOwn(dto, 'deleted')) {
      categoryWhereInput.deleted = dto.deleted;
    }

    categoryWhereInput.account_id = accountId;

    const result = await this.prismaService.category.findMany({
      where: categoryWhereInput,
      orderBy: {
        id: 'asc',
      },
    });

    return result;
  }

  async deleteCategory(accountId: number, id: number): Promise<Category> {
    const deleted = await this.prismaService.category.update({
      where: {
        account_id: accountId,
        id: id,
      },
      data: {
        deleted: true,
      },
    });

    return deleted;
  }

  async restoreCategory(accountId: number, id: number): Promise<Category> {
    const category = await this.getCategoryById(accountId, id);

    if (category.deleted === false)
      throw new BadRequestException('Category is not deleted');

    const deleted = await this.prismaService.category.update({
      where: {
        account_id: accountId,
        id: id,
      },
      data: {
        deleted: false,
      },
    });

    return deleted;
  }

  async updateCategory(
    accountId: number,
    dto: UpdateCategoryRequestDto,
  ): Promise<Category> {
    const updateCategoryInput: Prisma.CategoryUpdateInput = {};

    if (dto.name && dto.name.length > 0) {
      updateCategoryInput.name = dto.name;
    }

    if (dto.baseType) {
      updateCategoryInput.base_type = dto.baseType;
    }

    const updated = await this.prismaService.category.update({
      where: {
        account_id: accountId,
        id: dto.id,
      },
      data: updateCategoryInput,
    });

    return updated;
  }

  async getCategoryOverview(accountId: number, dto: GetCategoryOverview) {
    const operationFilterInput: GetOperationsRequestDto = {};

    if (dto.bankAccountId && !isNaN(dto.bankAccountId)) {
      const bankAccount = await this.bankAccountService.getBankAccountById(
        accountId,
        dto.bankAccountId,
      );

      operationFilterInput.bankAccountId = bankAccount.id;
    }

    if (dto.categoryId && !isNaN(dto.categoryId)) {
      operationFilterInput.categoryId = dto.categoryId;
    }

    operationFilterInput.fromDate = moment()
      .utc()
      .startOf('month')
      .subtract(dto.lastAmountMounth - 1, 'months')
      .toDate();

    const operations = await this.operationsService.getOperations(
      accountId,
      operationFilterInput,
    );

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

    return {
      overview,
      fromDate: operationFilterInput.fromDate,
    };
  }
}
