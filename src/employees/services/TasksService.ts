import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  @Cron(CronExpression.EVERY_10_HOURS)
  async handleCron() {
    const id = '45678905432';

    // 1. find list of employees with employmentStaus of `Probation`
    // 2. check if employee has reached their probation period
    // 3. if employee reached their `Probation` period then add them to the list
    // 4. finally send a kind of notification for the HR person in that company

    const employees = await this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.id : = id', { id })
      .getMany();

    this.logger.debug('Called when the current second is 45');

    for (const employee of employees) {
      this.logger.debug('Employees: ', employee.firstName);
    }
  }
}
