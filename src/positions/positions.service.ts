import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentsService } from 'src/departments/departments.service';
import { Repository } from 'typeorm';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
    private departmentsService: DepartmentsService,
  ) {}

  async createPosition(
    createPositionDto: CreatePositionDto,
  ): Promise<Position> {
    const { departmentId } = createPositionDto;

    const department = await this.departmentsService.findDepartmentById(
      departmentId,
    );

    const position = this.positionsRepository.create(createPositionDto);

    // create a relation with department
    position.department = department;

    return await this.positionsRepository.save(position);
  }

  async findAllPositions(): Promise<Position[]> {
    const positions = await this.positionsRepository.find();

    if (!positions) throw new NotFoundException('Position Not Found!');

    return positions;
  }

  async findPositionsByDepartment(departmentId: string): Promise<Position[]> {
    const positions = await this.positionsRepository.find({
      where: { departmentId },
    });

    if (!positions) {
      throw new NotFoundException('Position Not found!');
    }

    return positions;
  }

  async findPosition(id: string): Promise<Position> {
    const position = await this.positionsRepository.findOne({ where: { id } });

    if (!position) throw new NotFoundException('Position Not Found!');

    return position;
  }

  async updatePosition(
    id: string,
    updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    const position = await this.findPosition(id);

    const { title } = updatePositionDto;

    position.title = title;

    this.positionsRepository.save(position);

    return position;
  }

  async remove(id: string): Promise<void> {
    const result = await this.positionsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Position Not Found!');
    }
  }
}
