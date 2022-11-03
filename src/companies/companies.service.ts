import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companiesRepository.create(createCompanyDto);
    return await this.companiesRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    const employees = await this.companiesRepository.find();
    if (!employees) {
      throw new NotFoundException('Companies Not Found!');
    }
    return employees;
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company Not Found!');
    }
    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.findOne(id);

    const { name, locations, logo, companyStatus } = updateCompanyDto;

    company.name = name;
    company.locations = locations;
    company.logo = logo;
    company.companyStatus = companyStatus;

    return await this.companiesRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const result = await this.companiesRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Company Not Found!');
    }
  }
}
