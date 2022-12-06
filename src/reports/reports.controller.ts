import { Controller, Get } from '@nestjs/common';
import { ITotalStats } from './interfaces/ITotalStats.interface';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/total-status')
  totalStatus(): Promise<ITotalStats> {
    return this.reportsService.getTotalStatus();
  }
}
