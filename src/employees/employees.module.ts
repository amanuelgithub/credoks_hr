import { Module } from '@nestjs/common';
import { EmployeesService } from './services/employees.service';
import { EmployeesController } from './controllers/employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { QualificationsController } from './controllers/qualifications.controller';
import { EmergencyContactsController } from './controllers/emergency-contacts.controller';
import { QualificationsService } from './services/qualifications.service';
import { EmergencyContactsService } from './services/emergency-contacts.service';
import { CaslModule } from 'src/casl/casl.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { EmergencyContact } from './entities/emergency-contact.entity';
import { Qualification } from './entities/qualification.entity';
import { ExperiencesService } from './services/experiences.service';
import { ExperiencesController } from './controllers/experiences.controller';
import { Experience } from './entities/experience.entity';
import { EmployeesReportService } from './services/employees-report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      EmergencyContact,
      Qualification,
      Experience,
    ]),
    Employee,
    CaslModule,
    CompaniesModule,
  ],
  controllers: [
    EmployeesController,
    QualificationsController,
    EmergencyContactsController,
    ExperiencesController,
  ],
  providers: [
    EmployeesService,
    QualificationsService,
    EmergencyContactsService,
    ExperiencesService,
    EmployeesReportService,
  ],
  exports: [EmployeesService, EmployeesReportService],
})
export class EmployeesModule {}
