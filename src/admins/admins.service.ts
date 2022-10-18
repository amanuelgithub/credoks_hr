import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin, IAdmin } from './entities/admin.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    private usersService: UsersService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
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
      // admin related properties
    } = createAdminDto;

    const oldUser = await this.usersService.findUserByEmail(email);

    let admin: IAdmin;

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

      const createAdminDto = {};

      // create & save user
      const user = await this.usersService.create(createUserDto);

      admin = this.adminsRepository.create(createAdminDto);

      admin.user = user;

      return await this.adminsRepository.save(admin);
    } else {
      throw new ConflictException('Email is taken!');
    }
  }

  async findAll(): Promise<Admin[]> {
    const admins = await this.adminsRepository.find();
    if (!admins) {
      throw new NotFoundException('Admins Not Found!');
    }
    return admins;
  }

  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminsRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin Not Found!');
    }
    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);

    const {} = updateAdminDto;

    return await this.adminsRepository.save(admin);
  }

  async remove(id: string): Promise<void> {
    const admin = await this.findOne(id);
    await this.usersService.remove(admin.user.id);
  }
}
