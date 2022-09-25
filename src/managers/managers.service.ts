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

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private managersRepository: Repository<Manager>,
    private usersService: UsersService,
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

      // no properties yet available
      const createManagerSpecificDto = {};

      // create user
      const user = await this.usersService.create(createUserDto);
      // create employee
      manager = this.managersRepository.create(createManagerSpecificDto);
      // link user to manager
      manager.user = user;

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
    await this.usersService.remove(manager.user.id);
  }
}
