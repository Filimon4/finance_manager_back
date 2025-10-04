import { Controller, Get } from '@nestjs/common';

@Controller({
  path: 'currencies',
  version: '1',
})
export class CurrenciesController {
  @Get('/')
  async getAll() {}
}
