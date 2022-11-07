import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee } from '../entities/employee.entity';
import { CompaniesService } from 'src/companies/companies.service';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { UserTypeEnum } from '../enums/user-type.enum';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private companyService: CompaniesService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async createAdmin(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const { email, password } = createEmployeeDto;

    if (!(await this.employeeExistWithSameEmail(email))) {
      const hashedPassword = await this.getHashedPassword(password);

      const employee = this.employeesRepository.create({
        ...createEmployeeDto,
        password: hashedPassword,
      });

      return await this.employeesRepository.save(employee);
    } else {
      throw new ConflictException('Email is already in Use.');
    }
  }

  async createEmployeeInCompany(
    reqestingUser: any,
    companyId: string,
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    const { email, password } = createEmployeeDto;

    const requestingUserAbility =
      this.caslAbilityFactory.createForUser(reqestingUser);

    if (!(await this.employeeExistWithSameEmail(email))) {
      // salting and hash password
      const hashedPassword = await this.getHashedPassword(password);

      // automatically fill company fields. since we know from which company
      // the requested employee creation request comes from.
      const company = await this.companyService.findOne(companyId);

      const employee = this.employeesRepository.create({
        ...createEmployeeDto,
        password: hashedPassword,
      });
      // add company relation
      employee.company = company;

      try {
        ForbiddenError.from(requestingUserAbility)
          .setMessage('You are not allowed!')
          .throwUnlessCan(Action.Create, employee);

        return await this.employeesRepository.save(employee);
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new ForbiddenException(error.message);
        }
      }
    } else {
      throw new ConflictException('Email is already taken!');
    }
  }

  async findEmployeesInCompanies(): Promise<Employee[]> {
    const employees = await this.employeesRepository.find();

    if (!employees) {
      throw new NotFoundException('Employees Not Found!');
    }

    return employees;
  }

  async findEmployeesByCompany(
    requestingUser: any,
    companyId: string,
  ): Promise<Employee[]> {
    const { sub: employeeId } = requestingUser;

    const requestingEmployee = await this.findEmployeeById(employeeId);
    const selectedCompany = await this.companyService.findOne(companyId);

    let filteredEmployees: Employee[];

    // check if employee UserTypeEnum is either `MANAGER` or `ADMIN` or `HR`
    if (requestingEmployee.type === UserTypeEnum.ADMIN) {
      // just filter employees list by the provided companyId parameter
      filteredEmployees = await this.employeesRepository.find({
        where: { company: selectedCompany },
      });
    } else if (
      (requestingEmployee.type === UserTypeEnum.MANAGER &&
        requestingEmployee.company.id === selectedCompany.id) ||
      (requestingEmployee.type === UserTypeEnum.HR &&
        requestingEmployee.company.id === selectedCompany.id)
    ) {
      // filter list of employees by the company of the manager or hr
      filteredEmployees = await this.employeesRepository.find({
        where: { company: requestingEmployee.company },
      });
    } else {
      // employee with `EMPLOYEE` type cannot access list of employees
      throw new ForbiddenException();
    }

    if (!filteredEmployees) {
      throw new NotFoundException('Employees Not Found!');
    }

    return filteredEmployees;
  }

  async findOneEmployee(requestingUser: any, id: string): Promise<Employee> {
    const employee = await this.findEmployeeById(id);

    const requestingUserAbility =
      this.caslAbilityFactory.createForUser(requestingUser);

    try {
      ForbiddenError.from(requestingUserAbility)
        .setMessage('You are not allowed to view this employee.')
        .throwUnlessCan(Action.Read, employee);

      return employee;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException();
      }
    }
  }

  async updateEmployee(
    requestingUser: any,
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findEmployeeById(id);

    const requestingUserAbility =
      this.caslAbilityFactory.createForUser(requestingUser);

    try {
      ForbiddenError.from(requestingUserAbility)
        .setMessage('You are not allowed to modify this employee!')
        .throwUnlessCan(Action.Update, employee);

      const {
        firstName,
        fatherName,
        grandFatherName,
        gender,
        dateOfBirth,
        type,
        email,
        phone,
        password,
        hashedRt,
        employmentStatus,
        maritalStatus,
        dateOfJoining,
        confirmationDate,
        tinNumber,
        accountNumber,
      } = updateEmployeeDto;

      employee.firstName = firstName;
      employee.fatherName = fatherName;
      employee.grandFatherName = grandFatherName;
      employee.gender = gender;
      employee.dateOfBirth = dateOfBirth;
      employee.type = type;
      employee.email = email;
      employee.phone = phone;
      employee.password = password;
      employee.hashedRt = hashedRt;
      employee.employmentStatus = employmentStatus;
      employee.maritalStatus = maritalStatus;
      employee.dateOfJoining = dateOfJoining;
      employee.confirmationDate = confirmationDate;
      employee.tinNumber = tinNumber;
      employee.accountNumber = accountNumber;

      return await this.employeesRepository.save(employee);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException();
      }
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.employeesRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Employee Not Found!');
    }
  }

  //=================================================================================//
  // Methods below this lien are not directly being used by the employees-controller //
  //=================================================================================//
  async findEmployeeByEmail(email: string): Promise<Employee> {
    const employee = await this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.company', 'company')
      .where('employee.email =:email', { email })
      .getOne();

    if (!employee) {
      throw new NotFoundException('Employee Not Found!');
    }
    return employee;
  }

  async findEmployeeById(id: string): Promise<Employee> {
    const employee = await this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.company', 'company')
      .where('employee.id =:id', { id })
      .getOne();

    if (!employee) {
      throw new NotFoundException('Employee Not Found!');
    }
    return employee;
  }

  async employeeExistWithSameEmail(email: string): Promise<boolean> {
    const employee = await this.employeesRepository.findOne({
      where: { email },
    });

    return employee ? true : false;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findEmployeeById(id);

    const {
      firstName,
      fatherName,
      grandFatherName,
      gender,
      dateOfBirth,
      type,
      email,
      phone,
      password,
      hashedRt,
      employmentStatus,
      maritalStatus,
      dateOfJoining,
      confirmationDate,
      tinNumber,
      accountNumber,
    } = updateEmployeeDto;

    employee.firstName = firstName;
    employee.fatherName = fatherName;
    employee.grandFatherName = grandFatherName;
    employee.gender = gender;
    employee.dateOfBirth = dateOfBirth;
    employee.type = type;
    employee.email = email;
    employee.phone = phone;
    employee.password = password;
    employee.hashedRt = hashedRt;
    employee.employmentStatus = employmentStatus;
    employee.maritalStatus = maritalStatus;
    employee.dateOfJoining = dateOfJoining;
    employee.confirmationDate = confirmationDate;
    employee.tinNumber = tinNumber;
    employee.accountNumber = accountNumber;

    return await this.employeesRepository.save(employee);
  }

  async getHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async getLeaveBalances(employeeId: string): Promise<{
    totalLeaveBalance: number;
    totalSickLeaveBalance: number;
    totalAnnualLeaveBalance: number;
    totalMaternityLeaveBalance: number;
    totalMarriageLeaveBalance: number;
    totalPaternityLeaveBalance: number;
  }> {
    const employeeLeaveBalances = await this.employeesRepository
      .createQueryBuilder('user')
      .select([
        'user.totalLeaveBalance',
        'user.totalSickLeaveBalance',
        'user.totalAnnualLeaveBalance',
        'user.totalMaternityLeaveBalance',
        'user.totalMarriageLeaveBalance',
        'user.totalPaternityLeaveBalance',
      ])
      .where('user.id = :employeeId', { employeeId })
      .getRawOne();

    return {
      totalLeaveBalance: employeeLeaveBalances.user_totalLeaveBalance,

      totalSickLeaveBalance: employeeLeaveBalances.user_totalSickLeaveBalance,

      totalAnnualLeaveBalance:
        employeeLeaveBalances.user_totalAnnualLeaveBalance,

      totalMaternityLeaveBalance:
        employeeLeaveBalances.user_totalMaternityLeaveBalance,

      totalMarriageLeaveBalance:
        employeeLeaveBalances.user_totalMarriageLeaveBalance,

      totalPaternityLeaveBalance:
        employeeLeaveBalances.user_totalPaternityLeaveBalance,
    };
  }
}
