import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Account } from '../../common/decorators/account.decorator';
import { IReqAccount } from '../auth/interface/account.interface';
import {
  CreateCategoryRequestDto,
  GetCategoryOverview,
  GetCategoryRequestDto,
  UpdateCategoryRequestDto,
} from './dto/categories.dto';
import { CategoriesService } from './categories.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @ApiOperation({ summary: 'Get all categories by filter ' })
  @Get('/')
  async getAll(
    @Account('id') accountId: IReqAccount['id'],
    @Query() dto: GetCategoryRequestDto,
  ) {
    const reuslt = await this.categoryService.getCategories(accountId, dto);

    return reuslt;
  }

  @ApiOperation({ summary: 'Get overview of all categories' })
  @Get('/overview')
  async getAllOverview(@Account('id') accountId: IReqAccount['id']) {
    const result = await this.categoryService.getCategoryOverview(accountId, {
      lastAmountMounth: 1,
    });

    return result;
  }

  @ApiOperation({ summary: 'Get category by id ' })
  @Get('/:id')
  async getById(
    @Account('id') accountId: IReqAccount['id'],
    @Param('id') id: number,
  ) {
    const result = await this.categoryService.getCategoryById(accountId, id);

    return result;
  }

  @ApiOperation({ summary: 'Get overview of category by id' })
  @Get('/:id/overview')
  async getOverview(
    @Account('id') accountId: IReqAccount['id'],
    @Param('id') id: number,
    @Query() dto: GetCategoryOverview,
  ) {
    const result = await this.categoryService.getCategoryOverview(accountId, {
      ...dto,
      categoryId: id,
    });

    return result;
  }

  @ApiOperation({ summary: 'Cretae category' })
  @Post('/')
  async create(
    @Account('id') accountId: IReqAccount['id'],
    @Body() dto: CreateCategoryRequestDto,
  ) {
    const result = await this.categoryService.create(accountId, dto);

    return result;
  }

  // TOOD: Возможно patch передалать на :id
  @ApiOperation({ summary: 'Update category' })
  @Patch('/')
  async update(
    @Account('id') accountId: IReqAccount['id'],
    @Body() dto: UpdateCategoryRequestDto,
  ) {
    const result = await this.categoryService.updateCategory(accountId, dto);

    return result;
  }

  @ApiOperation({ summary: 'Restore category if was deleted' })
  @Patch('/:id/restore')
  async restore(
    @Account('id') accountId: IReqAccount['id'],
    @Param('id') id: number,
  ) {
    const result = await this.categoryService.restoreCategory(accountId, id);

    return { result };
  }

  @ApiOperation({ summary: 'Delete category' })
  @Delete('/:id')
  async delete(
    @Account('id') accountId: IReqAccount['id'],
    @Param('id') id: number,
  ) {
    const result = await this.categoryService.deleteCategory(accountId, id);

    return { result };
  }
}
