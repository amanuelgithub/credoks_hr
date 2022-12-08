import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeesReportService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  // returns total number of employees in all the companies
  async getTotalNumberOfEmployees(): Promise<number> {
    const totalEmployees = await this.employeesRepository
      .createQueryBuilder('employee')
      .getCount();

    return totalEmployees;
  }

  // return total number of employees of a single company
  async getTotalNumberOfEmployeesOfCompany(companyId: string): Promise<number> {
    const totalEmpOfComp = await this.employeesRepository
      .createQueryBuilder('employee')
      .where('employee.companyId = :companyId', { companyId })
      .getCount();

    return totalEmpOfComp;
  }
}
