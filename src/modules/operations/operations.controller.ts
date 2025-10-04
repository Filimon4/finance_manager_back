import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller({
  path: 'operations',
  version: '1',
})
export class OperationsController {
  @Get('/')
  async getAll() {}

  @Post('/')
  async create() {}

  @Patch('/')
  async update() {}

  @Delete('/')
  async delete() {}
}
