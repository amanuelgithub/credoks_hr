import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, IEmployee } from './entities/employee.entity';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private usersService: UsersService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const {
      // user related properties
      firstName,
      lastName,
      email,
      phone,
      password,
      type,
      dateOfBirth,
      gender,
      // employee related properties
      status,
      dateOfJoining,
      confirmationDate,
      emergencyContactName,
      emergencyContactNumber,
      fatherName,
      spouseName,
      accountNumber,
    } = createEmployeeDto;

    const oldUser = await this.usersService.findUserByEmail(email);

    if (!oldUser) {
      // salting and hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const createUserDto: CreateUserDto = {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        type,
        dateOfBirth,
        gender,
      };

      const createEmployeeDto: CreateEmployeeDto = {
        status,
        dateOfJoining,
        confirmationDate,
        emergencyContactName,
        emergencyContactNumber,
        fatherName,
        spouseName,
        accountNumber,
      };

      // create & save user
      const user = await this.usersService.create(createUserDto);
      // create & save employee
      const employee = await this.createAttachingUser(user, createEmployeeDto);

      return employee;
    } else {
      throw new ConflictException('Email is taken!');
    }
    // const employee = this.employeesRepository.create(createEmployeeDto);
    // return await this.employeesRepository.save(employee);
  }

  async createAttachingUser(
    user: IUser,
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    const employee = this.employeesRepository.create(createEmployeeDto);
    employee.user = user;
    return await this.employeesRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    const employees = await this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .getMany();

    if (!employees) {
      throw new NotFoundException('Employees Not Found!');
    }

    return employees;
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee Not Found!');
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    const {
      status,
      dateOfJoining,
      confirmationDate,
      emergencyContactName,
      emergencyContactNumber,
      fatherName,
      spouseName,
      accountNumber,
    } = updateEmployeeDto;

    employee.status = status;
    employee.dateOfJoining = dateOfJoining;
    employee.confirmationDate = confirmationDate;
    employee.emergencyContactName = emergencyContactName;
    employee.emergencyContactNumber = emergencyContactNumber;
    employee.fatherName = fatherName;
    employee.spouseName = spouseName;
    employee.accountNumber = accountNumber;

    return await this.employeesRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.usersService.remove(employee.user.id);
  }
}
