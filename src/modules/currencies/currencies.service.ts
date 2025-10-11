import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import {
  CreateCurrencyRequestDto as CreateCurrencyRequestDto,
  GetCurrenciesRequestDto,
} from './dto/currencies.dto';
import type { Prisma } from '@internal/prisma/client';
import {
  CreateCurrencyRespnse,
  GetCurrencyResponse,
} from './interface/currencies.interface';

@Injectable()
export class CurrenciesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: number) {
    const result = await this.prismaService.currency.findUnique({
      where: {
        id,
      },
    });

    if (!result) throw new NotFoundException('There is not currnecy');

    return result;
  }

  async getAll(
    filter: GetCurrenciesRequestDto,
  ): Promise<GetCurrencyResponse[]> {
    const whereInput: Prisma.CurrencyWhereInput = {};

    if (filter.name && filter.name?.length > 0) {
      whereInput.name = {
        startsWith: filter.name,
      };
    }

    if (filter.symbol && filter.symbol?.length > 0) {
      whereInput.symbol = {
        startsWith: filter.symbol,
      };
    }

    const result = await this.prismaService.currency.findMany({
      where: whereInput,
      select: {
        id: true,
        code: true,
        name: true,
        symbol: true,
        symbol_native: true,
      },
    });

    return result;
  }

  async create(dto: CreateCurrencyRequestDto): Promise<CreateCurrencyRespnse> {
    const result = await this.prismaService.currency.create({
      data: {
        code: dto.code,
        name: dto.name,
        symbol: dto.symbol,
        symbol_native: dto.symbolNative,
      },
    });

    return result;
  }
}
