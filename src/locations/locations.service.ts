import { ForbiddenError } from '@casl/ability';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CompaniesService } from 'src/companies/companies.service';
import { UserTypeEnum } from 'src/employees/enums/user-type.enum';
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
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  /** creata a location for a company */
  async create(
    requester: any,
    createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    const { companyId, country, city, specificLocationName } =
      createLocationDto;

    const company = await this.companiesService.findOne(companyId);

    const location = this.locationsRepository.create({
      companyId,
      country,
      city,
      specificLocationName,
    });

    location.company = company;

    const requesterAbility = this.caslAbilityFactory.createForUser(requester);

    try {
      ForbiddenError.from(requesterAbility)
        .setMessage('You are not allowed to create new location!')
        .throwUnlessCan(Action.Create, location);

      return await this.locationsRepository.save(location);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // ADMIN ONLY ENDPOINT
  /** returns all locations for all companies */
  async findLocations(): Promise<Location[]> {
    const employees = await this.locationsRepository.find();
    if (!employees) {
      throw new NotFoundException('Locations Not Found!');
    }
    return employees;
  }

  /** returns all locations of a company */
  async findLocationsOfCompany(
    requester: any,
    companyId: string,
  ): Promise<Location[]> {
    // employees does not have the ability to view list of locations
    if (requester.type === UserTypeEnum.EMPLOYEE) {
      throw new ForbiddenException();
    }
    // manager and hrs can only view company's locations of their own
    else if (
      (requester.type === UserTypeEnum.MANAGER ||
        requester.type === UserTypeEnum.HR) &&
      requester?.companyId !== companyId
    ) {
      throw new ForbiddenException();
    }

    const companyLocations = await this.locationsRepository
      .createQueryBuilder('location')
      .where('location.companyId = :companyId', { companyId })
      .getMany();

    if (!companyLocations) {
      throw new NotFoundException('Locations Not Found!');
    }

    return companyLocations;
  }

  async findLocation(requester: any, id: string): Promise<Location> {
    const location = await this.locationsRepository.findOne({ where: { id } });

    const requesterAbility = this.caslAbilityFactory.createForUser(requester);

    try {
      ForbiddenError.from(requesterAbility)
        .setMessage('You are not allowed to view this location!')
        .throwUnlessCan(Action.Read, location);

      return location;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async update(
    requester: any,
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findLocationById(id);

    const requesterAbility = this.caslAbilityFactory.createForUser(requester);

    try {
      ForbiddenError.from(requesterAbility)
        .setMessage("You don't have the ability to update this location!")
        .throwUnlessCan(Action.Update, location);

      const { country, city, specificLocationName } = updateLocationDto;

      location.country = country;
      location.city = city;
      location.specificLocationName = specificLocationName;

      return await this.locationsRepository.save(location);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // the remove method are here to help in the development of the applications
  // later I need to change them to something else.
  async remove(id: string): Promise<void> {
    const result = await this.locationsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Location Not Found!');
    }
  }

  //=================================================================================//
  // Methods below this line are not directly being used by the employees-controller //
  //=================================================================================//
  async findLocationById(id: string): Promise<Location> {
    const location = await this.locationsRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException();
    }

    return location;
  }
}
