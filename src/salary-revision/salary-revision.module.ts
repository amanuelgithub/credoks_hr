import { Module } from '@nestjs/common';
import { SalaryRevisionService } from './salary-revision.service';
import { SalaryRevisionController } from './salary-revision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryRevision } from './entities/salary-revision.entity';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalaryRevision]),
    SalaryRevision,
    EmployeesModule,
  ],
  controllers: [SalaryRevisionController],
  providers: [SalaryRevisionService],
})
export class SalaryRevisionModule {}
