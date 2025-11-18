import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import moment from 'moment';

@Injectable()
export class ExportDataService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHalfYearReport(): Promise<ExcelJS.Workbook> {
    const now = moment();
    const sixMonthsAgo = moment().subtract(6, 'months');

    const data = await this.prismaService.operations.findMany({
      where: {
        created_at: {
          gte: sixMonthsAgo.toDate(),
          lte: now.toDate(),
        },
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        amount: true,
        type: true,
        category: {
          select: { name: true },
        },
        bank_account: {
          select: { name: true },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Report');

    sheet.addRow([
      'ID',
      'Name',
      'Amount',
      'Type',
      'Category',
      'Bank Account',
      'Created At',
    ]);

    data.forEach((row) => {
      sheet.addRow([
        row.id,
        row.name,
        row.amount,
        row.type,
        row.category?.name || '',
        row.bank_account?.name || '',
        moment(row.created_at).format('YYYY-MM-DD HH:mm'),
      ]);
    });

    return workbook;
  }
}
