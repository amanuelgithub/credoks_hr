import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin = this.adminsRepository.create(createAdminDto);
    return await this.adminsRepository.save(admin);
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
    const result = await this.adminsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Admin Not Found!');
    }
  }
}
