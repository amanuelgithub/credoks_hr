import { Module } from '@nestjs/common';
import { EmployeesService } from './services/employees.service';
import { EmployeesController } from './controllers/employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { QualificationsController } from './controllers/qualifications.controller';
import { LeaveController } from './controllers/leave.controller';
import { EmergencyContactsController } from './controllers/emergency-contacts.controller';
import { QualificationsService } from './services/qualifications.service';
import { LeaveService } from './services/leave.service';
import { EmergencyContactsService } from './services/emergency-contacts.service';
import { CaslModule } from 'src/casl/casl.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    Employee,
    CaslModule,
    CompaniesModule,
  ],
  controllers: [
    EmployeesController,
    QualificationsController,
    LeaveController,
    EmergencyContactsController,
  ],
  providers: [
    EmployeesService,
    QualificationsService,
    LeaveService,
    EmergencyContactsService,
  ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
