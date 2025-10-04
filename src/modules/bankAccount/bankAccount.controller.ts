import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller({
  path: 'bankAccount',
  version: '1',
})
export class BankAccountController {
  @Get('/main')
  async getMain() {}

  @Get('/')
  async getAll() {}

  @Get('/:id')
  async getById(@Param('id') id: number) {}

  @Get('/:id/overview')
  async getOverview(@Param('id') id: number) {}

  @Post('/')
  async create() {}

  @Patch('/')
  async update() {}

  @Delete('/')
  async delete() {}
}
