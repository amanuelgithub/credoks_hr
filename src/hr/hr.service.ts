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
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
import { Hr, IHR } from './entities/hr.entity';
import { CreateEmployeeDto } from 'src/employees/dto/create-employee.dto';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Hr) private hrsRepository: Repository<Hr>,

    private usersService: UsersService,
    private employeesService: EmployeesService,
  ) {}

  async create(createHrDto: CreateHrDto): Promise<Hr> {
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
      // hr related properties
    } = createHrDto;

    const oldUser = await this.usersService.findUserByEmail(email);

    let hr: IHR;

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
      const createHrDto = {};

      // create & save user
      const user = await this.usersService.create(createUserDto);
      // create & save employee
      const employee = await this.employeesService.createHrOrManager(
        user,
        createEmployeeDto,
      );

      // create employee
      hr = this.hrsRepository.create(createHrDto);
      // link hr to employee
      hr.employee = employee;
      // link employee to user
      employee.user = user;

      return await this.hrsRepository.save(hr);
    } else {
      throw new ConflictException('Email is taken!');
    }
  }

  async findAll(): Promise<Hr[]> {
    const hrs = await this.hrsRepository.find();
    if (!hrs) {
      throw new NotFoundException('hrs Not Found!');
    }
    return hrs;
  }

  async findOne(id: string): Promise<Hr> {
    const hr = await this.hrsRepository.findOne({ where: { id } });
    if (!hr) {
      throw new NotFoundException('hr Not Found!');
    }
    return hr;
  }

  async update(id: string, updateHrDto: UpdateHrDto): Promise<Hr> {
    const hr = await this.findOne(id);

    // no properties yet available
    const {} = updateHrDto;

    return await this.hrsRepository.save(hr);
  }

  async remove(id: string): Promise<void> {
    const hr = await this.findOne(id);
    await this.employeesService.remove(hr.employee.id);
    await this.usersService.remove(hr.employee.user.id);
  }
}
