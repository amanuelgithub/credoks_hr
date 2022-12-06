import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { CompaniesModule } from 'src/companies/companies.module';
import { CaslModule } from 'src/casl/casl.module';
import { DepartmentsReportService } from './departments-report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    CompaniesModule,
    CaslModule,
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentsReportService],
  exports: [DepartmentsService, DepartmentsReportService],
})
export class DepartmentsModule {}
