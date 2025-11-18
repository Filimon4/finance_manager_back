import { Module } from '@nestjs/common';
import { ExportDataController } from './exportData.controller';
import { ExportDataService } from './exportData.service';

@Module({
  controllers: [ExportDataController],
  providers: [ExportDataService],
})
export class ExportDataModule {}
