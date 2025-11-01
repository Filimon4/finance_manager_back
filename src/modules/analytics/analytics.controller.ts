import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Account } from '../../common/decorators/account.decorator';
import { IReqAccount } from '../auth/interface/account.interface';
import { AnalyticsService } from './analytics.service';

@Controller({ path: '/analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analiticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Get analitics of account' })
  @Get('/')
  async getAnalytics(
    @Account('id') accountId: IReqAccount['id'],
    @Query('month') month: number,
  ) {
    const analitics = await this.analiticsService.getAnalytics(
      accountId,
      month,
    );

    return analitics;
  }
}
