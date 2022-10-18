import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    return this.locationsService.create(companyId, createLocationDto);
  }

  @Get()
  findLocations(): Promise<Location[]> {
    return this.locationsService.findLocations();
  }

  @Get(':companyId')
  findLocationsOfCompany(
    @Param('companyId') companyId: string,
  ): Promise<Location[]> {
    return this.locationsService.findLocationsOfCompany(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Location> {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.locationsService.remove(id);
  }
}
