import { Controller, Get, Param } from '@nestjs/common';
import { ITotalCompanyStats } from './interfaces/ITotalCompanyStats.interface';
import { ITotalCompaniesStats } from './interfaces/ITotalCompaniesStats.interface';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/companies-total-stats')
  companiesTotalStatus(): Promise<ITotalCompaniesStats> {
    return this.reportsService.getTotalStatus();
  }

  @Get('/:companyId/company-total-stats')
  companyTotalStats(
    @Param('companyId') companyId: string,
  ): Promise<ITotalCompanyStats> {
    return this.reportsService.getTotalStatsOfCompany(companyId);
  }

  @Get('/companies-new-employees-report/:year')
  getAllCompaniesNewEmployeesReport(@Param('year') year: number): Promise<any> {
    console.log('year: ', year);
    const newEmployees =
      this.reportsService.getCompaniesNewEmployeeReport(year);

    return newEmployees;
  }

  // companies new employees
}
