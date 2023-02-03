import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
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
import { EmploymentStatusEnum } from '../enums/employment-status.enum';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateEmploymentStatusDto } from '../dto/update-employment-status.dto';
import { PROBATION_PERIOD } from '../constants';

export interface ICompanyEmployeeReport {
  companyName: string;
  totalEmployees: number;
  employmentStatus: {
    confirmed: number;
    contract: number;
    probation: number;
    trainee: number;
  };
}

@Injectable()
export class EmployeesService {
  private logger: Logger;

  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private companyService: CompaniesService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {
    this.logger = new Logger();
  }

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

  // create an employee and associate it with the company entity
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

  // returns all employees in all the companies
  async findEmployeesInCompanies(): Promise<Employee[]> {
    await this.companiesEmployeesReport();

    const employees = await this.employeesRepository.find();

    if (!employees) {
      throw new NotFoundException('Employees Not Found!');
    }

    return employees;
  }

  // returns all employees of spcefic company
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
      filteredEmployees = await this.employeesRepository.find();
      // filteredEmployees = await this.employeesRepository.find({
      //   where: { company: selectedCompany },
      // });
    } else if (
      (requestingEmployee.type === UserTypeEnum.MANAGER &&
        requestingEmployee.company.id === selectedCompany.id) ||
      (requestingEmployee.type === UserTypeEnum.HR &&
        requestingEmployee.company.id === selectedCompany.id)
    ) {
      console.log('companyid: ', companyId);
      // filter list of employees by the company of the manager or hr
      filteredEmployees = await this.employeesRepository.find({
        where: { companyId: selectedCompany.id },
      });
    } else {
      // employee with `EMPLOYEE` type cannot access list of employees
      throw new ForbiddenException();
    }

    this.logger.debug('employees of a company: ', filteredEmployees);

    if (!filteredEmployees) {
      throw new NotFoundException('Employees Not Found!');
    }

    return filteredEmployees;
  }

  // returns all employees of a company that have a `employementStatus` type of
  // 'Probation' but have completed their probation time.
  async findEmployeesWithCompletedProbationTimeOfACompany(
    requestingUser: any,
    companyId: string,
  ): Promise<Employee[]> {
    const employeesInCompany = await this.findEmployeesByCompany(
      requestingUser,
      companyId,
    );

    const empWithProbationCompleted =
      this.getEmployeesWithProbationTimeCompleted(employeesInCompany);

    this.logger.debug('Probation completed', empWithProbationCompleted);

    return empWithProbationCompleted;
  }

  // returns employee by on the condition that the requester has the autority
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
        hashedRt,
        employmentStatus,
        maritalStatus,
        dateOfJoining,
        confirmationDate,
        tinNumber,
        bankName,
        bankAccountNumber,
      } = updateEmployeeDto;

      employee.firstName = firstName;
      employee.fatherName = fatherName;
      employee.grandFatherName = grandFatherName;
      employee.gender = gender;
      employee.dateOfBirth = dateOfBirth;
      employee.type = type;
      employee.email = email;
      employee.phone = phone;
      employee.hashedRt = hashedRt;
      employee.employmentStatus = employmentStatus;
      employee.maritalStatus = maritalStatus;
      employee.dateOfJoining = dateOfJoining;
      employee.confirmationDate = confirmationDate;
      employee.tinNumber = tinNumber;
      employee.bankName = bankName;
      employee.bankAccountNumber = bankAccountNumber;

      return await this.employeesRepository.save(employee);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException();
      }
    }
  }

  async updateEmployementStatus(
    requestingUser: any,
    id: string,
    updateEmploymentStatusDto: UpdateEmploymentStatusDto,
  ): Promise<Employee> {
    const employee = await this.findEmployeeById(id);

    const { employmentStatus } = updateEmploymentStatusDto;

    employee.employmentStatus = employmentStatus;

    return await this.employeesRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    const result = await this.employeesRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Employee Not Found!');
    }
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const employee = await this.findEmployeeById(id);

    const hashedPassword = await this.getHashedPassword(
      changePasswordDto.password,
    );

    employee.password = hashedPassword;

    return await this.employeesRepository.save(employee);
  }

  // upload employee cv
  async uploadEmployeeCV(id: string, cv: { cv: any }): Promise<any> {
    const employee = await this.findEmployeeById(id);
    employee.cv = cv.cv;

    return await this.employeesRepository.save(employee);
  }

  // upload profile images
  async uploadProfileImage(
    id: string,
    profileImage: { profileImage: any },
  ): Promise<any> {
    const user = await this.findEmployeeById(id);
    user.profileImage = profileImage.profileImage;

    return this.employeesRepository.save(user);
  }

  //=================================================================================//
  // Methods below this line are not directly being used by the employees-controller //
  //=================================================================================//

  /** returns list of all eligible employees for payment in the specificed company */
  async findAllActiveEmployees(companyId: string): Promise<Employee[]> {
    const employees = await this.employeesRepository.find({
      where: { eligibleForPayment: true, companyId: companyId },
    });

    if (!employees) {
      throw new NotFoundException('Not Active Employees Found');
    }

    return employees;
  }

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
      hashedRt,
      employmentStatus,
      maritalStatus,
      dateOfJoining,
      confirmationDate,
      tinNumber,
      bankName,
      bankAccountNumber,
    } = updateEmployeeDto;

    employee.firstName = firstName;
    employee.fatherName = fatherName;
    employee.grandFatherName = grandFatherName;
    employee.gender = gender;
    employee.dateOfBirth = dateOfBirth;
    employee.type = type;
    employee.email = email;
    employee.phone = phone;
    employee.hashedRt = hashedRt;
    employee.employmentStatus = employmentStatus;
    employee.maritalStatus = maritalStatus;
    employee.dateOfJoining = dateOfJoining;
    employee.confirmationDate = confirmationDate;
    employee.tinNumber = tinNumber;
    employee.bankName = bankName;
    employee.bankAccountNumber = bankAccountNumber;

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
    try {
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
    } catch (error) {
      throw new NotFoundException('Employee Not Found!');
    }
  }

  // reporting related
  async companiesEmployeesReport(): Promise<ICompanyEmployeeReport[]> {
    const reportContainerArray: ICompanyEmployeeReport[] = [];

    const companies = await this.companyService.findAll();

    const confirmedEmp = EmploymentStatusEnum.CONFIRMED;
    const contractEmp = EmploymentStatusEnum.CONTRACT;
    const probationEmp = EmploymentStatusEnum.PROBAATION;
    const traineeEmp = EmploymentStatusEnum.TRAINEE;

    for (const company of companies) {
      const companyId = company.id;

      const totalCompanyEmp = await this.employeesRepository
        .createQueryBuilder('employees')
        .where('employees.company = :companyId', { companyId })
        .getCount();

      const totalConfirmedEmp = await this.employeesRepository
        .createQueryBuilder('employees')
        .where('employees.company = :companyId', { companyId })
        .andWhere('employees.employmentStatus = :confirmedEmp', {
          confirmedEmp,
        })
        .getCount();

      const totalContractEmp = await this.employeesRepository
        .createQueryBuilder('employees')
        .where('employees.company = :companyId', { companyId })
        .andWhere('employees.employmentStatus = :contractEmp', { contractEmp })
        .getCount();

      const totalProbationEmp = await this.employeesRepository
        .createQueryBuilder('employees')
        .where('employees.company = :companyId', { companyId })
        .andWhere('employees.employmentStatus = :probationEmp', {
          probationEmp,
        })
        .getCount();

      const totalTraineeEmp = await this.employeesRepository
        .createQueryBuilder('employees')
        .where('employees.company = :companyId', { companyId })
        .andWhere('employees.employmentStatus = :traineeEmp', { traineeEmp })
        .getCount();

      const companyEmloyeeReport: ICompanyEmployeeReport = {
        companyName: company.name,
        totalEmployees: totalCompanyEmp,
        employmentStatus: {
          confirmed: totalConfirmedEmp,
          contract: totalContractEmp,
          probation: totalProbationEmp,
          trainee: totalTraineeEmp,
        },
      };

      reportContainerArray.push(companyEmloyeeReport);
    }

    return reportContainerArray;
  }

  //==================================================//
  //              UTILITY FUNCTIONS                   //
  //==================================================//
  getEmployeesWithProbationTimeCompleted(employees: Employee[]): Employee[] {
    const empWithProbationCompleted: Employee[] = [];
    for (const employee of employees) {
      if (employee.employmentStatus === EmploymentStatusEnum.PROBAATION) {
        // day since registration is the total number of days from registration till current date
        const registrationDate = employee.createdAt;
        const currentDate = new Date(Date.now());

        // To calculate the time difference of two dates
        const differenceInTime =
          currentDate.getTime() - registrationDate.getTime();

        // To calculate the no. of days between two dates
        const differenceInDays = Math.floor(
          differenceInTime / (1000 * 3600 * 24),
        );

        if (PROBATION_PERIOD - differenceInDays <= 0) {
          empWithProbationCompleted.push(employee);
        }
      }
    }

    this.logger.debug('empWithProbationCompleted', empWithProbationCompleted);

    return empWithProbationCompleted;
  }
}
