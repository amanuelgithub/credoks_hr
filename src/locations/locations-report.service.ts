import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsReportService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  // return total number of locations companies
  async getTotalNumberOfLocations(): Promise<number> {
    const totalLocations = await this.locationsRepository
      .createQueryBuilder('location')
      .getCount();

    return totalLocations;
  }
}
