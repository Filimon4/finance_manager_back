import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import {
  CreateCurrencyRequestDto,
  GetCurrenciesRequestDto,
} from './dto/currencies.dto';
import { CurrenciesService } from './currencies.service';
import {
  CreateCurrencyRespnse as CreateCurrencyResponse,
  GetCurrencyResponse,
} from './interface/currencies.interface';
import { ApiOperation } from '@nestjs/swagger';

@Controller({
  path: 'currencies',
  version: '1',
})
export class CurrenciesController {
  constructor(private readonly currencyService: CurrenciesService) {}

  @ApiOperation({ summary: 'Get currencies with filters' })
  @Public()
  @Get('/')
  getAll(
    @Query() filter: GetCurrenciesRequestDto,
  ): Promise<GetCurrencyResponse[]> {
    return this.currencyService.getAll(filter);
  }

  // TODO: Make not public, with account role admin
  @ApiOperation({ summary: 'Create new currency' })
  @Public()
  @Post('/')
  create(
    @Body() dto: CreateCurrencyRequestDto,
  ): Promise<CreateCurrencyResponse> {
    return this.currencyService.create(dto);
  }
}
