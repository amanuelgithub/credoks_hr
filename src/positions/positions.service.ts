import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from 'src/companies/companies.service';
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
    private companiesService: CompaniesService,
    private departmentsService: DepartmentsService,
  ) {}

  async createPosition(
    createPositionDto: CreatePositionDto,
  ): Promise<Position> {
    const { departmentId, companyId } = createPositionDto;

    const company = await this.companiesService.findOne(companyId);

    const department = await this.departmentsService.findDepartmentById(
      departmentId,
    );

    const position = this.positionsRepository.create(createPositionDto);

    position.company = company;
    position.department = department;

    return await this.positionsRepository.save(position);
  }

  async findAllPositions(): Promise<Position[]> {
    const positions = await this.positionsRepository.find();

    if (!positions) throw new NotFoundException('Position Not Found!');

    return positions;
  }

  async findPositionsByCompany(companyId: string): Promise<Position[]> {
    const positions = await this.positionsRepository.find({
      where: { companyId },
    });

    if (!positions) {
      throw new NotFoundException('Position Not Found!');
    }

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

    return await this.positionsRepository.save(position);
  }

  async remove(id: string): Promise<void> {
    const result = await this.positionsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Position Not Found!');
    }
  }
}
