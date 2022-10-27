import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from '../dto/create-position.dto';
import { Position } from '../entities/position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const position = this.positionsRepository.create(createPositionDto);
    return await this.positionsRepository.save(position);
  }

  async findAll(): Promise<Position[]> {
    const positions = await this.positionsRepository.find();

    if (!positions) throw new NotFoundException('Posisions Not Found!');

    return positions;
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionsRepository.findOne({ where: { id } });

    if (!position) throw new NotFoundException('Posision Not Found!');

    return position;
  }

  async remove(id: string): Promise<void> {
    const result = await this.positionsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Location Not Found!');
    }
  }
}
