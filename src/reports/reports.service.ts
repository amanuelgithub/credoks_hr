import { Injectable } from '@nestjs/common';
import { CompaniesReportService } from 'src/companies/companies-report.service';
import { DepartmentsReportService } from 'src/departments/departments-report.service';
import { EmployeesReportService } from 'src/employees/services/employees-report.service';
import { LocationsReportService } from 'src/locations/locations-report.service';
import { ITotalStats } from './interfaces/ITotalStats.interface';

@Injectable()
export class ReportsService {
  constructor(
    private readonly companiesReportService: CompaniesReportService,
    private readonly employeesReportService: EmployeesReportService,
    private readonly departmentsReportService: DepartmentsReportService,
    private readonly locationsReportService: LocationsReportService,
  ) {}

  // returns an object of total companies, employees, departments, locations
  async getTotalStatus(): Promise<ITotalStats> {
    const totalStatus = {
      totalCompanies:
        await this.companiesReportService.getTotalNumberOfCompanies(),
      totalEmployees:
        await this.employeesReportService.getTotalNumberOfEmployees(),
      totalDepartments:
        await this.departmentsReportService.getTotalNumberOfDepartments(),
      totalLocations:
        await this.locationsReportService.getTotalNumberOfLocations(),
    };

    return totalStatus;
  }
}
