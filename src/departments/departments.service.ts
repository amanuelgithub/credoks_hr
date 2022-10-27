import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    private companiesService: CompaniesService,
  ) {}

  /** create a department for a company */
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const { name, description, companyId } = createDepartmentDto;

    const company = await this.companiesService.findOne(companyId);

    const department = this.departmentsRepository.create({
      name,
      description,
    } as CreateDepartmentDto);

    department.company = company;

    return await this.departmentsRepository.save(department);
  }

  /** return all departments for all companies */
  async findDepartments(): Promise<Department[]> {
    const departments = await this.departmentsRepository.find();
    if (!departments) {
      throw new NotFoundException('Departments Not Found!');
    }
    return departments;
  }

  /** return all departments of a company */
  async findDepartmentsOfCompany(companyId: string): Promise<Department[]> {
    const companyDepartments = await this.departmentsRepository
      .createQueryBuilder('department')
      .where('department.companyId = :companyId', { companyId })
      .getMany();

    if (!companyDepartments) {
      throw new NotFoundException('Departments Not Found!');
    }

    return companyDepartments;
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException('Department Not Found!');
    }
    return department;
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);

    const { name, description } = updateDepartmentDto;

    department.name = name;
    department.description = description;

    return await this.departmentsRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const result = await this.departmentsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Department Not Found!');
    }
  }
}
