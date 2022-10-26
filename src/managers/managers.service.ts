import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { IManager, Manager } from './enitities/manager.entity';
import { CreateEmployeeDto } from 'src/employees/dto/create-employee.dto';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private managersRepository: Repository<Manager>,
    private usersService: UsersService,
    private employeesService: EmployeesService,
  ) {}

  async create(createManagerDto: CreateManagerDto): Promise<Manager> {
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
      // manager related properties
    } = createManagerDto;

    const oldUser = await this.usersService.findUserByEmail(email);

    let manager: IManager;

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

      // no properties yet available
      const createManagerDto = {};

      // create user & save user
      const user = await this.usersService.create(createUserDto);
      // create & save employee
      const employee = await this.employeesService.createAttachingUser(
        user,
        createEmployeeDto,
      );

      // create employee
      manager = this.managersRepository.create(createManagerDto);
      // link employee to manager
      manager.employee = employee;
      // link user to employee
      employee.user = user;

      return await this.managersRepository.save(manager);
    } else {
      throw new ConflictException('Email is taken!');
    }
  }

  async findAll(): Promise<Manager[]> {
    const managers = await this.managersRepository.find();
    if (!managers) {
      throw new NotFoundException('Managers Not Found!');
    }
    return managers;
  }

  async findOne(id: string): Promise<Manager> {
    const manager = await this.managersRepository.findOne({ where: { id } });
    if (!manager) {
      throw new NotFoundException('Manager Not Found!');
    }
    return manager;
  }

  async update(
    id: string,
    updateManagerDto: UpdateManagerDto,
  ): Promise<Manager> {
    const manager = await this.findOne(id);

    // no properties yet available
    const {} = updateManagerDto;

    return await this.managersRepository.save(manager);
  }

  async remove(id: string): Promise<void> {
    const manager = await this.findOne(id);
    await this.employeesService.remove(manager.employee.id);
    await this.usersService.remove(manager.employee.user.id);
  }
}
