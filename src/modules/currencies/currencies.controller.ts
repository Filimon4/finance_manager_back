import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
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

  @ApiOperation({ summary: 'Get currencies by filters' })
  @Public()
  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<GetCurrencyResponse> {
    return this.currencyService.getById(id);
  }

  @ApiOperation({ summary: 'Get currencies by filters' })
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
