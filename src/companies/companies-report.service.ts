import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesReportService {
  constructor(
    @InjectRepository(Company)
    private companiesReportService: Repository<Company>,
  ) {}

  // return count of companies
  async getTotalNumberOfCompanies(): Promise<number> {
    const totalCompanies = await this.companiesReportService
      .createQueryBuilder('companies')
      .getCount();

    return totalCompanies;
  }
}
