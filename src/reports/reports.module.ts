import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { CompaniesModule } from 'src/companies/companies.module';
import { DepartmentsModule } from 'src/departments/departments.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { LocationsModule } from 'src/locations/locations.module';
import { PositionsModule } from 'src/positions/positions.module';

@Module({
  imports: [
    CompaniesModule,
    DepartmentsModule,
    EmployeesModule,
    LocationsModule,
    LocationsModule,
    PositionsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
