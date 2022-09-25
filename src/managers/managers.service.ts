import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { Manager } from './enitities/manager.entity';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private managersRepository: Repository<Manager>,
  ) {}

  async create(createManagerDto: CreateManagerDto): Promise<Manager> {
    const manager = this.managersRepository.create(createManagerDto);
    return await this.managersRepository.save(manager);
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

    const {} = updateManagerDto;

    return await this.managersRepository.save(manager);
  }

  async remove(id: string): Promise<void> {
    const result = await this.managersRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Manager Not Found!');
    }
  }
}
