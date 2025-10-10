import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  CreateCategoryRequestDto,
  GetCategoryRequestDto,
  UpdateCategoryRequestDto,
} from './dto/categories.dto';
import type { Category, Prisma } from '@internal/prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
