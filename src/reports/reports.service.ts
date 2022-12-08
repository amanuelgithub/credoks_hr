import { Injectable } from '@nestjs/common';
import { CompaniesReportService } from 'src/companies/companies-report.service';
import { DepartmentsReportService } from 'src/departments/departments-report.service';
import { EmployeesReportService } from 'src/employees/services/employees-report.service';
import { LocationsReportService } from 'src/locations/locations-report.service';
import { PositionsReportService } from 'src/positions/positions-report.service';
import { ITotalCompanyStats } from './interfaces/ITotalCompanyStats.interface';
import { ITotalCompaniesStats } from './interfaces/ITotalCompaniesStats.interface';

@Injectable()
export class ReportsService {
  constructor(
    private readonly companiesReportService: CompaniesReportService,
    private readonly employeesReportService: EmployeesReportService,
    private readonly departmentsReportService: DepartmentsReportService,
    private readonly locationsReportService: LocationsReportService,
    private readonly positionsReportService: PositionsReportService,
  ) {}

  // returns an object of total companies, employees, departments, locations
  async getTotalStatus(): Promise<ITotalCompaniesStats> {
    const totalCompanies =
      await this.companiesReportService.getTotalNumberOfCompanies();
    const totalEmployees =
      await this.employeesReportService.getTotalNumberOfEmployees();
    const totalDepartments =
      await this.departmentsReportService.getTotalNumberOfDepartments();
    const totalLocations =
      await this.locationsReportService.getTotalNumberOfLocations();

    const totalStatus: ITotalCompaniesStats = {
      totalCompanies,
      totalEmployees,
      totalDepartments,
      totalLocations,
    };

    return totalStatus;
  }

  // returns an object of total departments, employees, positions in a single company
  async getTotalStatsOfCompany(companyId: string): Promise<ITotalCompanyStats> {
    const totalDepartments =
      await this.departmentsReportService.getTotalNumberOfDepartmentsOfCompany(
        companyId,
      );
    const totalEmployees =
      await this.employeesReportService.getTotalNumberOfEmployeesOfCompany(
        companyId,
      );
    const totalPositions =
      await this.positionsReportService.getTotalNumberOfPositionsOfCompany(
        companyId,
      );

    const totalCompanyStats: ITotalCompanyStats = {
      totalDepartments,
      totalEmployees,
      totalPositions,
    };
    return totalCompanyStats;
  }
}
