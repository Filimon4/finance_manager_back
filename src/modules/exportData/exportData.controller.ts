import { Controller, Get, Res } from '@nestjs/common';
import { ExportDataService } from './exportData.service';
import type { Response } from 'express';

@Controller({
  path: 'exportData',
  version: '1',
})
export class ExportDataController {
  constructor(private readonly exportDataService: ExportDataService) {}

  @Get('halfYear')
  async getHalfYearReport(@Res() res: Response) {
    const workbook = await this.exportDataService.getHalfYearReport();

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="half-year-report.xlsx"',
    });

    await workbook.xlsx.write(res);
    res.end();
  }
}
