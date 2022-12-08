import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsReportService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
  ) {}

  // returns total number of departments in all the companies
  async getTotalNumberOfDepartments(): Promise<number> {
    const totalDepartments = await this.departmentsRepository
      .createQueryBuilder('departmnet')
      .getCount();

    return totalDepartments;
  }

  // return total number of departments of a single company
  async getTotalNumberOfDepartmentsOfCompany(
    companyId: string,
  ): Promise<number> {
    const totalEmpOfComp = await this.departmentsRepository
      .createQueryBuilder('department')
      .where('department.companyId = :companyId', { companyId })
      .getCount();

    return totalEmpOfComp;
  }
}
