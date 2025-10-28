import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import moment from 'moment';
import { OperationType } from '@internal/prisma/client';
import {
  AnalyticsResult,
  MonthlyAnalytics,
} from './interface/analytics.interface';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAnalytics(
    accountId: number,
    month: number,
  ): Promise<AnalyticsResult> {
    const endDate = moment().endOf('month').toDate();
    const startDate = moment()
      .subtract(month - 1, 'months')
      .startOf('month')
      .toDate();

    const operations = await this.prismaService.operations.findMany({
      where: {
        account_id: accountId,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
        type: {
          in: [OperationType.INCOME, OperationType.EXPENSE],
        },
      },
      select: {
        amount: true,
        type: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    const monthlyMap = new Map<string, { income: number; expense: number }>();

    for (const op of operations) {
      const key = moment(op.created_at).format('YYYY-MM');

      const data = monthlyMap.get(key) || { income: 0, expense: 0 };

      if (op.type === OperationType.INCOME) {
        data.income += Number(op.amount);
      } else if (op.type === OperationType.EXPENSE) {
        data.expense += Number(op.amount);
      }

      monthlyMap.set(key, data);
    }

    const result: MonthlyAnalytics[] = [];
    let cumulativeBalanceChange = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    const now = moment.now();
    for (let i = month; i > 0; i--) {
      const date = moment(now).subtract(i - 1, 'months');
      const key = date.format('YYYY-MM');

      const data = monthlyMap.get(key) || { income: 0, expense: 0 };
      const delta = data.income - data.expense;
      cumulativeBalanceChange += delta;

      result.push({
        year: date.year(),
        month: date.month(),
        income: data.income,
        expense: data.expense,
        delta,
        balanceChange: cumulativeBalanceChange,
      });

      totalIncome += data.income;
      totalExpense += data.expense;
    }

    return {
      months: result,
      totalIncome,
      totalExpense,
      totalDelta: totalIncome - totalExpense,
    };
  }
}
