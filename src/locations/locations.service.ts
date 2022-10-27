import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
    private companiesService: CompaniesService,
  ) {}

  /** creata a location for a company */
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const { companyId, country, city, specificLocationName } =
      createLocationDto;

    const company = await this.companiesService.findOne(companyId);

    const location = this.locationsRepository.create({
      country,
      city,
      specificLocationName,
    });

    location.company = company;

    return await this.locationsRepository.save(location);
  }

  /** returns all locations for all companies */
  async findLocations(): Promise<Location[]> {
    const employees = await this.locationsRepository.find();
    if (!employees) {
      throw new NotFoundException('Locations Not Found!');
    }
    return employees;
  }

  /** returns all locations of a company */
  async findLocationsOfCompany(companyId: string): Promise<Location[]> {
    const companyLocations = await this.locationsRepository
      .createQueryBuilder('location')
      .where('location.companyId = :companyId', { companyId })
      .getMany();

    if (!companyLocations) {
      throw new NotFoundException('Locations Not Found!');
    }

    return companyLocations;
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationsRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException('Location Not Found!');
    }
    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);

    const { country, city, specificLocationName } = updateLocationDto;

    location.country = country;
    location.city = city;
    location.specificLocationName = specificLocationName;

    return await this.locationsRepository.save(location);
  }

  async remove(id: string): Promise<void> {
    const result = await this.locationsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Location Not Found!');
    }
  }
}
