import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsReportService {
  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
  ) {}

  // returns total number of positions in a single company
  async getTotalNumberOfPositionsOfCompany(companyId: string): Promise<number> {
    const totalPositions = await this.positionsRepository
      .createQueryBuilder('position')
      .where('position.companyId = :companyId', { companyId })
      .getCount();

    return totalPositions;
  }
}
