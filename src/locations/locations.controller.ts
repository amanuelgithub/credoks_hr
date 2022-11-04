import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { AtGuard } from 'src/auth/guards/at.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { Action, AppAbility } from 'src/casl/casl-ability.factory';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Location))
  create(
    @Req() req,
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    return this.locationsService.create(req.user, createLocationDto);
  }

  // admin only endpoint
  @Get()
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Location))
  findLocations(): Promise<Location[]> {
    return this.locationsService.findLocations();
  }

  @Get('/company/:companyId')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Location))
  findLocationsOfCompany(
    @Req() req,
    @Param('companyId') companyId: string,
  ): Promise<Location[]> {
    return this.locationsService.findLocationsOfCompany(req.user, companyId);
  }

  @Get(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Location))
  findOneLocation(@Req() req, @Param('id') id: string): Promise<Location> {
    return this.locationsService.findLocation(req.user, id);
  }

  @Patch(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Location))
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationsService.update(req.user, id, updateLocationDto);
  }

  @Delete(':id')
  @UseGuards(AtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Location))
  remove(@Param('id') id: string): Promise<void> {
    return this.locationsService.remove(id);
  }
}
