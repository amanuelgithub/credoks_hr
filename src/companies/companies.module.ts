import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CaslModule } from 'src/casl/casl.module';
import { CompaniesReportService } from './companies-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), CaslModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesReportService],
  exports: [CompaniesService, CompaniesReportService],
})
export class CompaniesModule {}
