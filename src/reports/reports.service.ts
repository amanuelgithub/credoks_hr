import { Injectable } from '@nestjs/common';
import { CompaniesReportService } from 'src/companies/companies-report.service';
import { DepartmentsReportService } from 'src/departments/departments-report.service';
import { EmployeesReportService } from 'src/employees/services/employees-report.service';
import { LocationsReportService } from 'src/locations/locations-report.service';
import { PositionsReportService } from 'src/positions/positions-report.service';
import { ITotalCompanyStats } from './interfaces/ITotalCompanyStats.interface';
import { ITotalCompaniesStats } from './interfaces/ITotalCompaniesStats.interface';
import { Company } from 'src/companies/entities/company.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { EmployeesService } from 'src/employees/services/employees.service';
import { getMonthStr, getYearInNum } from 'src/utils/time';

interface IMonthlyReport {
  month: string;
  noNewEmp: number;
}

interface ICompanyNewEmpReport {
  companyId: string;
  companyName: string;
  year: number;
  monthlyReport: IMonthlyReport[];
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly companiesReportService: CompaniesReportService,
    private readonly employeesReportService: EmployeesReportService,
    private readonly departmentsReportService: DepartmentsReportService,
    private readonly locationsReportService: LocationsReportService,
    private readonly positionsReportService: PositionsReportService,

    private readonly employeesService: EmployeesService,
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

  async getCompaniesNewEmployeeReport(
    year: number,
  ): Promise<ICompanyNewEmpReport[]> {
    const reports: ICompanyNewEmpReport[] = [];

    // all companies
    const companies: Company[] =
      await this.companiesReportService.getCompanies();
    // all employees
    const employees: Employee[] =
      await this.employeesService.findEmployeesInCompanies();

    // setup the report for every company
    for (const company of companies) {
      const initCompanyReport: ICompanyNewEmpReport = {
        companyId: company.id,
        companyName: company.name,
        year: year,
        monthlyReport: [
          { month: 'Jan', noNewEmp: 0 },
          { month: 'Feb', noNewEmp: 0 },
          { month: 'Mar', noNewEmp: 0 },
          { month: 'Apr', noNewEmp: 0 },
          { month: 'May', noNewEmp: 0 },
          { month: 'Jun', noNewEmp: 0 },
          { month: 'Jul', noNewEmp: 0 },
          { month: 'Aug', noNewEmp: 0 },
          { month: 'Sep', noNewEmp: 0 },
          { month: 'Oct', noNewEmp: 0 },
          { month: 'Nov', noNewEmp: 0 },
          { month: 'Dec', noNewEmp: 0 },
        ],
      };
      reports.push(initCompanyReport);
    }

    // iterate through all employees in every company and
    // increment the newly registered employees count property.
    for (const employee of employees) {
      const empJoiningYear = getYearInNum(employee.createdAt);

      // first employees joined year must be the same as the requested year
      if (empJoiningYear == year) {
        // the company to include the employee to
        let report: ICompanyNewEmpReport;
        for (const companyReport of reports) {
          if (employee.companyId === companyReport.companyId) {
            report = companyReport;
          }
        }

        // iterate over the monthlyReport array to add the employee
        for (let index = 0; index < report?.monthlyReport.length; index++) {
          if (
            getMonthStr(employee.createdAt) ===
            report.monthlyReport[index].month
          ) {
            // increment the count by one
            report.monthlyReport[index].noNewEmp++;
          }
        }
      }
    }

    return reports;
  }
}
