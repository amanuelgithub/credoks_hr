import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const { email, password } = createEmployeeDto;

    const oldEmployee = await this.findEmployeeByEmail(email);

    if (!oldEmployee) {
      // salting and hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const employee = this.employeesRepository.create({
        ...createEmployeeDto,
        password: hashedPassword,
      });

      return await this.employeesRepository.save(employee);
    } else {
      throw new ConflictException('Email is already taken!');
    }
  }

  async findAll(): Promise<Employee[]> {
    const employees = await this.employeesRepository.find();

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

  async remove(id: string): Promise<void> {
    const result = await this.employeesRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Employee Not Found!');
    }
  }

  async findEmployeeByEmail(email: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { email },
    });
    return employee;
  }
}
