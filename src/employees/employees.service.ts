import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeesRepository.create(createEmployeeDto);
    return await this.employeesRepository.save(employee);
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
    const result = await this.employeesRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Employee Not Found!');
    }
  }
}
