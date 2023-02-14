import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { Repository } from 'typeorm';
import { PROBATION_PERIOD } from '../constants';
import { Employee } from '../entities/employee.entity';
import { EmploymentStatusEnum } from '../enums/employment-status.enum';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async getEmployeesWithProbationTimeCompleted(
    companyId: string,
  ): Promise<Employee[]> {
    const employees = await this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.companyId =:companyId', { companyId })
      .getMany();

    const empWithProbationCompleted: Employee[] = [];
    for (const employee of employees) {
      if (employee.employmentStatus === EmploymentStatusEnum.PROBAATION) {
        // day since registration is the total number of days from registration till current date
        const registrationDate = employee.createdAt;
        const currentDate = new Date(Date.now());

        // To calculate the time difference of two dates
        const differenceInTime =
          currentDate.getTime() - registrationDate.getTime();

        // To calculate the no. of days between two dates
        const differenceInDays = Math.floor(
          differenceInTime / (1000 * 3600 * 24),
        );

        if (PROBATION_PERIOD - differenceInDays <= 0) {
          empWithProbationCompleted.push(employee);
        }
      }
    }

    return empWithProbationCompleted;
  }
}
