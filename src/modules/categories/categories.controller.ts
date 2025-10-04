import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  @Get('/')
  async getAll() {}

  @Get('/:id')
  async getById() {}

  @Get('/deleted')
  async getDeleted() {}

  @Get('/overview')
  async getAllOverview() {}

  @Get('/:id/overview')
  async getOverviewById(@Param('id') id: number) {}

  @Post('/')
  async create() {}

  @Patch('/')
  async update() {}

  @Delete('/')
  async delete() {}
}
