import { ForbiddenError } from '@casl/ability';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CompaniesService } from 'src/companies/companies.service';
import { UserTypeEnum } from 'src/employees/enums/user-type.enum';
import { EmployeesService } from 'src/employees/services/employees.service';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { UpdateIsDepartmentDto } from './dto/update-is-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    private companiesService: CompaniesService,
    private employeeService: EmployeesService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  /** create a department for a company */
  async createDepartmentForCompany(
    requester: any,
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    const { name, description, companyId } = createDepartmentDto;

    if (await this.departmentExistsWithSameName(name)) {
      throw new ConflictException('Department with same name already exists!');
    }

    const company = await this.companiesService.findOne(companyId);

    const department = this.departmentsRepository.create({
      companyId,
      name,
      description,
    } as CreateDepartmentDto);
    // make a relation
    department.company = company;

    const requesterAbility = this.caslAbilityFactory.createForUser(requester);

    try {
      ForbiddenError.from(requesterAbility)
        .setMessage('You are not allowed to create department!')
        .throwUnlessCan(Action.Create, department);

      return await this.departmentsRepository.save(department);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException();
      }
    }
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
  async findDepartmentsByCompany(
    requester: any,
    companyId: string,
  ): Promise<Department[]> {
    // throw error based on user type and companyId
    if (requester.type === UserTypeEnum.EMPLOYEE) {
      throw new ForbiddenException();
    } else if (
      (requester.type === UserTypeEnum.MANAGER ||
        requester.type === UserTypeEnum.HR) &&
      requester?.companyId !== companyId
    ) {
      throw new ForbiddenException();
    }

    const companyDepartments = await this.departmentsRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.departmentHead', 'departmentHead')
      .where('department.companyId = :companyId', { companyId })
      .getMany();

    if (!companyDepartments) {
      throw new NotFoundException('Departments Not Found!');
    }

    return companyDepartments;
  }

  async findOneDepartment(requestor: any, id: string): Promise<Department> {
    const department = await this.findDepartmentById(id);

    const requestorAbility = this.caslAbilityFactory.createForUser(requestor);

    try {
      ForbiddenError.from(requestorAbility).throwUnlessCan(
        Action.Read,
        department,
      );

      return department;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async updateDepartment(
    requester: any,
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findDepartmentById(id);

    const requestorAbility = this.caslAbilityFactory.createForUser(requester);

    try {
      ForbiddenError.from(requestorAbility).throwUnlessCan(
        Action.Update,
        department,
      );

      const { name, description } = updateDepartmentDto;

      department.name = name;
      department.description = description;

      return await this.departmentsRepository.save(department);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.departmentsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Department Not Found!');
    }
  }

  async assignDepartmentHead(
    departmentId: string,
    updateIsDepartmentDto: UpdateIsDepartmentDto,
  ): Promise<void> {
    const { employeeId, isDepartmentHead } = updateIsDepartmentDto;

    const department = await this.findDepartmentById(departmentId);
    const employee = await this.employeeService.findEmployeeById(employeeId);

    department.departmentHead = employee;
    await this.departmentsRepository.save(department);

    await this.employeeService.updateIsDepartmentHeadState(
      employee,
      isDepartmentHead,
    );

    return;
  }

  //=================================================================================//
  // Methods below this lien are not directly being used by the employees-controller //
  //=================================================================================//
  async departmentExistsWithSameName(name: string): Promise<boolean> {
    const employee = await this.departmentsRepository.findOne({
      where: { name },
    });

    return employee ? true : false;
  }

  async findDepartmentById(id: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Department not found!');
    }

    return department;
  }
}
